import assert from 'node:assert/strict';
import test from 'node:test';

import { ALPHABET } from '@interslavic/translit/alphabet';

import { diff } from './golden.ts';
import { generate, probes, read, write } from './translit-golden.ts';

test('every transliteration of every flavour is what it was', () => {
  const actual = generate();

  if (process.env.UPDATE_SNAPSHOT) {
    write(actual);
    return;
  }

  const expected = read();
  if (expected === actual) return;

  const lines = diff(expected, actual);
  assert.fail(
    `transliterations moved (${expected.split('\n').length} lines before, ` +
      `${actual.split('\n').length} after). Run with UPDATE_SNAPSHOT=1 to ` +
      `accept.\n\n${lines.join('\n')}`,
  );
});

test('every pair the alphabet can form is in there', () => {
  const covered = new Set(probes());
  const missing: string[] = [];

  for (const first of ALPHABET) {
    for (const second of ALPHABET) {
      if (!covered.has(first + second)) missing.push(first + second);
    }
  }

  assert.deepEqual(missing, []);
});
