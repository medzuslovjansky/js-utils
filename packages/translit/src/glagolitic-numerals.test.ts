import { describe, test } from 'node:test';
import assert from 'node:assert';

import {
  fromGlagoliticNumerals,
  toGlagoliticNumerals,
} from './glagolitic-numerals.ts';
import { normalize } from './normalize-text.ts';
import { transliterate } from './transliterate.ts';

const on = { glagoliticNumerals: true } as const;

// The letter values, by code point, so that a look-alike letter cannot slip
// into the table: units Ⰰ–Ⰸ, tens Ⰺ–Ⱂ (not Ⰹ), hundreds Ⱃ–Ⱉ, Ⱋ, Ⱌ (not Ⱊ),
// and Ⱍ for the thousand.
const VALUES: [number, number][] = [
  [1, 0x2c00],
  [2, 0x2c01],
  [3, 0x2c02],
  [4, 0x2c03],
  [5, 0x2c04],
  [6, 0x2c05],
  [7, 0x2c06],
  [8, 0x2c07],
  [9, 0x2c08],
  [10, 0x2c0a],
  [20, 0x2c0b],
  [30, 0x2c0c],
  [40, 0x2c0d],
  [50, 0x2c0e],
  [60, 0x2c0f],
  [70, 0x2c10],
  [80, 0x2c11],
  [90, 0x2c12],
  [100, 0x2c13],
  [200, 0x2c14],
  [300, 0x2c15],
  [400, 0x2c16],
  [500, 0x2c17],
  [600, 0x2c18],
  [700, 0x2c19],
  [800, 0x2c1b],
  [900, 0x2c1c],
  [1000, 0x2c1d],
];

// Hundreds, tens, units; 11 to 19 put the unit before the ten; a number
// before ⱍ counts the thousands. Written here between dots, to keep the
// letters legible; the titlo is tested apart.
const NUMBERS: [string, string][] = [
  ['1', 'ⰰ'],
  ['9', 'ⰸ'],
  ['10', 'ⰺ'],
  ['11', 'ⰰⰺ'],
  ['19', 'ⰸⰺ'],
  ['20', 'ⰻ'],
  ['21', 'ⰻⰰ'],
  ['99', 'ⱂⰸ'],
  ['100', 'ⱃ'],
  ['101', 'ⱃⰰ'],
  ['110', 'ⱃⰺ'],
  ['119', 'ⱃⰸⰺ'],
  ['120', 'ⱃⰻ'],
  ['345', 'ⱅⰽⰴ'],
  ['800', 'ⱋ'],
  ['999', 'ⱌⱂⰸ'],
  ['1000', 'ⱍ'],
  ['1002', 'ⱍⰱ'],
  ['1010', 'ⱍⰺ'],
  ['1280', 'ⱍⱄⱁ'],
  ['1994', 'ⱍⱌⱂⰳ'],
  ['2000', 'ⰱⱍ'],
  ['2064', 'ⰱⱍⰿⰳ'],
  ['9000', 'ⰸⱍ'],
  ['10000', 'ⰺⱍ'],
  ['11000', 'ⰰⰺⱍ'],
  ['12345', 'ⰱⰺⱍⱅⰽⰴ'],
  ['100000', 'ⱃⱍ'],
  ['999999', 'ⱌⱂⰸⱍⱌⱂⰸ'],
];

