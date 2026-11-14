import { describe, test } from 'node:test';
import assert from 'node:assert';

import { normalize } from './normalize-text.ts';
import { transliterate } from './transliterate.ts';

// Each case: input, etymological, standard.
const cases: [string, string, string][] = [
  // what was not etymological gets no letters it did not have
  ['smysl', 'smysl', 'smysl'],
  ['Dobry denj!', 'Dobry denj!', 'Dobry denj!'],
  // what was etymological keeps them, or loses them to the standard alphabet
  ['sȯmysl', 'sȯmysl', 'somysl'],
  [
    'Mękky znak, tvŕdy znak',
    'Mękky znak, tvŕdy znak',
    'Mekky znak, tvrdy znak',
  ],
  // other spellings are read
  ['czlovek i zxena', 'človek i žena', 'človek i žena'],
  ['рѫка', 'rųka', 'ruka'],
  ['ⱃⱘⰽⰰ', 'rųka', 'ruka'],
];

describe('normalize', () => {
  for (const [input, etymolog, standard] of cases) {
    test(`${input} → ${etymolog} / ${standard}`, () => {
      assert.strictEqual(normalize(input, 'etymolog'), etymolog);
      assert.strictEqual(normalize(input, 'standard'), standard);
    });
  }

  test('is transliterate to the Latin alphabet, options included', () => {
    const text = 'Czlovek, рѫка, ⱃⱘⰽⰰ, sȯmysl, vėrh, vĺk';

    for (const options of [
      undefined,
      { input: 'isv-x-etymolog' },
      { input: 'isv-x-nms' },
    ] as const) {
      assert.strictEqual(
        normalize(text, 'etymolog', options),
        transliterate(text, 'isv-Latn-x-etymolog', options),
      );
      assert.strictEqual(
        normalize(text, 'standard', options),
        transliterate(text, 'isv-Latn', options),
      );
    }

    assert.strictEqual(
      normalize('czas', 'standard', { input: 'isv-x-etymolog' }),
      'czas',
    );
  });

  test('unknown target', () => {
    assert.throws(
      () => normalize('smysl', 'isv-Latn' as any),
      /Unsupported normalization target: isv-Latn/,
    );
  });
});
