import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * One pass over text the process has never seen, in a fresh process per
 * candidate — what a real caller actually gets.
 *
 * The main harness cannot answer this. Its correctness gate puts both corpora
 * through all twenty tags before the clock starts, and its timing loop repeats
 * the same text, so any candidate holding a process-lifetime cache is fully
 * warm by the time it is measured. That is fair for a long-lived server and
 * wildly unfair as a general claim, so the two questions get two tools.
 */

const here = import.meta.dirname;
const candidates = ['baseline', 'regex-compile', 'trie-fusion', 'memoize', 'old-engine'];
const TARGETS = ['isv-Latn', 'isv-Cyrl-x-iotated', 'isv-x-fonipa', 'isv-Latn-PL'];

const results = {};

for (const name of candidates) {
  const entry = path.join(here, 'out', `cold-${name}.mjs`);
  const from =
    name === 'baseline'
      ? path.join(here, '../../packages/translit/src/transliterate/transliterate.ts')
      : path.join(here, 'candidates', name, 'index.ts');

  fs.writeFileSync(
    entry,
    `import { transliterate } from ${JSON.stringify(from)};
import { lexicon } from ${JSON.stringify(path.join(here, 'out/corpora.js'))};

// halves: warm the JIT on one, measure the other, so the code is hot but the
// text is not
const half = lexicon.slice(0, lexicon.length >> 1);
const rest = lexicon.slice(lexicon.length >> 1);
const words = rest.split(/\\s+/).length;
const out = {};
for (const tag of ${JSON.stringify(TARGETS)}) {
  transliterate(half, tag);
  const t0 = performance.now();
  transliterate(rest, tag);
  out[tag] = words / ((performance.now() - t0) / 1000);
}
console.log(JSON.stringify(out));
`,
  );

  const bundle = path.join(here, 'out', `cold-${name}.bundle.mjs`);
  execFileSync(
    'npx',
    ['esbuild', entry, '--bundle', '--format=esm', '--platform=neutral', '--target=es2022', `--outfile=${bundle}`, '--log-level=error'],
    { cwd: path.join(here, '../..') },
  );
  results[name] = JSON.parse(execFileSync('node', [bundle], { encoding: 'utf8' }));
}

console.log('\ncold single pass over unseen text, node, thousands of words per second\n');
console.log('candidate'.padEnd(16) + TARGETS.map((t) => t.replace('isv-', '').padStart(13)).join(''));
for (const name of candidates) {
  const cells = TARGETS.map((t) => {
    const v = results[name][t] / 1000;
    const x = results[name][t] / results.baseline[t];
    return `${v.toFixed(0)} (${x.toFixed(1)}x)`.padStart(13);
  });
  console.log(name.padEnd(16) + cells.join(''));
}
