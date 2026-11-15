import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseManifest, publishAll } from './publish.mjs';
import { chooseTag, createSummaryRelease, releaseBody, releaseTitle } from './summary.mjs';

const manifest = [
  '@interslavic/translit\t0.2.0\tinterslavic-translit-0.2.0.tgz\tinterslavic-translit-0.2.0.md',
  '@interslavic/morphology\t0.1.3\tinterslavic-morphology-0.1.3.tgz\tinterslavic-morphology-0.1.3.md',
  '@interslavic/stemmer\t0.1.1\tinterslavic-stemmer-0.1.1.tgz\tinterslavic-stemmer-0.1.1.md',
  '',
].join('\n');
const three = parseManifest(manifest);
const one = three.slice(0, 1);
const env = { GITHUB_REPOSITORY: 'o/r', GITHUB_SHA: 'abc', GITHUB_SERVER_URL: 'https://github.com' };

/** A stand-in for `run`: records each command; `answer(command)` returns { ok, stdout }. */
function fake(answer) {
  const calls = [];
  const run = (cmd, args) => {
    const command = [cmd, ...args].join(' ');
    calls.push(command);
    return { ok: true, stdout: '', ...answer(command) };
  };
  return { calls, run };
}

const verbs = (calls) => calls.map((c) => c.match(/^(npm|gh release) \w+/)[0]);

function publish(answer, entries = three) {
  const { calls, run } = fake(answer);
  let summary = '';
  let error;
  try {
    publishAll(entries, { env, run, summary: (text) => (summary += text) });
  } catch (e) {
    error = e;
  }
  return { calls, summary, error };
}

test('parses the manifest and refuses anything pack.mjs does not write', () => {
  assert.deepEqual(three[2], {
    name: '@interslavic/stemmer',
    version: '0.1.1',
    tgz: 'interslavic-stemmer-0.1.1.tgz',
    notes: 'interslavic-stemmer-0.1.1.md',
  });
  assert.deepEqual(parseManifest(''), []);
  for (const line of [
    '@interslavic/x\t1.0.0\t--registry=evil.tgz\tinterslavic-x-1.0.0.md',
    '@interslavic/x\t1.0.0\tinterslavic-x-1.0.0.tgz\t../x.md',
    '@other/x\t1.0.0\tother-x-1.0.0.tgz\tother-x-1.0.0.md',
    '@interslavic/x\t1.0.0-rc.1\tinterslavic-x-1.0.0-rc.1.tgz\tinterslavic-x-1.0.0-rc.1.md',
    '@interslavic/x\t1.0.0\tinterslavic-x-1.0.0.tgz',
  ]) {
    assert.throws(() => parseManifest(line), /unexpected line/, line);
  }
});

test('publishes and creates the release when both are absent', () => {
  const { calls, summary, error } = publish((c) => (c.startsWith('gh release view') ? { ok: false } : {}), one);
  assert.equal(error, undefined);
  assert.deepEqual(calls, [
    'npm view @interslavic/translit@0.2.0 version',
    'npm publish ./interslavic-translit-0.2.0.tgz --provenance --access public',
    'gh release view @interslavic/translit@0.2.0 -R o/r',
    'gh release create @interslavic/translit@0.2.0 -R o/r --target abc --title @interslavic/translit 0.2.0 ' +
      '--notes-file interslavic-translit-0.2.0.md --latest=false interslavic-translit-0.2.0.tgz',
  ]);
  assert.equal(
    summary,
    '## Published\n\n| Package | Version | npm | GitHub |\n|---|---|---|---|\n' +
      '| `@interslavic/translit` | 0.2.0 | [npm](https://www.npmjs.com/package/@interslavic/translit/v/0.2.0) ' +
      '| [release](https://github.com/o/r/releases/tag/@interslavic/translit@0.2.0) |\n',
  );
});

test('skips npm when the version is there, and the release when it exists', () => {
  const onNpm = publish((c) => (c.startsWith('npm view') ? { stdout: '0.2.0\n' } : { ok: false }), one);
  assert.deepEqual(verbs(onNpm.calls), [
    'npm view',
    'gh release view',
    'gh release create',
  ]);
  const released = publish(() => ({}), one);
  assert.deepEqual(verbs(released.calls), [
    'npm view',
    'npm publish',
    'gh release view',
  ]);
});

