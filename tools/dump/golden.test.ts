import assert from 'node:assert/strict';
import test from 'node:test';

import { diff, generate, read, write } from './golden.ts';

test('every paradigm in the lexicon is what it was', () => {
  const actual = generate();

  if (process.env.UPDATE_SNAPSHOT) {
    write(actual);
    return;
  }

  const expected = read();
  if (expected === actual) return;

  const lines = diff(expected, actual);
  assert.fail(
    `the lexicon dump moved (${expected.split('\n').length} lines before, ` +
      `${actual.split('\n').length} after). Run with UPDATE_SNAPSHOT=1 to ` +
      `accept.\n\n${lines.join('\n')}`,
  );
});
