import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * One bundle, five runtimes.
 *
 * Node, Deno and Chrome are all V8, but not the same V8 and not the same host,
 * so they disagree more than you would expect. Bun is JavaScriptCore — the
 * engine Safari ships — and it is the one that keeps a V8-only optimisation
 * honest. Firefox is SpiderMonkey.
 *
 * The bundle is built once and handed to each runtime unchanged, so a
 * difference in the table is the runtime and never the build.
 */

const here = import.meta.dirname;
// `BENCH_OUT=out-mine` when more than one person is iterating at once: the
// bundle and the corpora are per-run scratch, and two runs sharing them
// overwrite each other's work half-way through.
const out = path.join(here, process.env.BENCH_OUT ?? 'out');
fs.mkdirSync(out, { recursive: true });

/** `BENCH_RUNTIMES=node` while iterating; the full sweep for the verdict. */
const WANTED = (process.env.BENCH_RUNTIMES ?? '').split(',').filter(Boolean);

const RUNTIMES = [
  { name: 'node', engine: 'V8', run: (f) => execFileSync('node', [f], { encoding: 'utf8' }) },
  { name: 'bun', engine: 'JavaScriptCore', run: (f) => execFileSync('bun', [f], { encoding: 'utf8' }) },
  {
    name: 'deno',
    engine: 'V8',
    run: (f) => execFileSync('deno', ['run', '--allow-read', '--allow-hrtime', f], { encoding: 'utf8' }),
  },
  {
    name: 'chrome',
    engine: 'V8 (browser)',
    run: (f) => {
      const html = path.join(out, 'bench.html');
      fs.writeFileSync(
        html,
        `<!doctype html><meta charset="utf-8"><body><pre id="o"></pre>` +
          `<script type="module">${fs.readFileSync(f, 'utf8')}</script>`,
      );
      const raw = execFileSync(
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        [
          '--headless=new',
          '--disable-gpu',
          '--no-sandbox',
          '--virtual-time-budget=600000',
          '--dump-dom',
          `file://${html}`,
        ],
        { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
      );
      const m = raw.match(/<pre id="o">([\s\S]*?)<\/pre>/);
      return m ? m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
    },
  },
];

/** The corpora are read from disk in Node and inlined for the others. */
function buildBundle(candidateEntries) {
  const entry = path.join(out, 'entry.mjs');
  const imports = candidateEntries
    .map(({ name, file }, i) => `import * as c${i} from ${JSON.stringify(file)};`)
    .join('\n');
  const list = candidateEntries
    .map(({ name }, i) => `{ name: ${JSON.stringify(name)}, engine: c${i}.transliterate }`)
    .join(',\n  ');

  fs.writeFileSync(
    entry,
    `import { transliterate as baseline } from ${JSON.stringify(
      path.join(here, '../../packages/translit/src/transliterate/transliterate.ts'),
    )};
${imports}
import { run } from ${JSON.stringify(path.join(here, 'bench.ts'))};

const results = run(baseline, [
  { name: 'baseline', engine: baseline },
  ${list}
]);
const line = JSON.stringify(results);
if (typeof document !== 'undefined') document.getElementById('o').textContent = line;
else console.log(line);
`,
  );

  fs.mkdirSync(out, { recursive: true });
  const bundle = path.join(out, 'bundle.mjs');
  execFileSync(
    'npx',
    [
      'esbuild', entry, '--bundle', '--format=esm', '--platform=neutral',
      '--target=es2022', '--loader:.gz=binary', `--outfile=${bundle}`,
      '--log-level=error',
    ],
    { cwd: path.join(here, '../..'), stdio: ['ignore', 'inherit', 'inherit'] },
  );
  return bundle;
}

const candidates = fs
  .readdirSync(path.join(here, 'candidates'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => ({ name: d.name, file: path.join(here, 'candidates', d.name, 'index.ts') }))
  .filter((c) => fs.existsSync(c.file));

console.log(
  `candidates: ${candidates.length ? candidates.map((c) => c.name).join(', ') : '(none yet — baseline only)'}\n`,
);

const bundle = buildBundle(candidates);
const table = {};

for (const rt of RUNTIMES.filter((r) => !WANTED.length || WANTED.includes(r.name))) {
  process.stdout.write(`${rt.name} … `);
  try {
    table[rt.name] = JSON.parse(rt.run(bundle));
    console.log('ok');
  } catch (error) {
    console.log(`skipped (${String(error.message).split('\n')[0].slice(0, 60)})`);
  }
}

fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(table, null, 1));

// ---- report ----
const runtimes = Object.keys(table);
if (!runtimes.length) process.exit(1);
const names = table[runtimes[0]].map((r) => r.name);
const TARGETS = Object.keys(table[runtimes[0]][0].rates.prose);

for (const workload of ['prose', 'lexicon']) {
  console.log(`\n\n=== ${workload}  (thousands of words per second, higher is better) ===\n`);
  for (const target of TARGETS) {
    console.log(`  ${target}`);
    const head = 'candidate'.padEnd(20) + runtimes.map((r) => r.padStart(9)).join('') + '   vs baseline';
    console.log('  ' + head);
    const base = {};
    for (const rt of runtimes) {
      base[rt] = table[rt].find((r) => r.name === 'baseline').rates[workload][target];
    }
    for (const name of names) {
      const cells = runtimes.map((rt) => {
        const r = table[rt].find((x) => x.name === name);
        return (r.rates[workload][target] / 1000).toFixed(0).padStart(9);
      });
      const geo = Math.exp(
        runtimes
          .map((rt) => Math.log(table[rt].find((x) => x.name === name).rates[workload][target] / base[rt]))
          .reduce((a, b) => a + b, 0) / runtimes.length,
      );
      const bad = table[runtimes[0]].find((x) => x.name === name).correct ? '' : '  WRONG OUTPUT';
      console.log('  ' + name.padEnd(20) + cells.join('') + `   ${geo.toFixed(2)}x${bad}`);
    }
    console.log('');
  }
}

const broken = table[runtimes[0]].filter((r) => !r.correct);
if (broken.length) {
  console.log('\ndisqualified — output differs from the shipped engine:');
  for (const r of broken) console.log(`  ${r.name}: ${r.wrong.slice(0, 6).join(', ')}${r.wrong.length > 6 ? ` … +${r.wrong.length - 6}` : ''}`);
}
