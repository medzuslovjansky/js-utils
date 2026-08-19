// noinspection NonAsciiCharacters,JSNonASCIINames

import { composePasses, type RawMap } from './fuse.ts';
import type { Flavour } from './flavorize.ts';

export interface Latn2CyrlOptions {
  flavour: Flavour;
  /**
   * Traditional iotated notation (v1's `type 6`) instead of standard
   * Cyrillic (`type 5`) -- ya/yu/yo ligatures and ъ/ь-marked softening
   * spelled the old way, rather than with љ/њ/ј.
   * @default false
   */
  iotated?: boolean;
}

/**
 * The shared Cyrillic core: every etymological letter's plain Cyrillic
 * spelling, plus the `lj`/`nj` digraphs and the two apostrophe markers.
 * Identical for standard and traditional-iotated notation, and for every
 * flavour -- this is what v1 runs before any flavour- or iotation-specific
 * branching.
 */
const CORE: RawMap = {
  lj: 'љ',
  nj: 'њ',
  a: 'а',
  å: 'ӑ',
  b: 'б',
  c: 'ц',
  ć: 'ћ',
  č: 'ч',
  d: 'д',
  ḓ: 'д',
  ď: 'дь',
  đ: 'ђ',
  e: 'е',
  ę: 'ѧ',
  ě: 'є',
  f: 'ф',
  g: 'г',
  h: 'х',
  i: 'и',
  j: 'ј',
  k: 'к',
  l: 'л',
  ľ: 'ль',
  m: 'м',
  n: 'н',
  ń: 'нь',
  o: 'о',
  ȯ: 'ъ',
  p: 'п',
  r: 'р',
  ř: 'рь',
  s: 'с',
  ś: 'сь',
  š: 'ш',
  t: 'т',
  ṱ: 'т',
  ť: 'ть',
  u: 'у',
  ų: 'ѫ',
  ŭ: 'ў',
  v: 'в',
  y: 'ы',
  z: 'з',
  ź: 'зь',
  ž: 'ж',
  '’': 'ъ',
  '`': '’',
};

/**
 * v1 branches the letters `core` just produced on `flav == '1'` vs
 * everything else -- not a delta, a genuine fork: extended notation keeps
 * ṙ/ŕ as their own two-letter spellings (ър/ьр) and leaves `ė` alone for
 * the iotated pass to pick up later; every other flavour collapses ṙ/ŕ to
 * plain р and consumes `ė` right here.
 */
const EXTENDED_SYLLABIC_R: RawMap = { ṙ: 'ър', ŕ: 'ьр' };

/**
 * Flavour deltas on the letters `core` just produced, on top of the
 * ṙ/ŕ/ė resolution every non-extended flavour shares: southern re-merges
 * the `ě` letter into plain е and re-forms the lj/nj digraphs it had just
 * split at a word boundary; etymological keeps the old "ѣ" spelling users
 * asked for.
 */
const FLAVOUR_DELTA: Record<Exclude<Flavour, '1'>, RawMap> = {
  '2': { є: 'ѣ' },
  '3': {},
  '4': {},
  S: {},
  J: { є: 'е', 'л#ј': 'љ', 'н#ј': 'њ' },
};

function notationMap(flavour: Flavour): RawMap {
  return flavour === '1'
    ? EXTENDED_SYLLABIC_R
    : { ṙ: 'р', ŕ: 'р', ė: 'е', ...FLAVOUR_DELTA[flavour] };
}

/*
 * Traditional iotated notation ("type 6"): re-spells the standard letters
 * into their older forms. Each raw map below is still a flat longest-match
 * table; whether adjacent ones can share a single trie pass is for
 * `composePasses` to decide -- the comments describe the *original*
 * ordering dependency each one exists for, which is what the soundness
 * test re-derives (or safely improves on), not what it takes on faith.
 */

const UNMERGE_DIGRAPHS: RawMap = { љ: 'ль', њ: 'нь', ê: 'ѣ', є: 'ѣ' };

const IOTATE_VOWELS: RawMap = {
  ја: 'я',
  ьа: 'я',
  јѣ: 'ꙓ',
  ьѣ: 'ꙓ',
  јѧ: 'ѩ',
  ьѧ: 'ѩ',
  ју: 'ю',
  ьу: 'ю',
  јѫ: 'ѭ',
  ьѫ: 'ѭ',
  ј: 'й',
};

// v1 re-runs the syllabic-liquid resolution here too. For the five
// non-extended flavours ė/ȯ/ṙ/ŕ are already gone by this point (consumed
// above), so this pass is a no-op for them -- but for extended notation
// (flav '1'), `ė` was deliberately left untouched above, and this is where
// it finally gets consumed. ȯ/ṙ/ŕ stay dead code for every flavour (ȯ is
// gone by the shared `core` pass; ṙ/ŕ are gone by `EXTENDED_SYLLABIC_R` for
// '1' specifically) -- kept for source fidelity, not pruned on an
// unverified "it can't happen" claim (that claim was wrong once already:
// see the flav '1' handling this pass exists for).
const RESOLVE_LIQUIDS_AGAIN: RawMap = {
  ė: 'ь',
  ȯ: 'ъ',
  ṙ: 'ър',
  ŕ: 'ьр',
};

