import assert from 'node:assert/strict';
import { test } from 'node:test';

import { releaseNotes } from './pack.mjs';

const changelog = `# Changelog

## 0.1.10

Ten is not one.

## 0.1.1

### Fixes

- Something real (#1)

## 0.1.0
`;

test('takes the section of exactly that version, up to the next one', () => {
  assert.equal(releaseNotes(changelog, '0.1.1'), '### Fixes\n\n- Something real (#1)');
  assert.equal(releaseNotes(changelog, '0.1.10'), 'Ten is not one.');
});

test('refuses a version with no section or with an empty one', () => {
  assert.throws(() => releaseNotes(changelog, '0.2.0'), /no "## 0.2.0" section/);
  assert.throws(() => releaseNotes(changelog, '0.1.0'), /says nothing/);
});
