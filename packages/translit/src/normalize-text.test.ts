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
      assert.strictEqual(normalize(input), etymolog);
      assert.strictEqual(normalize(input, { output: 'isv-Latn' }), standard);
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
        normalize(text, options),
        transliterate(text, 'isv-Latn-x-etymolog', options),
      );
      assert.strictEqual(
        normalize(text, { ...options, output: 'isv-Latn' }),
        transliterate(text, 'isv-Latn', options),
      );
    }

    assert.strictEqual(
      normalize('czas', { input: 'isv-x-etymolog', output: 'isv-Latn' }),
      'czas',
    );
  });

  test('a Latin word ending in a Cyrillic soft sign is softened', () => {
    assert.strictEqual(normalize('konь'), 'koń');
    assert.strictEqual(normalize('konь', { output: 'isv-Latn' }), 'kon');
  });

  test('unknown output', () => {
    assert.throws(
      () => normalize('smysl', { output: 'isv-Cyrl' as any }),
      /Unsupported normalization output: isv-Cyrl/,
    );
  });
});
