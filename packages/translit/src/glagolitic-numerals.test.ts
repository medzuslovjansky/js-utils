import { describe, test } from 'node:test';
import assert from 'node:assert';

import {
  fromGlagoliticNumerals,
  toGlagoliticNumerals,
} from './glagolitic-numerals.ts';
import { normalize } from './normalize-text.ts';
import { transliterate } from './transliterate.ts';

const on = { alphabeticalNumerals: true } as const;

// The letter values, by code point, so that a look-alike letter cannot slip
// into the table: units Ⰰ–Ⰸ, tens Ⰺ–Ⱂ (not Ⰹ), hundreds Ⱃ–Ⱉ, Ⱋ, Ⱌ (not Ⱊ).
const VALUES: [number, number][] = [
  [1, 0x2c30],
  [2, 0x2c31],
  [3, 0x2c32],
  [4, 0x2c33],
  [5, 0x2c34],
  [6, 0x2c35],
  [7, 0x2c36],
  [8, 0x2c37],
  [9, 0x2c38],
  [10, 0x2c3a],
  [20, 0x2c3b],
  [30, 0x2c3c],
  [40, 0x2c3d],
  [50, 0x2c3e],
  [60, 0x2c3f],
  [70, 0x2c40],
  [80, 0x2c41],
  [90, 0x2c42],
  [100, 0x2c43],
  [200, 0x2c44],
  [300, 0x2c45],
  [400, 0x2c46],
  [500, 0x2c47],
  [600, 0x2c48],
  [700, 0x2c49],
  [800, 0x2c4b],
  [900, 0x2c4c],
];

// Hundreds, tens, units; 11 to 19 put the unit before the ten.
const NUMBERS: [string, string][] = [
  ['1', 'ⰰ҃'],
  ['9', 'ⰸ҃'],
  ['10', 'ⰺ҃'],
  ['11', 'ⰰⰺ҃'],
  ['19', 'ⰸⰺ҃'],
  ['20', 'ⰻ҃'],
  ['21', 'ⰻⰰ҃'],
  ['99', 'ⱂⰸ҃'],
  ['100', 'ⱃ҃'],
  ['101', 'ⱃⰰ҃'],
  ['110', 'ⱃⰺ҃'],
  ['119', 'ⱃⰸⰺ҃'],
  ['120', 'ⱃⰻ҃'],
  ['345', 'ⱅⰽⰴ҃'],
  ['800', 'ⱋ҃'],
  ['999', 'ⱌⱂⰸ҃'],
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

  for (const [digits, glag] of NUMBERS) {
    test(`${digits} ↔ ${glag}`, () => {
      assert.strictEqual(toGlagoliticNumerals(digits), glag);
      assert.strictEqual(fromGlagoliticNumerals(glag), digits);
    });
  }

  test('1 to 999 are 999 different numerals, and each reads back', () => {
    const seen = new Set<string>();
    for (let n = 1; n <= 999; n++) {
      const glag = toGlagoliticNumerals(String(n));
      assert.match(glag, /^[ⰰ-ⱟ]{1,3}҃$/u);
      assert.strictEqual(fromGlagoliticNumerals(glag), String(n));
      seen.add(glag);
    }
    assert.strictEqual(seen.size, 999);
  });

  test('anything that is not a number from 1 to 999 on its own is left', () => {
    for (const text of [
      '0',
      '1000',
      '2026',
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
      '(ⰸⰺ҃), ⰶ҃. ⰴ҃-ⰵ҃',
    );
  });

  test('a word that is not a well-formed numeral is left', () => {
    for (const text of [
      'ⰸⰺ', // no titlo: a word
      'ⰸ҃ⰺ', // titlo inside: an abbreviation
      'ⰿ҃ⱄ',
      'ⰺⰸ҃', // 10 + 9 in the wrong order
      'ⰰⱃ҃', // unit before hundred
      'ⰰⰰ҃',
      'ⱃⱃⱃⱃ҃',
    ]) {
      assert.strictEqual(fromGlagoliticNumerals(text), text);
    }
  });

  test('capital letters are read too', () => {
    assert.strictEqual(fromGlagoliticNumerals('ⰈⰊ҃'), '19');
  });
});

describe('alphabeticalNumerals', () => {
  // Each case: input, the result without the option, the result with it.
  const cases: [
    string,
    'isv-Glag' | 'isv-Latn' | 'isv-Cyrl',
    string,
    string,
  ][] = [
    // digits become letters only on the way to Glagolitic
    ['19 knig', 'isv-Glag', '19 ⰽⱀⰻⰳ', 'ⰸⰺ҃ ⰽⱀⰻⰳ'],
    ['19 knig', 'isv-Latn', '19 knig', '19 knig'],
    ['19 knig', 'isv-Cyrl', '19 книг', '19 книг'],
    [
      'V 2026 godu, 7 knig',
      'isv-Glag',
      'Ⰲ 2026 ⰳⱁⰴⱆ, 7 ⰽⱀⰻⰳ',
      'Ⰲ 2026 ⰳⱁⰴⱆ, ⰶ҃ ⰽⱀⰻⰳ',
    ],
    // a Glagolitic number is read as one only with the option; without
    // it the titlo is dropped and the letters are a word
    ['ⰸⰺ҃ ⰽⱀⰻⰳ', 'isv-Latn', 'zj knig', '19 knig'],
    ['ⰸⰺ҃ ⰽⱀⰻⰳ', 'isv-Cyrl', 'зј книг', '19 книг'],
    ['ⰸⰺ҃ ⰽⱀⰻⰳ', 'isv-Glag', 'ⰸⰹ ⰽⱀⰻⰳ', 'ⰸⰺ҃ ⰽⱀⰻⰳ'],
    // an abbreviation stays a word either way
    ['ⰿ҃ⱄ', 'isv-Latn', 'ms', 'ms'],
    ['ⱀⰰⱂ҃ⱃ', 'isv-Latn', 'napr', 'napr'],
  ];

  for (const [input, code, off, withOption] of cases) {
    test(`${input} → ${code}: ${off} | ${withOption}`, () => {
      assert.strictEqual(transliterate(input, code), off);
      assert.strictEqual(
        transliterate(input, code, { alphabeticalNumerals: false }),
        off,
      );
      assert.strictEqual(transliterate(input, code, on), withOption);
    });
  }

  test("input: 'isv-x-etymolog' reads no Glagolitic, numbers included", () => {
    const options = { ...on, input: 'isv-x-etymolog' } as const;

    assert.strictEqual(transliterate('ⰸⰺ҃', 'isv-Latn', options), 'ⰸⰺ҃');
    assert.strictEqual(
      transliterate('19 knig', 'isv-Glag', options),
      'ⰸⰺ҃ ⰽⱀⰻⰳ',
    );
  });

  test('normalize reads Glagolitic numbers', () => {
    assert.strictEqual(normalize('ⰸⰺ҃ ⰽⱀⰻⰳ', 'standard', on), '19 knig');
    assert.strictEqual(normalize('ⰸⰺ҃ ⰽⱀⰻⰳ', 'standard'), 'zj knig');
  });
});
