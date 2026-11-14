import { describe, test } from 'node:test';
import assert from 'node:assert';

import { transliterate } from './transliterate.ts';

// A word-final hard yer: Glagolitic ⱏ, Cyrillic ъ, or ъ after Latin letters.
// Each case: input, then etymological / standard Latin for finalYer 'auto'
// (the default), 'drop' and 'keep'.
type Case = [string, string, string, string];

const groups: Record<string, Case[]> = {
  // after a vowel it is silent, unless kept
  'after a vowel': [
    ['ⰽⰰⱀⰰⰾⱏ', 'kanal / kanal', 'kanal / kanal', 'kanalȯ / kanalo'],
    ['каналъ', 'kanal / kanal', 'kanal / kanal', 'kanalȯ / kanalo'],
    ['kanalъ', 'kanal / kanal', 'kanal / kanal', 'kanalȯ / kanalo'],
    ['ⰴⱘⰱⱏ', 'dųb / dub', 'dųb / dub', 'dųbȯ / dubo'],
    ['дѫбъ', 'dųb / dub', 'dųb / dub', 'dųbȯ / dubo'],
    ['dųbъ', 'dųb / dub', 'dųb / dub', 'dųbȯ / dubo'],
    ['dǫbъ', 'dųb / dub', 'dųb / dub', 'dųbȯ / dubo'],
    ['Дѫбъ', 'Dųb / Dub', 'Dųb / Dub', 'Dųbȯ / Dubo'],
    ['ДѪБЪ', 'DŲB / DUB', 'DŲB / DUB', 'DŲBȮ / DUBO'],
    ['рꙑбъ', 'ryb / ryb', 'ryb / ryb', 'rybȯ / rybo'],
    ['ⱃⱏⰹⰱⱏ', 'ryb / ryb', 'ryb / ryb', 'rybȯ / rybo'],
    ['ⱄⱏⱞⱏⰹⱄⰾⱏ', 'sȯmysl / somysl', 'sȯmysl / somysl', 'sȯmyslȯ / somyslo'],
    ['съмыслъ', 'sȯmysl / somysl', 'sȯmysl / somysl', 'sȯmyslȯ / somyslo'],
    ['sȯnъ', 'sȯn / son', 'sȯn / son', 'sȯnȯ / sono'],
  ],
  // a word with no vowel before the yer keeps it, unless dropped
  'in a word with no other vowel': [
    ['ⰲⱏ', 'vȯ / vo', 'v / v', 'vȯ / vo'],
    ['въ', 'vȯ / vo', 'v / v', 'vȯ / vo'],
    ['vъ', 'vȯ / vo', 'v / v', 'vȯ / vo'],
    ['ⱄⱏ', 'sȯ / so', 's / s', 'sȯ / so'],
    ['съ', 'sȯ / so', 's / s', 'sȯ / so'],
    ['ⰽⱏ', 'kȯ / ko', 'k / k', 'kȯ / ko'],
    ['къ', 'kȯ / ko', 'k / k', 'kȯ / ko'],
    ['Въ', 'Vȯ / Vo', 'V / V', 'Vȯ / Vo'],
  ],
  // a yer or soft sign before it is a vowel too, and so are jo and y
  'a yer or soft sign before it': [
    ['ⱄⱏⱀⱏ', 'sȯn / son', 'sȯn / son', 'sȯnȯ / sono'],
    ['сънъ', 'sȯn / son', 'sȯn / son', 'sȯnȯ / sono'],
    ['sъnъ', 'sȯn / son', 'sȯn / son', 'sȯnȯ / sono'],
    ['ⱂⱐⱄⱏ', 'pės / pes', 'pės / pes', 'pėsȯ / peso'],
    ['ⰾⱐⰲⱏ', 'lėv / lev', 'lėv / lev', 'ĺvȯ / lvo'],
    ['ⱅⱏⱃⰳⱏ', 'trg / trg', 'trg / trg', 'trgȯ / trgo'],
    ['ⰱⱐⰹⰽⱏ', 'byk / byk', 'byk / byk', 'bykȯ / byko'],
    ['ⰿⱖⰴⱏ', 'mjod / mjod', 'mjod / mjod', 'mjodȯ / mjodo'],
  ],
  // the whole word is never dropped
  'a lone yer': [
    ['ⱏ', 'ȯ / o', 'ȯ / o', 'ȯ / o'],
    ['ъ', 'ȯ / o', 'ȯ / o', 'ȯ / o'],
  ],
  // a yer before j or an iotated vowel only separates, after a vowel; not
  // before jd (izȯjdti) and not in a word with no vowel (tȯj)
  'a separating yer': [
    [
      'объявити',
      'objaviti / objaviti',
      'objaviti / objaviti',
      'objaviti / objaviti',
    ],
    [
      'подъѥздъ',
      'podjezd / podjezd',
      'podjezd / podjezd',
      'podjezdȯ / podjezdo',
    ],
    ['изъйти', 'izȯjti / izojti', 'izȯjti / izojti', 'izȯjti / izojti'],
    ['тъй', 'tȯj / toj', 'tȯj / toj', 'tȯj / toj'],
  ],
  // not this rule's business, whatever the option
  'left alone': [
    ['ⰴⱁⰱⱃⱏⰹ', 'dobry / dobry', 'dobry / dobry', 'dobry / dobry'],
    ['vȯ', 'vȯ / vo', 'vȯ / vo', 'vȯ / vo'],
    ['kako', 'kako / kako', 'kako / kako', 'kako / kako'],
    ['ⰽⱁⱀⱐ', 'konj / konj', 'konj / konj', 'konj / konj'],
    ['конь', 'koń / kon', 'koń / kon', 'koń / kon'],
  ],
};

const read = (input: string, finalYer?: 'auto' | 'drop' | 'keep') =>
  [
    transliterate(input, 'isv-Latn-x-etymolog', { finalYer }),
    transliterate(input, 'isv-Latn', { finalYer }),
  ].join(' / ');

describe('finalYer', () => {
  for (const [name, cases] of Object.entries(groups)) {
    describe(name, () => {
      for (const [input, auto, drop, keep] of cases) {
        test(`${input} → ${auto} | ${drop} | ${keep}`, () => {
          assert.strictEqual(read(input), auto);
          assert.strictEqual(read(input, 'auto'), auto);
          assert.strictEqual(read(input, 'drop'), drop);
          assert.strictEqual(read(input, 'keep'), keep);
        });
      }
    });
  }

  test("has no effect with input: 'isv-x-etymolog', which reads no yers", () => {
    for (const finalYer of ['auto', 'drop', 'keep'] as const) {
      assert.strictEqual(
        transliterate('каналъ ⰽⰰⱀⰰⰾⱏ kanalъ', 'isv-Latn-x-etymolog', {
          input: 'isv-x-etymolog',
          finalYer,
        }),
        'каналъ ⰽⰰⱀⰰⰾⱏ kanalъ',
      );
    }
  });

  test("sees the vowel of an NMS syllabic l with input: 'isv-x-nms'", () => {
    assert.strictEqual(read('vĺkъ'), 'vĺkȯ / vlko');
    assert.strictEqual(
      transliterate('vĺkъ', 'isv-Latn-x-etymolog', { input: 'isv-x-nms' }),
      'vȯlk',
    );
  });

  test('unknown value', () => {
    assert.throws(
      () => transliterate('въ', 'isv-Latn', { finalYer: 'havlik' as any }),
      /Unsupported finalYer: havlik/,
    );
  });
});