describe('Glagolitic numerals', () => {
  test('each letter has the value of the table', () => {
    for (const [value, codePoint] of VALUES) {
      assert.strictEqual(
        toGlagoliticNumerals(String(value)),
        String.fromCodePoint(codePoint) + '҃',
      );
    }
  });

  for (const [digits, letters] of NUMBERS) {
    test(`${digits} ↔ ${letters}`, () => {
      assert.strictEqual(
        toGlagoliticNumerals(digits, 'dots'),
        `·${letters.toUpperCase()}·`,
      );
      assert.strictEqual(fromGlagoliticNumerals(`·${letters}·`), digits);
    });
  }

  test('every number is its own numeral, and each reads back', () => {
    const seen = new Set<string>();
    let count = 0;
    // all of 1 to 9999, then a stride through the rest
    for (let n = 1; n <= 999_999; n += n < 9999 ? 1 : 997) {
      const glag = toGlagoliticNumerals(String(n));
      assert.match(glag, /^([Ⰰ-Ⱟ]҃){1,7}$/u);
      assert.strictEqual(fromGlagoliticNumerals(glag), String(n));
      seen.add(glag);
      count++;
    }
    assert.strictEqual(seen.size, count);
  });

  test('a number is marked by a titlo on every letter, by dots, or by both', () => {
    assert.strictEqual(toGlagoliticNumerals('19', 'titlo'), 'Ⰸ҃Ⰺ҃');
    assert.strictEqual(toGlagoliticNumerals('19', 'dots'), '·ⰈⰊ·');
    assert.strictEqual(toGlagoliticNumerals('19', 'dots-titlo'), '·Ⰸ҃Ⰺ҃·');

    // read as well: one titlo at the end, with dots or without
    for (const glag of ['ⰸ҃ⰺ҃', '·ⰸⰺ·', '·ⰸ҃ⰺ҃·', 'ⰸⰺ҃', '·ⰸⰺ҃·']) {
      assert.strictEqual(fromGlagoliticNumerals(glag), '19');
    }
  });

  test('dots around a number are not the comma next to it', () => {
    // `·` is also the Glagolitic comma, `··` the exclamation mark
    assert.strictEqual(fromGlagoliticNumerals('·ⰶ·· ·ⰷ···'), '7· 8··');
    // a comma with a letter on its other side closes no number
    assert.strictEqual(fromGlagoliticNumerals('ⰰ·ⰲ·ⰱ'), 'ⰰ·ⰲ·ⰱ');
    assert.strictEqual(fromGlagoliticNumerals('ⱅⱁ· ⰰ· ⱅⱁ'), 'ⱅⱁ· ⰰ· ⱅⱁ');
    // one dot is not enough, but the titlo still is
    assert.strictEqual(fromGlagoliticNumerals('ⰰ·ⰶ҃'), 'ⰰ·7');
  });

  test('both forms of izhe are 10', () => {
    assert.strictEqual(fromGlagoliticNumerals('ⰸⰹ҃ Ⰹ҃'), '19 10');
  });

  test('other spellings of the thousands are read, not written', () => {
    for (const [glag, digits] of [
      ['ⰰⱍ҃', '1000'], // one before the thousand
      ['ⱎ҃', '2000'],
      ['ⱎⰿⰳ҃', '2064'],
      ['ⱏ҃', '3000'],
      ['ⱑ҃', '4000'],
      ['ⱓⱌⱂⰸ҃', '5999'],
    ]) {
      assert.strictEqual(fromGlagoliticNumerals(glag), digits);
    }
    assert.strictEqual(toGlagoliticNumerals('2064', 'dots'), '·ⰁⰝⰏⰃ·');
  });

  test('anything that is not a number from 1 to 999 999 on its own is left', () => {
    for (const text of [
      '0',
      '1000000',
      '007',
      '3.14',
      '1,5',
      'A1',
      '1a',
      'ⰰ1',
    ]) {
      assert.strictEqual(toGlagoliticNumerals(text), text);
    }
    // punctuation around a number is not a decimal point
    assert.strictEqual(
      toGlagoliticNumerals('(19), 7. 5-6'),
      '(Ⰸ҃Ⰺ҃), Ⰶ҃. Ⰴ҃-Ⰵ҃',
    );
  });

  test('a word that is not a well-formed numeral is left', () => {
    for (const text of [
      'ⰸⰺ', // neither titlo nor dots: a word
      'ⰸ҃ⰺ', // titlo inside only: an abbreviation
      'ⰿ҃ⱄ',
      '·ⰸ҃ⰺ·',
      'ⱃ҃ⰸⰺ҃', // a titlo on some letters, not on all
      'ⰺⰸ҃', // 10 + 9 in the wrong order
      'ⰰⱃ҃', // unit before hundred
      'ⰰⰰ҃',
      'ⱃⱃⱃⱃ҃',
      '·ⰰⰰ·',
      'ⱍⱍ҃', // the thousand twice
      'ⰰⰰⱍ҃', // no such count of thousands
      'ⰱⱎ҃', // the old letters take no multiplier
      'ⱎⱍ҃',
    ]) {
      assert.strictEqual(fromGlagoliticNumerals(text), text);
    }
  });

  test('strict reading takes only a titlo over every letter', () => {
    for (const [glag, read] of [
      ['ⰸ҃ⰺ҃', '19'],
      ['·ⰸ҃ⰺ҃·', '19'],
      ['ⰶ҃', '7'],
      ['ⰸⰺ҃', 'ⰸⰺ҃'],
      ['·ⰸⰺ·', '·ⰸⰺ·'],
      ['·ⰸⰺ҃·', '·ⰸⰺ҃·'],
      ['ⰿ҃ⱄ', 'ⰿ҃ⱄ'],
      ['ⰺ҃ⰸ҃', 'ⰺ҃ⰸ҃'], // every letter titled, but no number
    ]) {
      assert.strictEqual(fromGlagoliticNumerals(glag, true), read);
    }
  });

  test('capital letters are read too', () => {
    assert.strictEqual(fromGlagoliticNumerals('ⰈⰊ҃'), '19');
  });
});

