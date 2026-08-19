import assert from 'node:assert';
import { describe, test } from 'node:test';

import { stem } from './stemmer.ts';

/** Every form here has to reach the same key as the others on its row. */
const PARADIGMS: Array<[string, string[]]> = [
  ['dom', ['dom', 'doma', 'domu', 'domom', 'domah', 'domami', 'domov']],
  ['žena', ['žena', 'ženy', 'ženě', 'ženų', 'ženojų', 'ženam', 'ženami']],
  ['město', ['město', 'města', 'městu', 'městom', 'městah', 'městami']],
  [
    'dobry',
    ['dobry', 'dobra', 'dobro', 'dobrogo', 'dobromu', 'dobrym', 'dobryh'],
  ],
  ['pisati', ['pisati', 'pisal', 'pisala', 'pisali', 'pisalo']],
];

describe('stem', () => {
  for (const [lemma, forms] of PARADIGMS) {
    test(`one key for ${lemma}`, () => {
      const keys = new Set(forms.map(stem));
      assert.strictEqual(
        keys.size,
        1,
        `${lemma} split into ${[...keys].join(', ')}`,
      );
    });
  }

  test('a key does not depend on the script or the flavorisation', () => {
    const key = stem('slovjanskogo');

    assert.strictEqual(stem('словјанскому'), key);
    assert.strictEqual(stem('slovianskomu'), key);
    assert.strictEqual(stem('SLOVJANSKYH'), key);
  });

  test('unrelated words keep their own keys', () => {
    const keys = ['dom', 'doba', 'duma', 'dym'].map(stem);
    assert.strictEqual(new Set(keys).size, keys.length);
  });

  test('a word too short to have an ending is left alone', () => {
    assert.strictEqual(stem('do'), 'do');
    assert.strictEqual(stem('sȯn'), 'son');
    assert.strictEqual(stem(''), '');
  });

  test('nothing is stemmed away to nothing', () => {
    for (const word of ['ami', 'ogo', 'jemo', 'a', 'i']) {
      assert.notStrictEqual(stem(word), '', `${word} vanished`);
    }
  });
});
