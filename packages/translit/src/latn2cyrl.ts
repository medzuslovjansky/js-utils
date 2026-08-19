// noinspection NonAsciiCharacters,JSNonASCIINames

import { createReplacer } from './createReplacer.ts';
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
const core = createReplacer({
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
});

/**
 * v1 branches the letters `core` just produced on `flav == '1'` vs
 * everything else -- not a delta, a genuine fork: extended notation keeps
 * ṙ/ŕ as their own two-letter spellings (ър/ьр) and leaves `ė` alone for
 * the iotated pass to pick up later; every other flavour collapses ṙ/ŕ to
 * plain р and consumes `ė` right here.
 */
const EXTENDED_SYLLABIC_R = createReplacer({ ṙ: 'ър', ŕ: 'ьр' });

/**
 * Flavour deltas on the letters `core` just produced, on top of the
 * ṙ/ŕ/ė resolution every non-extended flavour shares: southern re-merges
 * the `ě` letter into plain е and re-forms the lj/nj digraphs it had just
 * split at a word boundary; etymological keeps the old "ѣ" spelling users
 * asked for.
 */
const FLAVOUR_DELTA: Record<Exclude<Flavour, '1'>, Record<string, string>> = {
  '2': { є: 'ѣ' },
  '3': {},
  '4': {},
  S: {},
  J: { є: 'е', 'л#ј': 'љ', 'н#ј': 'њ' },
};

const STANDARD_NOTATION: Record<Flavour, (word: string) => string> = {
  '1': EXTENDED_SYLLABIC_R,
  ...Object.fromEntries(
    (Object.keys(FLAVOUR_DELTA) as Exclude<Flavour, '1'>[]).map((flavour) => [
      flavour,
      createReplacer({ ṙ: 'р', ŕ: 'р', ė: 'е', ...FLAVOUR_DELTA[flavour] }),
    ]),
  ),
} as Record<Flavour, (word: string) => string>;

/*
 * Traditional iotated notation ("type 6"): re-spells the standard letters
 * into their older forms. Each step below is still a flat longest-match
 * map, but they stay separate, ordered passes -- a later one routinely
 * reads letters (ѣ, й, ь) that an earlier one just produced, so folding
 * them into one map would change what matches.
 */

const unmergeDigraphs = createReplacer({ љ: 'ль', њ: 'нь', ê: 'ѣ', є: 'ѣ' });

const iotateVowels = createReplacer({
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
});

// v1 re-runs the syllabic-liquid resolution here too. For the five
// non-extended flavours ė/ȯ/ṙ/ŕ are already gone by this point (consumed
// above), so this pass is a no-op for them -- but for extended notation
// (flav '1'), `ė` was deliberately left untouched above, and this is where
// it finally gets consumed. ȯ/ṙ/ŕ stay dead code for every flavour (ȯ is
// gone by the shared `core` pass; ṙ/ŕ are gone by `EXTENDED_SYLLABIC_R` for
// '1' specifically) -- kept for source fidelity, not pruned on an
// unverified "it can't happen" claim (that claim was wrong once already:
// see the flav '1' handling this pass exists for).
const resolveLiquidsAgain = createReplacer({
  ė: 'ь',
  ȯ: 'ъ',
  ṙ: 'ър',
  ŕ: 'ьр',
});

const collapseSoftSign = createReplacer({ ьь: 'ь' });

const eBeforeE = createReplacer({
  '#е': '#э',
  '%е': '%э',
  ае: 'аэ',
  ее: 'еэ',
  єе: 'єэ',
  ие: 'иэ',
  ое: 'оэ',
  уе: 'уэ',
  ые: 'ыэ',
});

// Drops a `й` that sits right after a boundary marker or after a vowel
// (softening is implied there); everywhere else, before е/и, it becomes a
// soft sign instead. These stay THREE separate passes, in this order,
// because dropping a `й` can pull characters together that then feed the
// next rule -- e.g. "%йейе" first drops the boundary-adjacent `й`
// ("%е" + "йе"), which brings а freed "е" right up against the next "йе",
// which the vowel-context rule only now gets to see. A single merged pass
// would miss that.
const dropJiAtBoundary = createReplacer({
  '#йе': '#е',
  '#йи': '#и',
  '%йе': '%е',
  '%йи': '%и',
});

const dropJiAfterVowel = createReplacer({
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
});

const softenRemainingJi = createReplacer({ йе: 'ье', йи: 'ьи' });

const yatToE = createReplacer({ ѣ: 'е' });
const collapseSoftMarker = createReplacer({ ьıь: 'ь' });
const hashToApostrophe = createReplacer({ '#': '’' });

// Unconditional prefix, shared by every flavour.
const IOTATED_PREFIX = [
  unmergeDigraphs,
  iotateVowels,
  resolveLiquidsAgain,
  collapseSoftSign,
];

// Extended notation (flav '1') ligates a leftover й/ь before е/и into a
// single letter (ѥ/ӥ) instead of the drop-or-soften handling every other
// flavour gets, and additionally merges ш+ч/ћ into щ.
const extendedLigatures = createReplacer({
  йе: 'ѥ',
  ье: 'ѥ',
  йи: 'ӥ',
  ьи: 'ӥ',
  шч: 'щ',
  шћ: 'щ',
});

// Every other flavour: drop or soften a leftover `й` before е/и (order
// matters -- see the comment on `dropJiAtBoundary`), then flatten ѣ/ьıь.
const STANDARD_LIGATURES = [
  eBeforeE,
  dropJiAtBoundary,
  dropJiAfterVowel,
  softenRemainingJi,
  yatToE,
  collapseSoftMarker,
];

function iotate(word: string, flavour: Flavour): string {
  const prefixed = IOTATED_PREFIX.reduce((acc, pass) => pass(acc), word);
  const ligated =
    flavour === '1'
      ? extendedLigatures(prefixed)
      : STANDARD_LIGATURES.reduce((acc, pass) => pass(acc), prefixed);
  return hashToApostrophe(ligated);
}

// Shared toScript tail, run after any script-specific branch: collapse a
// stray double `j` and drop the leftover phase markers -- word boundary
// `%`, delimiter `#`, soft-consonant marker `ı`.
const finalCleanup = createReplacer({ jj: 'j', '#': '', ı: '', '%': '' });

/**
 * v1 `toScript` for Cyrillic (`type 5`, or `type 6` with `iotated: true`).
 * Takes a word already through `resolveLiquids` + `flavorize` -- i.e. still
 * on the etymological alphabet, `%`-bounded, with any `#`/`ı` phase markers
 * still in place.
 */
export function latn2cyrl(word: string, options: Latn2CyrlOptions): string {
  const { flavour, iotated = false } = options;
  let result = STANDARD_NOTATION[flavour](core(word));
  if (iotated) {
    result = iotate(result, flavour);
  }
  return finalCleanup(result);
}
