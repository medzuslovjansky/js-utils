// The last step of the Publish job, after publish.mjs, in the same directory.
// Creates one GitHub release per run that carries the Latest badge, so that
// the front page of the repository shows what came out and no single package
// takes it. The tag is release-<date>, with -2, -3 for another run on the same
// day: it must not start with "v", which triggers the lexicon dump. If a
// release-* tag already points at this commit (a re-run), creates nothing.
//
// With --plan (the dry run) it reads the tags for real, makes no release and
// prints the tag, title and body it would use.
//
// Node builtins only: the Publish job installs nothing.
import { readFileSync, writeFileSync } from 'node:fs';

import { commandList, fail, parseManifest, planOutput, planRunner, run } from './publish.mjs';

/**
 * The tag for this run, or null when one of `existing` ("<tag> <commit sha>"
 * lines, as the matching-refs call below prints them) is on `sha` already.
 */
export function chooseTag(existing, sha, date) {
  const tags = new Map(existing.split('\n').filter(Boolean).map((line) => line.split(' ')));
  if ([...tags.values()].includes(sha)) return null;
  let tag = `release-${date}`;
  for (let n = 2; tags.has(tag); n++) tag = `release-${date}-${n}`;
  return tag;
}

export function releaseTitle(tag, entries) {
  const list = entries.map(({ name, version }) => `${name.replace('@interslavic/', '')} ${version}`);
  return `Release ${tag.slice('release-'.length)}: ${list.join(', ')}`;
}

/** `notes(file)` reads the notes that pack.mjs wrote for one package. */
export function releaseBody(entries, { env, notes }) {
  const releases = `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/releases/tag`;
  let body = 'Published to npm from this commit, with provenance.\n\n';
  body += '| package | version | npm | release |\n|---|---|---|---|\n';
  for (const { name, version } of entries) {
    const npm = `https://www.npmjs.com/package/${name}/v/${version}`;
    body += `| \`${name}\` | ${version} | [npm](${npm}) | [notes](${releases}/${encodeURIComponent(`${name}@${version}`)}) |\n`;
  }
  for (const entry of entries) body += `\n## ${entry.name} ${entry.version}\n\n${notes(entry.notes)}`;
  return body;
}

export function createSummaryRelease(entries, { env, run, date, notes, write }) {
  if (entries.length === 0) return null;
  const repo = env.GITHUB_REPOSITORY;
  const refs = run('gh', ['api', `repos/${repo}/git/matching-refs/tags/release-`, '--paginate',
    '--jq', '.[] | "\\(.ref[10:]) \\(.object.sha)"'], 'capture');
  if (!refs.ok) throw new Error('gh api matching-refs failed');
  const tag = chooseTag(refs.stdout, env.GITHUB_SHA, date);
  if (!tag) return null;
  write('summary-release.md', releaseBody(entries, { env, notes }));
  const args = ['release', 'create', tag, '-R', repo, '--target', env.GITHUB_SHA];
  args.push('--title', releaseTitle(tag, entries), '--notes-file', 'summary-release.md', '--latest');
  if (!run('gh', args).ok) throw new Error(`gh release create ${tag} failed`);
  return tag;
}

/** createSummaryRelease with nothing written: prints what it would create, or why nothing. */
export function planSummaryRelease(entries, { env, run, date, notes, summary }) {
  const skipped = [];
  let body;
  const write = (_file, text) => (body = text);
  const tag = createSummaryRelease(entries, { env, run: planRunner(run, skipped), date, notes, write });
  let text = '\n## Plan: summary release\n\n';
  if (!entries.length) text += 'Would create nothing: nothing to publish.\n';
  else if (!tag) text += `Would create nothing: a \`release-*\` tag already points at ${env.GITHUB_SHA}.\n`;
  else {
    const fence = '`'.repeat(Math.max(3, ...(body.match(/`+/g) ?? []).map((s) => s.length + 1)));
    text += `Would create \`${tag}\` on ${env.GITHUB_SHA}, marked Latest.\n\nTitle: ${releaseTitle(tag, entries)}\n`;
    text += `${commandList(skipped)}\nBody (summary-release.md):\n\n${fence}markdown\n${body.trimEnd()}\n${fence}\n`;
  }
  summary(text);
  return tag;
}

if (import.meta.main) {
  try {
    const entries = parseManifest(readFileSync('manifest.tsv', 'utf8'));
    const options = {
      env: process.env,
      run,
      date: new Date().toISOString().slice(0, 10),
      notes: (file) => readFileSync(file, 'utf8'),
    };
    if (process.argv.includes('--plan')) planSummaryRelease(entries, { ...options, summary: planOutput });
    else createSummaryRelease(entries, { ...options, write: writeFileSync });
  } catch (error) {
    fail(error);
  }
}
