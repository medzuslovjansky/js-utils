// Runs inside one public workspace, through `yarn workspaces foreach exec` in
// .github/workflows/release.yml. If the version in package.json is not on npm
// yet, packs it into $RELEASE_DIR, writes its release notes next to the
// tarball and appends a line to $RELEASE_DIR/manifest.tsv:
//
//   name <TAB> version <TAB> tarball <TAB> notes
//
// Lines come in topological order, which is the order to publish them in.
import { execFileSync } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO = 'https://github.com/medzuslovjansky/js-utils';

/**
 * The body of the `## <version>` section of a changelog. A version goes out
 * only with notes written for it, so a missing or empty section throws.
 */
export function releaseNotes(changelog, version) {
  // ponytail: a line starting with "## " inside a code fence ends the section; do not write one.
  const lines = changelog.split(/\r?\n/);
  const start = lines.indexOf(`## ${version}`);
  if (start < 0) throw new Error(`no "## ${version}" section`);
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith('## '));
  const body = rest.slice(0, end < 0 ? rest.length : end).join('\n').trim();
  if (body.split(/\s+/).length < 3) throw new Error(`the "## ${version}" section says nothing`);
  return body;
}

async function isPublished(name, version) {
  const response = await fetch(`https://registry.npmjs.org/${name}/${version}`);
  if (response.status !== 200 && response.status !== 404) {
    throw new Error(`npm registry answered ${response.status} for ${name}@${version}`);
  }
  return response.status === 200;
}

async function main() {
  const dir = process.env.RELEASE_DIR;
  if (!dir) throw new Error('RELEASE_DIR is not set');
  const summary = (text) =>
    process.env.GITHUB_STEP_SUMMARY ? appendFileSync(process.env.GITHUB_STEP_SUMMARY, text) : console.log(text);

  mkdirSync(dir, { recursive: true });
  const manifest = join(dir, 'manifest.tsv');
  appendFileSync(manifest, ''); // the publish job needs the file even when it is empty

  // These two end up in shell commands, file names and markdown, and everything
  // goes to the `latest` dist-tag, so no prereleases.
  const { name, version, repository } = JSON.parse(readFileSync('package.json', 'utf8'));
  if (!/^@interslavic\/[a-z0-9-]+$/.test(name)) throw new Error(`unexpected package name ${name}`);
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`${name}: unexpected version ${version}`);
  // npm rejects provenance from another repository only at publish time.
  if (repository?.url !== `git+${REPO}.git`) throw new Error(`${name}: repository.url must be git+${REPO}.git`);

  const tag = `${name}@${version}`;
  if (await isPublished(name, version)) {
    summary(`- \`${tag}\` is already on npm\n`);
    return;
  }

  let notes;
  try {
    notes = releaseNotes(readFileSync('CHANGELOG.md', 'utf8'), version);
  } catch (error) {
    throw new Error(`${tag} has no release notes in ${join(process.cwd(), 'CHANGELOG.md')}: ${error.message}`);
  }

  const base = `${name.slice(1).replace('/', '-')}-${version}`;
  execFileSync('yarn', ['pack', '--out', join(dir, `${base}.tgz`)], { stdio: 'inherit' });

  let previous = '';
  try {
    previous = execFileSync('git', ['describe', '--tags', '--abbrev=0', '--match', `${name}@*`, 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    // the first release of this package from the workflow
  }
  notes += '\n\n';
  if (previous) notes += `**Full changes:** ${REPO}/compare/${previous}...${tag}\n\n`;
  notes += `**npm:** https://www.npmjs.com/package/${name}/v/${version}\n`;

  writeFileSync(join(dir, `${base}.md`), notes);
  appendFileSync(manifest, `${name}\t${version}\t${base}.tgz\t${base}.md\n`);
  summary(`<details><summary><code>${tag}</code> will be published</summary>\n\n${notes}\n</details>\n\n`);
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(`::error::${error.message}`);
    process.exit(1);
  });
}