const COLLAPSE_SOFT_SIGN: RawMap = { ьь: 'ь' };

const E_BEFORE_E: RawMap = {
  '#е': '#э',
  '%е': '%э',
  ае: 'аэ',
  ее: 'еэ',
  єе: 'єэ',
  ие: 'иэ',
  ое: 'оэ',
  уе: 'уэ',
  ые: 'ыэ',
};

// Drops a `й` that sits right after a boundary marker or after a vowel
// (softening is implied there); everywhere else, before е/и, it becomes a
// soft sign instead. These stay THREE separate raw maps, in this order,
// because dropping a `й` can pull characters together that then feed the
// next rule -- e.g. "%йейе" first drops the boundary-adjacent `й`
// ("%е" + "йе"), which brings а freed "е" right up against the next "йе",
// which the vowel-context rule only now gets to see. A single merged pass
// would miss that, and the soundness test agrees: their key/match
// alphabets overlap (all three react to `й`), so `composePasses` refuses.
const DROP_JI_AT_BOUNDARY: RawMap = {
  '#йе': '#е',
  '#йи': '#и',
  '%йе': '%е',
  '%йи': '%и',
};

const DROP_JI_AFTER_VOWEL: RawMap = {
  айе: 'ае',
  айи: 'аи',
  ейе: 'ее',
  ейи: 'еи',
  єйе: 'єе',
  єйи: 'єи',
  ийе: 'ие',
  ийи: 'ии',
  ойе: 'ое',
  ойи: 'ои',
  уйе: 'уе',
  уйи: 'уи',
  ыйе: 'ые',
  ыйи: 'ыи',
};

const SOFTEN_REMAINING_JI: RawMap = { йе: 'ье', йи: 'ьи' };
const YAT_TO_E: RawMap = { ѣ: 'е' };
const COLLAPSE_SOFT_MARKER: RawMap = { ьıь: 'ь' };
const HASH_TO_APOSTROPHE: RawMap = { '#': '’' };

// Extended notation (flav '1') ligates a leftover й/ь before е/и into a
// single letter (ѥ/ӥ) instead of the drop-or-soften handling every other
// flavour gets, and additionally merges ш+ч/ћ into щ.
const EXTENDED_LIGATURES: RawMap = {
  йе: 'ѥ',
  ье: 'ѥ',
  йи: 'ӥ',
  ьи: 'ӥ',
  шч: 'щ',
  шћ: 'щ',
};

// Every other flavour: drop or soften a leftover `й` before е/и (order
// matters -- see the comment on `DROP_JI_AT_BOUNDARY`), then flatten ѣ/ьıь.
const STANDARD_LIGATURES: RawMap[] = [
  E_BEFORE_E,
  DROP_JI_AT_BOUNDARY,
  DROP_JI_AFTER_VOWEL,
  SOFTEN_REMAINING_JI,
  YAT_TO_E,
  COLLAPSE_SOFT_MARKER,
];

// Shared toScript tail, run after any script-specific branch: collapse a
// stray double `j` and drop the leftover phase markers -- word boundary
// `%`, delimiter `#`, soft-consonant marker `ı`.
const FINAL_CLEANUP: RawMap = { jj: 'j', '#': '', ı: '', '%': '' };

const FLAVOURS: Flavour[] = ['1', '2', '3', '4', 'S', 'J'];

/**
 * `latn2cyrl`'s two branches (standard notation, and traditional iotated on
 * top of it) each become one raw-map sequence per flavour, in v1's original
 * order, handed whole to `composePasses`. Whatever passes the soundness
 * test grants get folded together -- including the shared `FINAL_CLEANUP`
 * tail, which v1 always ran as its own separate final call.
 */
const STANDARD_PASSES: Record<Flavour, Array<(word: string) => string>> =
  Object.fromEntries(
    FLAVOURS.map((flavour) => [
      flavour,
      composePasses([CORE, notationMap(flavour), FINAL_CLEANUP]),
    ]),
  ) as Record<Flavour, Array<(word: string) => string>>;

const IOTATED_PASSES: Record<Flavour, Array<(word: string) => string>> =
  Object.fromEntries(
    FLAVOURS.map((flavour) => [
      flavour,
      composePasses([
        CORE,
        notationMap(flavour),
        UNMERGE_DIGRAPHS,
        IOTATE_VOWELS,
        RESOLVE_LIQUIDS_AGAIN,
        COLLAPSE_SOFT_SIGN,
        ...(flavour === '1' ? [EXTENDED_LIGATURES] : STANDARD_LIGATURES),
        HASH_TO_APOSTROPHE,
        FINAL_CLEANUP,
      ]),
    ]),
  ) as Record<Flavour, Array<(word: string) => string>>;

/**
 * v1 `toScript` for Cyrillic (`type 5`, or `type 6` with `iotated: true`).
 * Takes a word already through `resolveLiquids` + `flavorize` -- i.e. still
 * on the etymological alphabet, `%`-bounded, with any `#`/`ı` phase markers
 * still in place.
 */
export function latn2cyrl(word: string, options: Latn2CyrlOptions): string {
  const { flavour, iotated = false } = options;
  const passes = (iotated ? IOTATED_PASSES : STANDARD_PASSES)[flavour];
  return passes.reduce((acc, pass) => pass(acc), word);
}
