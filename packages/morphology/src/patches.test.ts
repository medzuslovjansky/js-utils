import assert from 'node:assert/strict';
import test from 'node:test';

import PATCHES from './patches.ts';

/**
 * `patch()` returns `[outLemma || lemma, outXpos || xpos, outAddition]`, so an
 * entry that renames a headword to itself and changes nothing else returns
 * exactly what a miss returns. Six of those had accumulated — `nikto` to
 * `nikto`, `ničij` to `ničij` — reading like curated knowledge and doing
 * nothing. The feature they look like they carry, `PronType=Neg`, is set in
 * `pronoun-features.ts`.
 */
test('no patch is a no-op', () => {
  const noop = PATCHES.filter(
    ([word, , lemma, xpos, addition]) =>
      (lemma === null || lemma === word) && !xpos && !addition,
  );

  assert.deepEqual(noop, []);
});

/**
 * `patch()` matches the whole headword, and `normalize()` calls it before
 * `splitSteenLemmas()`, so a key with a comma in it can only fire on a word
 * list that still joins two headwords into one row. This one no longer does.
 */
test('no patch key joins two headwords', () => {
  const joined = PATCHES.filter(([word]) => String(word).includes(','));

  assert.deepEqual(joined, []);
});
