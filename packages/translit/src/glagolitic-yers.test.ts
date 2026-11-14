import { describe, test } from 'node:test';
import assert from 'node:assert';

import { transliterate } from './transliterate.ts';

// What the yers ⱐ and ⱏ stand for in Glagolitic input depends on their
// neighbours. Each case: Glagolitic, etymological Latin, standard Latin.
const groups: Record<string, [string, string, string][]> = {
  // ⱏ before ⱃ between consonants marks a syllabic r, written with no vowel
  'syllabic r': [
    ['ⰱⱏⱃⰸ', 'brz', 'brz'],
    ['ⰱⱏⱃⰸⱏⰹ', 'brzy', 'brzy'],
    ['ⰽⱏⱃⰲ', 'krv', 'krv'],
    ['ⱅⱏⱃⰳ', 'trg', 'trg'],
    ['ⰱⱃⰸ', 'brz', 'brz'],
  ],
  // ⱐ before ⱃ between consonants marks a syllabic soft ŕ
  'syllabic ŕ': [
    ['ⱌⱐⱃⰽⱏⰲ', 'cŕkȯv', 'crkov'],
    ['ⱂⱐⱃⰲⱏⰹ', 'pŕvy', 'prvy'],
    ['ⰲⱐⱃⱈ', 'vŕh', 'vrh'],
  ],
  // ⱐ before a single word-final consonant is the vowel ė
  'ė in a closed final syllable': [
    ['ⰰⰱⱄⱁⰾⱆⱅⱐⱀ', 'absolutėn', 'absoluten'],
    ['ⱂⱐⱄ', 'pės', 'pes'],
    ['ⱁⱅⱐⱌ', 'otėc', 'otec'],
    ['ⰴⱐⱀⱐ', 'dėnj', 'denj'],
  ],
  // ⱐ after d l n r s t z softens it; ľ and ń stay lj, nj before a vowel
  // or at the end of the word
  'soft consonants': [
    ['ⰴⱁⱄⱅⱐ', 'dost́', 'dost'],
    ['ⰳⱁⱄⱂⱁⰴⰰⱃⱐ', 'gospodaŕ', 'gospodar'],
    ['ⱅⱐⰿⰰ', 't́ma', 'tma'],
    ['ⰳⰾⰰⱄⱐⱀⱁ', 'glaśno', 'glasno'],
    ['ⰲⱄⱐⰰⰽⱁ', 'vśako', 'vsako'],
    ['ⱂⰰⰾⱐⱅⱁ', 'paĺto', 'palto'],
    ['ⱃⰰⱄⱅⰵⱀⱐⰺⰵ', 'rasteńje', 'rastenje'],
    ['ⰲⰵⱄⰵⰾⱐⱓ', 'veseĺju', 'veselju'],
    ['ⰽⱁⱀⱐ', 'konj', 'konj'],
    ['ⰽⱁⱀⱐⰰ', 'konja', 'konja'],
    ['ⰽⱃⰰⰾⱐ', 'kralj', 'kralj'],
  ],
  // after any other consonant, or j, and before a consonant, ⱐ is ė
  'ė after other consonants': [
    ['ⱀⰰⰹⰿⱐⱀⱎⰻ', 'najmėnši', 'najmenši'],
    ['ⰹⰰⰹⱐⱍⱀⱏⰹ', 'jajėčny', 'jaječny'],
  ],
  // left to the letter table as before
  unchanged: [
    ['ⰱⱐⰹ', 'by', 'by'],
    ['ⱀⱁⱍⱐⱀⱏⰹ', 'noćny', 'nočny'],
    ['ⰿⱐⰰⱄⱁ', 'mjaso', 'mjaso'],
  ],
};

describe('Glagolitic → Latin: the yers', () => {
  for (const [name, cases] of Object.entries(groups)) {
    describe(name, () => {
      for (const [glag, etym, std] of cases) {
        test(`${glag} → ${etym} / ${std}`, () => {
          assert.strictEqual(transliterate(glag, 'isv-Latn-x-etymolog'), etym);
          assert.strictEqual(transliterate(glag, 'isv-Latn'), std);
        });
      }
    });
  }
});
