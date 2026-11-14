import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { readHavlik } from './havlik.ts';

describe('readHavlik', () => {
  const cases: [string, string][] = [
    // the last yer is weak, the one before it strong
    ['krъvь', 'krȯv'],
    ['krъvьny', 'krȯvny'],
    ['krъvi', 'krvi'],
    ['sъnъ', 'sȯn'],
    ['sъna', 'sna'],
    ['otьcь', 'otėc'],
    ['otьca', 'otca'],
    ['dьnь', 'dėnj'],
    ['dьne', 'dne'],
    ['hrьbьtъ', 'hrėbėt'],
    // the notation may leave out the final weak ъ
    ['hrьbьt', 'hrėbėt'],
    // a weak ь softens
    ['konь', 'konj'],
    ['konьnica', 'konnica'],
    ['koňьski', 'koński'],
    ['dьržati', 'dŕžati'],
    ['drъžati', 'držati'],
    ['gorьky', 'goŕky'],
    ['mirьny', 'mirny'],
    ['kralь', 'kralj'],
    // syllabic liquids, prefixes
    ['vьlkъ', 'vȯlk'],
    ['vъzduhъ', 'vȯzduh'],
    ['vъzglavьje', 'vȯzglavje'],
    ['grьměti', 'grėměti'],
    ['blъha', 'blȯha'],
    ['kъrčma', 'krčma'],
    // a word with no vowel but a yer: the yer is the vowel
    ['vъ', 'vȯ'],
    ['sъ', 'sȯ'],
    ['kъ', 'kȯ'],
    ['mь', 'mė'],
    // a literal ė or ȯ is a mark and stays
    ['dȯska', 'dȯska'],
    ['šėptati', 'šėptati'],
    // a word without yers is not changed
    ['dub', 'dub'],
    ['voda', 'voda'],
  ];

  for (const [input, expected] of cases) {
    test(`${input} → ${expected}`, () => {
      assert.equal(readHavlik(input), expected);
    });
  }
});