describe('glagoliticNumerals', () => {
  // Each case: input, the result without the option, the result with it.
  const cases: [
    string,
    'isv-Glag' | 'isv-Latn' | 'isv-Cyrl',
    string,
    string,
  ][] = [
    // digits become letters only on the way to Glagolitic
    ['19 knig', 'isv-Glag', '19 ⰽⱀⰻⰳ', 'Ⰸ҃Ⰺ҃ ⰽⱀⰻⰳ'],
    ['19 knig', 'isv-Latn', '19 knig', '19 knig'],
    ['19 knig', 'isv-Cyrl', '19 книг', '19 книг'],
    [
      'V 2026 godu, 7 knig',
      'isv-Glag',
      'Ⰲ 2026 ⰳⱁⰴⱆ· 7 ⰽⱀⰻⰳ',
      'Ⰲ Ⰱ҃Ⱍ҃Ⰻ҃Ⰵ҃ ⰳⱁⰴⱆ· Ⰶ҃ ⰽⱀⰻⰳ',
    ],
    // a single titlo at the end, or dots, make a number only with the
    // option; without it the titlo is dropped and the letters are a word
    ['ⰸⰺ҃ ⰽⱀⰻⰳ', 'isv-Latn', 'zj knig', '19 knig'],
    ['ⰸⰺ҃ ⰽⱀⰻⰳ', 'isv-Cyrl', 'зј книг', '19 книг'],
    ['ⰸⰺ҃ ⰽⱀⰻⰳ', 'isv-Glag', 'ⰸⰹ ⰽⱀⰻⰳ', 'Ⰸ҃Ⰺ҃ ⰽⱀⰻⰳ'],
    ['·ⰸⰺ· ⰽⱀⰻⰳ', 'isv-Latn', ',zj, knig', '19 knig'],
    // a titlo over every letter is a number with the option or without
    ['ⰸ҃ⰺ҃ ⰽⱀⰻⰳ', 'isv-Latn', '19 knig', '19 knig'],
    ['ⰸ҃ⰺ҃ ⰽⱀⰻⰳ', 'isv-Glag', '19 ⰽⱀⰻⰳ', 'Ⰸ҃Ⰺ҃ ⰽⱀⰻⰳ'],
    ['·ⰸ҃ⰺ҃· ⰽⱀⰻⰳ', 'isv-Cyrl', '19 книг', '19 книг'],
    ['ⰶ҃ ⰽⱀⰻⰳ', 'isv-Latn', '7 knig', '7 knig'],
    ['Ⰱ҃ⱍ҃ⰻ҃ⰵ҃։', 'isv-Latn', '2026.', '2026.'],
    // an abbreviation stays a word either way
    ['ⰿ҃ⱄ', 'isv-Latn', 'ms', 'ms'],
    ['ⱀⰰⱂ҃ⱃ', 'isv-Latn', 'napr', 'napr'],
  ];

  for (const [input, code, off, withOption] of cases) {
    test(`${input} → ${code}: ${off} | ${withOption}`, () => {
      assert.strictEqual(transliterate(input, code), off);
      assert.strictEqual(
        transliterate(input, code, { glagoliticNumerals: false }),
        off,
      );
      assert.strictEqual(transliterate(input, code, on), withOption);
    });
  }

  test('the value of the option is how a number is written', () => {
    const write = (glagoliticNumerals: 'titlo' | 'dots' | 'dots-titlo') =>
      transliterate('V 1994 godu, 7 knig!', 'isv-Glag', { glagoliticNumerals });

    assert.strictEqual(write('titlo'), 'Ⰲ Ⱍ҃Ⱌ҃Ⱂ҃Ⰳ҃ ⰳⱁⰴⱆ· Ⰶ҃ ⰽⱀⰻⰳ··');
    assert.strictEqual(write('dots'), 'Ⰲ ·ⰝⰜⰒⰃ· ⰳⱁⰴⱆ· ·Ⰶ· ⰽⱀⰻⰳ··');
    assert.strictEqual(write('dots-titlo'), 'Ⰲ ·Ⱍ҃Ⱌ҃Ⱂ҃Ⰳ҃· ⰳⱁⰴⱆ· ·Ⰶ҃· ⰽⱀⰻⰳ··');
  });

  test('every mark is read, whichever one is written', () => {
    for (const glagoliticNumerals of ['titlo', 'dots', 'dots-titlo'] as const) {
      const options = { glagoliticNumerals };
      const glag = transliterate('7, 8! (19) 10000', 'isv-Glag', options);

      assert.strictEqual(
        transliterate(glag, 'isv-Latn', on),
        '7, 8! (19) 10000',
      );
      assert.strictEqual(transliterate(glag, 'isv-Glag', options), glag);
    }
  });

  test('a number is always capital, whatever the case around it', () => {
    for (const text of ['19 knig', '19 KNIG', 'knig 19', '19']) {
      assert.match(transliterate(text, 'isv-Glag', on), /Ⰸ҃Ⰺ҃/u);
    }
  });

  test('an unknown style is refused', () => {
    assert.throws(
      () =>
        transliterate('19', 'isv-Glag', {
          glagoliticNumerals: 'toString' as never,
        }),
      /Unsupported glagoliticNumerals: toString/,
    );
  });

  test("input: 'isv-x-etymolog' reads no Glagolitic, numbers included", () => {
    const options = { ...on, input: 'isv-x-etymolog' } as const;

    assert.strictEqual(transliterate('ⰸⰺ҃', 'isv-Latn', options), 'ⰸⰺ҃');
    assert.strictEqual(
      transliterate('19 knig', 'isv-Glag', options),
      'Ⰸ҃Ⰺ҃ ⰽⱀⰻⰳ',
    );
  });

  test('normalize reads Glagolitic numbers', () => {
    assert.strictEqual(
      normalize('ⰸⰺ҃ ⰽⱀⰻⰳ', { ...on, output: 'isv-Latn' }),
      '19 knig',
    );
    assert.strictEqual(
      normalize('ⰸⰺ҃ ⰽⱀⰻⰳ', { output: 'isv-Latn' }),
      'zj knig',
    );
  });
});
