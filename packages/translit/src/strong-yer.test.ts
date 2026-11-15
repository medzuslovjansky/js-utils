import { describe, test } from 'node:test';
import assert from 'node:assert';

import { transliterate } from './transliterate.ts';

// A front yer after a consonant that could be soft is still the vowel `ė` in
// the places listed in `yers.ts`. One rule reads all three scripts, so each
// word is given three times: Latin with yers, Cyrillic, Glagolitic.
// Each case: the three spellings, etymological Latin, standard Latin.
type Case = [string, string, string, string, string];

const groups: Record<string, Case[]> = {
  'd s t z before two consonants': [
    ['tьmny', 'тьмны', 'ⱅⱐⰿⱀⱏⰹ', 'tėmny', 'temny'],
    ['potьmněti', 'потьмнѣти', 'ⱂⱁⱅⱐⰿⱀⱑⱅⰻ', 'potėmněti', 'potemněti'],
    ['sьgda', 'сьгда', 'ⱄⱐⰳⰴⰰ', 'sėgda', 'segda'],
    ['tьšća', 'тьшћа', 'ⱅⱐⱎⱋⰰ', 'tėšća', 'tešča'],
    ['cělodьnny', 'цѣлодьнны', 'ⱌⱑⰾⱁⰴⱐⱀⱀⱏⰹ', 'cělodėnny', 'cělodenny'],
  ],
  'before s only at the start of a word': [
    ['tьstь', 'тьсть', 'ⱅⱐⱄⱅⱐ', 'tėst́', 'test'],
    ['pętьsto', 'пѧтьсто', 'ⱂⱔⱅⱐⱄⱅⱁ', 'pęt́sto', 'petsto'],
  ],
  'd s t z before n c č g š and another yer or j': [
    ['tьnъk', 'тьнък', 'ⱅⱐⱀⱏⰽ', 'tėnȯk', 'tenok'],
    ['cělodьnьnъ', 'цѣлодьньнъ', 'ⱌⱑⰾⱁⰴⱐⱀⱐⱀ', 'cělodėnėn', 'cělodenen'],
    ['poldьnje', 'полдьнје', 'ⱂⱁⰾⰴⱐⱀⱐⰵ', 'poldėnje', 'poldenje'],
  ],
  'n before č š and a consonant or j': [
    ['konьčny', 'коньчны', 'ⰽⱁⱀⱐⱍⱀⱏⰹ', 'konėčny', 'konečny'],
    ['bezkonьčje', 'безконьчје', 'ⰱⰵⰸⰽⱁⱀⱐⱍⰹⰵ', 'bezkonėčje', 'bezkonečje'],
    ['dnьšni', 'дньшни', 'ⰴⱀⱐⱎⱀⰻ', 'dnėšni', 'dnešni'],
  ],
  'before j and a consonant': [
    ['sьjčas', 'сьјчас', 'ⱄⱐⰺⱍⰰⱄ', 'sėjčas', 'sejčas'],
    ['sěmьjny', 'сѣмьјны', 'ⱄⱑⰿⱐⰺⱀⱏⰹ', 'sěmėjny', 'sěmejny'],
  ],
  // the same consonants stay soft where the dictionary has them soft
  'still soft': [
    ['tьma', 'тьма', 'ⱅⱐⰿⰰ', 't́ma', 'tma'],
    ['konьče', 'коньче', 'ⰽⱁⱀⱐⱍⰵ', 'końče', 'konče'],
    ['zatьmjenije', 'затьмјеније', 'ⰸⰰⱅⱐⰿⰺⰵⱀⰻⰹⰵ', 'zat́mjenije', 'zatmjenije'],
    ['pisьmo', 'письмо', 'ⱂⰻⱄⱐⰿⱁ', 'piśmo', 'pismo'],
    ['hodьba', 'ходьба', 'ⱈⱁⰴⱐⰱⰰ', 'hod́ba', 'hodba'],
    ['glasьno', 'гласьно', 'ⰳⰾⰰⱄⱐⱀⱁ', 'glaśno', 'glasno'],
  ],
};

describe('the front yer that is ė after a consonant that could be soft', () => {
  for (const [name, cases] of Object.entries(groups)) {
    describe(name, () => {
      for (const [latin, cyrillic, glagolitic, etym, std] of cases) {
        for (const input of [latin, cyrillic, glagolitic]) {
          test(`${input} → ${etym} / ${std}`, () => {
            assert.strictEqual(
              transliterate(input, 'isv-Latn-x-etymolog'),
              etym,
            );
            assert.strictEqual(transliterate(input, 'isv-Latn'), std);
          });
        }
      }
    });
  }

  // Latin and Cyrillic write a syllabic r with the yer before it, which the
  // rule must not take for a vowel; and there č with a soft sign is čė, since
  // ć has a letter of its own
  test('a yer before r and a consonant is not a vowel', () => {
    assert.strictEqual(transliterate('sьrdce', 'isv-Latn'), 'srdce');
    assert.strictEqual(transliterate('сьрдце', 'isv-Latn'), 'srdce');
  });

  test('č and j before a soft sign and a consonant', () => {
    for (const input of ['čьstny', 'чьстны']) {
      assert.strictEqual(transliterate(input, 'isv-Latn-x-etymolog'), 'čėstny');
    }
    for (const input of ['stryjьcъ', 'стрыјьцъ']) {
      assert.strictEqual(
        transliterate(input, 'isv-Latn-x-etymolog'),
        'stryjėc',
      );
    }
  });
});
