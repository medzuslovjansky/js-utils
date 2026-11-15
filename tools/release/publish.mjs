// The Publish job of .github/workflows/release.yml runs this from a checkout
// of tools/release, in the directory where the `release` artifact was
// downloaded (see pack.mjs for what it holds). For each line of manifest.tsv,
// in order: publishes the tarball if that version is not on npm, then creates
// the GitHub release `<name>@<version>` with the tarball if there is none.
// Whatever is already out is skipped, so a failed run can be re-run.
//
// With --plan (the dry run, from the Pack job) it makes the same reads and
// prints the writes it would make instead of making them; see planRunner.
//
// Node builtins only: the Publish job installs nothing.
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { appendFileSync, readFileSync } from 'node:fs';

/**
 * The lines of manifest.tsv. The artifact comes from a job that ran
 * `yarn install`, so every field is checked against what pack.mjs writes.
 */
export function parseManifest(text) {
  return text
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [name, version, tgz, notes, ...rest] = line.split('\t');
      const base = /^@interslavic\/[a-z0-9-]+$/.test(name) && /^\d+\.\d+\.\d+$/.test(version)
        ? `${name.slice(1).replace('/', '-')}-${version}`
        : null;
      if (!base || tgz !== `${base}.tgz` || notes !== `${base}.md` || rest.length) {
        throw new Error(`unexpected line in manifest.tsv: ${JSON.stringify(line)}`);
      }
      return { name, version, tgz, notes };
    });
}

/**
 * Runs a command without a shell, stdin closed. `mode`: 'inherit' shows its
 * output; 'capture' returns stdout; 'quiet' returns stdout and drops stderr.
 */
export function run(cmd, args, mode = 'inherit') {
  const out = mode === 'inherit' ? 'inherit' : 'pipe';
  const err = mode === 'quiet' ? 'ignore' : 'inherit';
  const result = spawnSync(cmd, args, { stdio: ['ignore', out, err], encoding: 'utf8' });
  return { ok: result.status === 0, stdout: result.stdout ?? '' };
}

/**
 * Every command plan mode may spawn, argument by argument: a string matches
 * itself, VALUE matches one argument that is not a flag. All of them only read.
 * Anything else, including a known read with one more flag, is not spawned.
 */
const VALUE = /^[^-]/;
export const READ_ONLY = [
  ['npm', 'view', VALUE, 'version'],
  ['gh', 'release', 'view', VALUE, '-R', VALUE],
  // A GET: no -X, -f, -F or --input, and not `gh api graphql`, which POSTs.
  ['gh', 'api', /^repos\/[\w.-]+\/[\w.-]+\/git\/matching-refs\/[\w./-]+$/, '--paginate', '--jq', VALUE],
];

const allowed = (argv) =>
  READ_ONLY.some((shape) =>
    shape.length === argv.length && shape.every((p, i) => (typeof p === 'string' ? p === argv[i] : p.test(argv[i]))),
  );

/** A command line for people to read, quoted as a shell would need it. */
export function render(cmd, args) {
  return [cmd, ...args].map((a) => (/^[\w@%+=:,./-]+$/.test(a) ? a : `'${a.replaceAll("'", "'\\''")}'`)).join(' ');
}

/**
 * Wraps `run` for plan mode: spawns only what READ_ONLY allows. A write is
 * pushed onto `skipped` and answered as if it had succeeded, so that the plan
 * goes on to the next step; a read that is not allowed throws.
 */
export function planRunner(run, skipped) {
  return (cmd, args, mode) => {
    if (allowed([cmd, ...args])) return run(cmd, args, mode);
    // A read that is not on the list must not be answered with an empty success:
    // the plan would then say "absent" for everything. Writes run with mode 'inherit'.
    if (mode && mode !== 'inherit') throw new Error(`plan mode: ${render(cmd, args)} is not an allowed read`);
    skipped.push(render(cmd, args));
    return { ok: true, stdout: '' };
  };
}

export function commandList(skipped) {
  return skipped.length ? `\nWould run:\n\n\`\`\`\n${skipped.join('\n')}\n\`\`\`\n` : '\nWould run nothing.\n';
}

function must(result, what) {
  if (!result.ok) throw new Error(`${what} failed`);
  return result;
}

/**
 * `npm view` can say "absent" for a few minutes after a publish, while npm
 * scans the new version: a re-run in that window fails on `npm publish` and
 * is safe to repeat later.
 */
export function publishAll(entries, { env, run, summary, plan = false }) {
  const repo = env.GITHUB_REPOSITORY;
  const heading = plan
    ? '## Plan: publish\n\nDry run. Nothing below has been published; this is what the Publish job would do.'
    : '## Published';
  summary(`${heading}\n\n| Package | Version | npm | GitHub |\n|---|---|---|---|\n`);
  for (const { name, version, tgz, notes } of entries) {
    const tag = `${name}@${version}`;
    const onNpm = run('npm', ['view', tag, 'version'], 'quiet').stdout.trim() !== '';
    if (!onNpm) {
      must(run('npm', ['publish', `./${tgz}`, '--provenance', '--access', 'public']), `npm publish ${tag}`);
    }
    const released = run('gh', ['release', 'view', tag, '-R', repo], 'quiet').ok;
    if (!released) {
      const args = ['release', 'create', tag, '-R', repo, '--target', env.GITHUB_SHA];
      args.push('--title', `${name} ${version}`, '--notes-file', notes, '--latest=false', tgz);
      must(run('gh', args), `gh release create ${tag}`);
    }
    summary(
      plan
        ? `| \`${name}\` | ${version} | ${onNpm ? 'skip: already on npm' : 'would publish: not on npm'} ` +
            `| ${released ? 'skip: release exists' : 'would create: no release yet'} |\n`
        : `| \`${name}\` | ${version} | [npm](https://www.npmjs.com/package/${name}/v/${version}) ` +
            `| [release](${env.GITHUB_SERVER_URL}/${repo}/releases/tag/${tag}) |\n`,
    );
  }
}

/** publishAll with the writes listed instead of made. */
export function planPublish(entries, { env, run, summary }) {
  const skipped = [];
  publishAll(entries, { env, run: planRunner(run, skipped), summary, plan: true });
  summary(commandList(skipped));
}

/** To the step summary of the job, or to stdout outside Actions; `echo` writes to stdout as well. */
export function stepSummary(text, echo = false) {
  // Release notes are echoed to the log: a line of them starting with `::` must not run as a workflow command.
  if (echo && process.env.GITHUB_ACTIONS) {
    const token = randomUUID();
    process.stdout.write(`::stop-commands::${token}\n${text}\n::${token}::\n`);
  } else if (echo || !process.env.GITHUB_STEP_SUMMARY) process.stdout.write(text);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text);
}

export const planOutput = (text) => stepSummary(text, true);

export function fail(error) {
  console.error(`::error::${error.message}`);
  process.exit(1);
}

/** True for `--plan`; any other argument is an error, so that a typo cannot start a real run. */
export function planFlag(argv) {
  const extra = argv.filter((a) => a !== '--plan');
  if (extra.length) throw new Error(`unknown argument: ${extra.join(' ')}`);
  return argv.length > 0;
}

if (import.meta.main) {
  try {
    const plan = planFlag(process.argv.slice(2));
    const entries = parseManifest(readFileSync('manifest.tsv', 'utf8'));
    if (plan) planPublish(entries, { env: process.env, run, summary: planOutput });
    else publishAll(entries, { env: process.env, run, summary: stepSummary });
  } catch (error) {
    fail(error);
  }
}
