import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { transliterate } from './transliterate.ts';

const havlik = { yers: 'havlik' } as const;
const etym = (text: string, options = havlik): string =>
  transliterate(text, 'isv-Latn-x-etymolog', options);

describe("yers: 'havlik'", () => {
  // word written with yers → etymological, in Latin and in Cyrillic
  const cases: [string, string, string][] = [
    ['krъvь', 'крьвь'.replace('ьвь', 'ъвь'), 'krȯv'],
    ['krъvьny', 'къровьны'.replace('къровьны', 'кръвьны'), 'krȯvny'],
    ['dьržati', 'дьржати', 'dŕžati'],
    ['drъžati', 'дръжати', 'držati'],
    ['sъnъ', 'сънъ', 'sȯn'],
    ['sъna', 'съна', 'sna'],
    ['otьcь', 'отьць', 'otėc'],
    ['otьca', 'отьца', 'otca'],
    ['vъzduhъ', 'въздухъ', 'vȯzduh'],
    ['konь', 'конь', 'konj'],
    ['vъ', 'въ', 'vȯ'],
  ];

  for (const [latin, cyrillic, expected] of cases) {
    test(`${latin} and ${cyrillic} are ${expected}`, () => {
      assert.equal(etym(latin), expected);
      assert.equal(etym(cyrillic), expected);
    });
  }

  test('the standard alphabet follows', () => {
    assert.equal(transliterate('krъvь', 'isv-Latn', havlik), 'krov');
    assert.equal(transliterate('konь', 'isv-Latn', havlik), 'konj');
  });

  test('finalYer has no effect', () => {
    assert.equal(
      etym('сънъ', { yers: 'havlik', finalYer: 'keep' } as never),
      'sȯn',
    );
  });

  test('Glagolitic is read as it is without the option', () => {
    for (const word of ['ⰽⱃⱏⰲⱐ', 'ⰴⱐⱀⱐ', 'ⱄⱏⱀⱏ']) {
      assert.equal(etym(word), etym(word, {} as never));
    }
  });

  test('a word without yers is read as it is', () => {
    for (const word of ['dub', 'voda', 'kralj', 'vȯlk', 'pȯlny', 'město']) {
      assert.equal(etym(word), etym(word, {} as never), word);
    }
  });

  test("'auto' is the default", () => {
    for (const word of ['сънъ', 'конь', 'крьвь']) {
      assert.equal(
        transliterate(word, 'isv-Latn-x-etymolog', { yers: 'auto' }),
        transliterate(word, 'isv-Latn-x-etymolog'),
      );
    }
  });

  test('an unknown value throws', () => {
    assert.throws(
      () => etym('konь', { yers: 'strong' } as never),
      /Unsupported yers: strong/,
    );
  });
});