test('stops at the package that fails, after finishing the ones before it', () => {
  const { calls, summary, error } = publish((c) =>
    c.startsWith('gh release view') || c.startsWith('npm publish ./interslavic-morphology') ? { ok: false } : {},
  );
  assert.match(error.message, /npm publish @interslavic\/morphology@0.1.3 failed/);
  assert.ok(calls.some((c) => c.startsWith('gh release create @interslavic/translit@0.2.0')));
  assert.ok(!calls.some((c) => c.includes('stemmer')));
  assert.ok(!calls.some((c) => c.startsWith('gh release create @interslavic/morphology')));
  assert.equal(summary.match(/^\| `/gm).length, 1);
});

test('a failed release stops the run too', () => {
  const { error } = publish((c) => (c.startsWith('gh release') ? { ok: false } : {}));
  assert.match(error.message, /gh release create @interslavic\/translit@0.2.0 failed/);
});

test('chooses the tag of the day, then -2, -3', () => {
  assert.equal(chooseTag('', 'abc', '2026-11-16'), 'release-2026-11-16');
  assert.equal(chooseTag('release-2026-11-16 old\n', 'abc', '2026-11-16'), 'release-2026-11-16-2');
  assert.equal(
    chooseTag('release-2026-11-15 x\nrelease-2026-11-16 y\nrelease-2026-11-16-2 z\n', 'abc', '2026-11-16'),
    'release-2026-11-16-3',
  );
  assert.equal(chooseTag('release-2026-11-15 x\nrelease-2026-11-16-2 abc\n', 'abc', '2026-11-16'), null);
});

test('titles the release with the short names', () => {
  assert.equal(releaseTitle('release-2026-11-16', one), 'Release 2026-11-16: translit 0.2.0');
  assert.equal(
    releaseTitle('release-2026-11-16-2', three),
    'Release 2026-11-16-2: translit 0.2.0, morphology 0.1.3, stemmer 0.1.1',
  );
});

test('links each package release with @ and / encoded, then adds its notes', () => {
  const body = releaseBody(one, { env, notes: (file) => `notes of ${file}\n` });
  assert.equal(
    body,
    'Published to npm from this commit, with provenance.\n\n' +
      '| package | version | npm | release |\n|---|---|---|---|\n' +
      '| `@interslavic/translit` | 0.2.0 | [npm](https://www.npmjs.com/package/@interslavic/translit/v/0.2.0) ' +
      '| [notes](https://github.com/o/r/releases/tag/%40interslavic%2Ftranslit%400.2.0) |\n' +
      '\n## @interslavic/translit 0.2.0\n\nnotes of interslavic-translit-0.2.0.md\n',
  );
});

function summarize(entries, refs) {
  const { calls, run } = fake((c) => (c.startsWith('gh api') ? { stdout: refs } : {}));
  const files = {};
  const tag = createSummaryRelease(entries, {
    env,
    run,
    date: '2026-11-16',
    notes: () => 'n\n',
    write: (file, text) => (files[file] = text),
  });
  return { tag, calls, files };
}

test('creates the summary release, marked Latest', () => {
  const { tag, calls, files } = summarize(three, 'release-2026-11-16 old\n');
  assert.equal(tag, 'release-2026-11-16-2');
  assert.equal(calls.length, 2);
  assert.match(calls[0], /^gh api repos\/o\/r\/git\/matching-refs\/tags\/release- --paginate --jq /);
  assert.equal(
    calls[1],
    'gh release create release-2026-11-16-2 -R o/r --target abc --title Release 2026-11-16-2: translit 0.2.0, ' +
      'morphology 0.1.3, stemmer 0.1.1 --notes-file summary-release.md --latest',
  );
  assert.match(files['summary-release.md'], /^Published to npm/);
});

test('a re-run on a commit that has its summary release creates nothing', () => {
  const { tag, calls, files } = summarize(three, 'release-2026-11-15 abc\n');
  assert.equal(tag, null);
  assert.equal(calls.length, 1);
  assert.deepEqual(files, {});
});

test('an empty manifest creates nothing and asks nothing', () => {
  const { tag, calls } = summarize([], '');
  assert.equal(tag, null);
  assert.deepEqual(calls, []);
});
