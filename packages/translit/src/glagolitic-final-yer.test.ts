import { describe, test } from 'node:test';
import assert from 'node:assert';

import { transliterate } from './transliterate.ts';

// Glagolitic written the church-Slavonic way: a final ⱏ after a vowel is
// silent, a one-syllable word keeps it (vȯ, sȯ, kȯ), the titlo is dropped.
const cases: [string, string, string][] = [
  ['ⰽⰰⱀⰰⰾⱏ', 'kanal', 'kanal'],
  ['ⱄⱏⱞⱏⰹⱄⰾⱏ', 'sȯmysl', 'somysl'],
  ['ⰲⱏ ⱃⱁⰴⱆ', 'vȯ rodu', 'vo rodu'],
  ['ⱄⱏ ⰿⱀⱁⱓ', 'sȯ mnoju', 'so mnoju'],
  ['ⰽⱏ ⰴⱁⰿⱆ', 'kȯ domu', 'ko domu'],
  ['ⰴⱁⰱⱃⱏⰹ', 'dobry', 'dobry'],
  ['ⰿ҃ⱄ', 'ms', 'ms'],
  ['ⱀⰰⱂ҃ⱃ', 'napr', 'napr'],
];

describe('Glagolitic final yer and titlo', () => {
  for (const [glag, etym, std] of cases) {
    test(glag, () => {
      assert.strictEqual(transliterate(glag, 'isv-Latn-x-etymolog'), etym);
      assert.strictEqual(transliterate(glag, 'isv-Latn'), std);
    });
  }
});
