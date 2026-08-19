import { transliterate } from '@interslavic/translit';

const NOT_KEY = /[^a-z0-9]+/g;

/**
 * The northern flavorisation writes the glide as `i`, everyone else as `j`:
 * `slovianski` against `slovjanski`. Folding one into the other costs nothing —
 * `radio` and `radjo` were never two words either.
 */
const I_GLIDE = /i(?=[aeou])/g;
const COMBINING = /\p{M}+/gu;
/**
 * The southern flavorisation spells `ȯ` as `ă`, and `transliterate()` reads it
 * as the fleeting vowel it is and drops the letter — `sălnce` comes back as
 * `slnce`. Put it back before the round trip so it survives as `o`.
 */
const SOUTHERN_YER = /ă/g;

/**
 * What is left once a word is in standard Interslavic Latin. A search box
 * produces none of these letters, and the flavorisations disagree about half of
 * them, so all of them fold to the bare letter: `råzum`, `razum` and `разум`
 * become the same key, and so do `medžuslovjansky`, `meďuslovjańsky` and
 * `medzuslovjanski`.
 */
const BARE: Record<string, string> = {
  å: 'a',
  ą: 'a',
  ć: 'c',
  č: 'c',
  ď: 'd',
  đ: 'd',
  ė: 'e',
  ę: 'e',
  ě: 'e',
  ĺ: 'l',
  ľ: 'l',
  ł: 'l',
  ń: 'n',
  ň: 'n',
  ȯ: 'o',
  ŕ: 'r',
  ř: 'r',
  ś: 's',
  š: 's',
  ť: 't',
  ų: 'u',
  ů: 'u',
  ź: 'z',
  ž: 'z',
  // `y` and `i` are separate letters, but the northern and Sloviant
  // flavorisations spell the first as the second, so a query typed in either
  // has to reach the other.
  y: 'i',
  // the soft sign survives Cyrillic round-tripping and carries no sound
  ь: '',
  ъ: '',
};

/**
 * Any script, any flavorisation, one key. This is where most of the recall in
 * an Interslavic index comes from — more than the stemmer, and for a corpus
 * written in several alphabets, far more.
 */
export function fold(word: string): string {
  let w = word.toLowerCase();

  // Unconditionally, not just for Cyrillic/Glagolitic: on Latin input this is what undoes
  // the ASCII flavorisation's digraphs, `zsena` back to `žena`.
  w = transliterate(w.replace(SOUTHERN_YER, 'ȯ'), 'isv-Latn').toLowerCase();

  let out = '';
  for (const ch of w) {
    out += ch in BARE ? BARE[ch] : ch;
  }

  return (
    out
      // Anything the table missed loses its diacritic rather than the whole
      // letter: `NOT_KEY` would otherwise delete it and quietly shorten the word.
      .normalize('NFD')
      .replace(COMBINING, '')
      .replace(NOT_KEY, '')
      .replace(I_GLIDE, 'j')
  );
}
