import type { NormalizeOptions } from './normalize-input.ts';

/**
 * The yers: Glagolitic ⱏ ⱐ, Cyrillic ъ ь, and the same signs in a Latin word.
 * What a yer stands for depends on its neighbours, so a flat letter table
 * cannot read it; these are the passes that do, run by `normalizeInput`
 * before the tables.
 *
 * Nothing here is new: this is the yer reading `normalizeInput` already had,
 * moved into one file so that a different reading can replace it.
 */

// Glagolitic ⱐ and ⱏ are resolved on the Glagolitic letters, before the letter
// table runs. Latin and Cyrillic never match.
const CONSONANT = /[ⰱⰲⰳⰴⰶⰷⰸⰼⰽⰾⰿⱀⱂⱃⱄⱅⱇⱈⱊⱋⱌⱍⱎⱒⱚⱞ]/;
const SOFTENED: Record<string, string> = {
  ⰴ: 'ď',
  ⰾ: 'ľ',
  ⱀ: 'ń',
  ⱃ: 'ŕ',
  ⱄ: 'ś',
  ⱅ: 'ť',
  ⰸ: 'ź',
};

// A yer between consonants before ⱃ marks a syllabic r: ⰱⱏⱃⰸ is `brz`,
// ⱌⱐⱃⰽⱏⰲ is `cŕkȯv`. The orthography writes no vowel there.
const SYLLABIC_R = new RegExp(
  `(?<=${CONSONANT.source})([ⱏⱐ])ⱃ(?=${CONSONANT.source})`,
  'g',
);

// ⱐ (not ⱐⰹ, which is `y`) after a consonant:
// - before a single word-final consonant it is `ė` (absolutėn, pės, dėnj);
// - after d l n r s t z it softens it (paĺto, ťma, gospodaŕ, råsteńje),
//   except that ľ and ń before a vowel or at the end stay `lj`, `nj`;
// - after any other consonant, or j, and before a consonant, it is `ė`.
// Anything else is left to the tables (ⱍⱐ is `ć`, ⱐ before a vowel is `j`).
const YERI = /(.?)ⱐ(?!ⰹ)(?=(.?)(ⱐ?%)?)/g;
const LJ_NJ = /^[ⰰⰵⰻⱁⱆⱉⱑⱔⱕⱘⱛ%]?$/;

function readYeri(m: string, prev: string, next: string, end?: string) {
  if (end && CONSONANT.test(next)) return `${prev}ė`;
  const soft = SOFTENED[prev];
  if (soft) return /[ⰾⱀ]/.test(prev) && LJ_NJ.test(next) ? `${prev}ⰹ` : soft;
  const hard = /[ⰹⰺ]/.test(prev) || (prev !== 'ⱍ' && CONSONANT.test(prev));
  return hard && CONSONANT.test(next) ? `${prev}ė` : m;
}

/** Reads the Glagolitic yers of a `%`-bounded word; the rest is untouched. */
export const readGlagoliticYers = (word: string): string =>
  word
    .replace(SYLLABIC_R, (_, yer: string) => (yer === 'ⱐ' ? 'ŕ' : 'r'))
    .replace(YERI, readYeri);

// A word-final hard yer — Glagolitic ⱏ or Cyrillic ъ, the latter also at the
// end of a Latin word (dųbъ) — is silent after a vowel: kanalⱏ is `kanal`,
// sⱏmⱏⰹslⱏ is `sȯmysl`. A word with no vowel before it keeps it, because
// vⱏ, sⱏ, kⱏ are the words `vȯ`, `sȯ`, `kȯ`.
//
// A vowel here is a letter the tables below read as one, or a yer or soft sign
// (which are the vowel of sⱏnⱏ `sȯn`, pⱐsⱏ `pės`, ⱅⱏⱃⰳⱏ `trg`).
const GLAGOLITIC_VOWELS = 'ⰰⰵⰻⱁⱆⱉⱑⱓⱔⱕⱖⱗⱘⱙⱛⱝⱏⱐ';
const CYRILLIC_VOWELS = 'аеєѣиіїоѡуѹȣыꙑэюяёѥѧѩѫѭѵѷꙗӑъь';
const LATIN_VOWELS = 'aeiouyåěęėȯųêáéìíóœýàâāîīĭúûůūąǫũēĕëèôŏöòъь';
const FINAL_YER = {
  auto: new RegExp(
    `(?<=(?:[${GLAGOLITIC_VOWELS}${CYRILLIC_VOWELS}${LATIN_VOWELS}]|ⱏⰹ)[^%]*)[ⱏъ](?=%)`,
  ),
  // everywhere, but never the whole word: a lone yer is not an empty string
  drop: /(?<=[^%])[ⱏъ](?=%)/,
};

// A hard yer before j or an iotated vowel is only a separator when a vowel
// precedes it, and it is a `j` (which keeps подъѥздъ from becoming `pod́ezd`):
// объявити is `objaviti`, подъѥздъ is `podjezd`. Not before `jd`
// (izъjdti is `izȯjdti`, as in the dictionary), and not in a word with no
// vowel before it (tъj is `tȯj`).
const SEPARATOR_YER = new RegExp(
  `(?<=[${CYRILLIC_VOWELS}${LATIN_VOWELS}][^%]*)ъ(?=[яюѥꙗё]|j(?!d))`,
  'g',
);

/** Drops a word-final hard yer as `finalYer` says (see `NormalizeOptions`). */
export const dropFinalYer = (
  word: string,
  finalYer: NonNullable<NormalizeOptions['finalYer']>,
): string =>
  finalYer === 'keep' ? word : word.replace(FINAL_YER[finalYer], '');

/** Turns a hard yer that only separates (объявити) into a `j`. */
export const separateYer = (word: string): string =>
  word.replace(SEPARATOR_YER, 'j');
