import { describe, test } from 'node:test';
import assert from 'node:assert';

import { transliterate } from './transliterate.ts';

// Izhe (ⰹ) is plain `j`; the separate Izhe (ⰺ) is `j` too, written after a
// prefix or consonant (s'jezditi, Kyjev) to keep `sj` from reading as `ś`.
describe('Glagolitic → Latin: Izhe is j', () => {
  const cases: [string, string][] = [
    ['ⰹⰵⱄⱅ', 'jest'],
    ['ⱄⰹⰵⱅ', 'sjet'],
    ['ⱄⰺⰰⱈⰰⰿ', 'sjaham'],
    ['ⰽⱏⰹⰺⰵⰲ', 'kyjev'],
    ['ⱄⰾⱁⰲⰹⰰⱀⰰⰿ', 'slovjanam'],
    ['ⱄⰾⱁⰲⰺⰰⱀⰰⰿ', 'slovjanam'],
    ['Ⱄⰾⱁⰲⰺⰰⱀⰰⰿ', 'Slovjanam'],
  ];

  for (const [glag, latn] of cases) {
    test(`${glag} → ${latn}`, () => {
      assert.strictEqual(transliterate(glag, 'isv-Latn'), latn);
    });
  }
});
