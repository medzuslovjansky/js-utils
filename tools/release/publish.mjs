// The Publish job of .github/workflows/release.yml runs this from a checkout
// of tools/release, in the directory where the `release` artifact was
// downloaded (see pack.mjs for what it holds). For each line of manifest.tsv,
// in order: publishes the tarball if that version is not on npm, then creates
// the GitHub release `<name>@<version>` with the tarball if there is none.
// Whatever is already out is skipped, so a failed run can be re-run.
//
// Node builtins only: the Publish job installs nothing.
import { spawnSync } from 'node:child_process';
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

function must(result, what) {
  if (!result.ok) throw new Error(`${what} failed`);
  return result;
}

/**
 * `npm view` can say "absent" for a few minutes after a publish, while npm
 * scans the new version: a re-run in that window fails on `npm publish` and
 * is safe to repeat later.
 */
export function publishAll(entries, { env, run, summary }) {
  const repo = env.GITHUB_REPOSITORY;
  summary('## Published\n\n| Package | Version | npm | GitHub |\n|---|---|---|---|\n');
  for (const { name, version, tgz, notes } of entries) {
    const tag = `${name}@${version}`;
    if (run('npm', ['view', tag, 'version'], 'quiet').stdout.trim() === '') {
      must(run('npm', ['publish', `./${tgz}`, '--provenance', '--access', 'public']), `npm publish ${tag}`);
    }
    if (!run('gh', ['release', 'view', tag, '-R', repo], 'quiet').ok) {
      const args = ['release', 'create', tag, '-R', repo, '--target', env.GITHUB_SHA];
      args.push('--title', `${name} ${version}`, '--notes-file', notes, '--latest=false', tgz);
      must(run('gh', args), `gh release create ${tag}`);
    }
    summary(
      `| \`${name}\` | ${version} | [npm](https://www.npmjs.com/package/${name}/v/${version}) ` +
        `| [release](${env.GITHUB_SERVER_URL}/${repo}/releases/tag/${tag}) |\n`,
    );
  }
}

export function stepSummary(text) {
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text);
  else process.stdout.write(text);
}

export function fail(error) {
  console.error(`::error::${error.message}`);
  process.exit(1);
}

if (import.meta.main) {
  try {
    const entries = parseManifest(readFileSync('manifest.tsv', 'utf8'));
    publishAll(entries, { env: process.env, run, summary: stepSummary });
  } catch (error) {
    fail(error);
  }
}
