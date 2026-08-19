// noinspection NonAsciiCharacters,JSNonASCIINames

import { createReplacer } from './createReplacer.ts';
import { composePasses, type RawMap } from './fuse.ts';
import type { Flavour } from './flavorize.ts';

export interface Latn2LatnOptions {
  flavour: Flavour;
  /** Which of v1's three Latin-branch `toScript` types to produce. */
  variant: 'latin' | 'ascii' | 'polish';
}

const VOWEL = /[aeiouyąęųåėȯèòěê]/;

/**
 * The unconditional half of v1's `jgedoe`: five soft consonants respelled as
 * plain consonant + `j`. Disjoint source letters, none of the five outputs
 * reintroduces another of the five sources, so -- unlike almost everything
 * else in this file -- order does not matter here and one pass covers it.
 */
const JGEDOE_PREFIX: RawMap = {
  ć: 'cj',
  đ: 'dzj',
  ľ: 'lj',
  ń: 'nj',
  ř: 'rj',
  ď: 'dj',
  ť: 'tj',
  ś: 'sj',
  ź: 'zj',
};

/**
 * v1's `jgedoe` scan: a `j` between two consonants becomes a hard mark (`Ь`,
 * later respelled per the following consonant), a `j` after a consonant and
 * before a vowel becomes a soft mark (`ь`), and a `j` next to a word
 * boundary (`%`), a delimiter (`#`), or another `j` is always left alone.
 * This depends on the vowel/consonant class of both neighbours, which a flat
 * longest-match map cannot express -- the one place in the Latin branch that
 * genuinely needs a scan instead of a replacer, and so the one place fusion
 * can never reach across: no table before or after it can be proven to
 * commute with a rule that isn't a table at all.
 */
function jgedoeScan(word: string): string {
  let result = '';
  for (let i = 0; i < word.length; i++) {
    const ch = word.charAt(i);
    if (ch !== 'j') {
      result += ch;
      continue;
    }
    const prev = word.charAt(i - 1);
    const next = word.charAt(i + 1);
    if (prev === '%' || prev === '#' || prev === 'j') {
      result += 'j';
    } else if (!VOWEL.test(prev) && VOWEL.test(next)) {
      result += 'ь';
    } else if (!VOWEL.test(prev) && !VOWEL.test(next)) {
      result += 'Ь';
    } else {
      result += 'j';
    }
  }
  return result;
}

const jgedoePrefix = createReplacer(JGEDOE_PREFIX);
function jgedoe(word: string): string {
  return jgedoeScan(jgedoePrefix(word));
}

/*
 * --- `type == 1`, Latin -------------------------------------------------
 * v1 branches this purely on flavour; there is no shared prefix between the
 * branches, so each is its own little pipeline below. Every branch's tail
 * is fed into `composePasses` together with `FINAL_CLEANUP` -- the pass
 * `latn2latn` used to apply separately, after every branch -- so the
 * soundness test gets a chance to fold it into the branch's own last pass
 * too, not just the passes within the branch.
 */

// Shared `toScript` tail, run after any type-specific branch: collapse a
// stray double `j` and drop the leftover phase markers -- word boundary
// `%`, delimiter `#`, soft-consonant marker `ı`.
const FINAL_CLEANUP: RawMap = { jj: 'j', '#': '', ı: '', '%': '' };

// Etymological ('2'): pass 1 is five disjoint single-letter swaps (none of
// the five outputs reintroduces a source letter another one of them wants).
// Pass 2 must run after, since it re-reads the `ŕ` that pass 1's `ř -> ŕ`
// just produced, on top of whatever `ŕ` was already there.
const ETYMOLOGICAL_LATN_BASE: RawMap = {
  ṙ: 'r',
  ř: 'ŕ',
  ľ: 'ĺ',
  ť: 't́',
  ď: 'd́',
};
const ETYMOLOGICAL_LATN_SIBILANT_R: RawMap = {
  čŕ: 'čr',
  šŕ: 'šr',
  žŕ: 'žr',
  jŕ: 'jr',
};
const etymologicalLatnPasses = composePasses([
  ETYMOLOGICAL_LATN_BASE,
  ETYMOLOGICAL_LATN_SIBILANT_R,
  FINAL_CLEANUP,
]);
const etymologicalLatn = (word: string) =>
  etymologicalLatnPasses.reduce((acc, pass) => pass(acc), word);

// Standard / slovianto / southern ('3', '4', 'J'): v1 gives all three the
// same two unconditional, disjoint swaps -- one pass.
const COMMON_LATN: RawMap = { ṙ: 'r', ŕ: 'r', ȯ: 'ă' };
const commonLatnPasses = composePasses([COMMON_LATN, FINAL_CLEANUP]);
const commonLatn = (word: string) =>
  commonLatnPasses.reduce((acc, pass) => pass(acc), word);

// Northern ('S'): the `ě -> ьe` pre-pass and `jgedoe`'s own prefix table are
// two ordinary tables in sequence ahead of `jgedoe`'s scan, so they go
// through the soundness test together; the scan is the hard boundary that
// splits the branch into two composed segments.
const NORTHERN_LATN_E_PRE: RawMap = { ě: 'ьe' };
const northernLatnPrefixPasses = composePasses([
  NORTHERN_LATN_E_PRE,
  JGEDOE_PREFIX,
]);
const northernLatnPrefix = (word: string) =>
  jgedoeScan(
    northernLatnPrefixPasses.reduce((acc, pass) => pass(acc), word),
  );

// `Ьıь -> i`, the sibilant/generic soft-mark rules, and the `h`/`Ь`-family
// respellings -- previously three hand-separated passes with a comment
// each explaining the ordering. Handed to `composePasses` instead of
// pre-merged by eye: the soundness test re-derives the same boundaries (or
// proves a merge the original author didn't take), which is the whole
// point of mechanizing this rather than trusting the old comments verbatim.
const NORTHERN_LATN_MARKER: RawMap = { Ьıь: 'i' };
const NORTHERN_LATN_SOFT: RawMap = {
  čь: 'či',
  šь: 'ši',
  žь: 'ži',
  jь: 'ji',
  ь: 'i',
};
const NORTHERN_LATN_FINAL: RawMap = {
  h: 'ch',
  lЬ: 'ľ',
  nЬ: 'ń',
  rЬ: 'ŕ',
  tЬ: 'ť',
  dЬ: 'ď',
  sЬ: 'ś',
  zЬ: 'ź',
  Ь: 'j',
};
const northernLatnTailPasses = composePasses([
  NORTHERN_LATN_MARKER,
  NORTHERN_LATN_SOFT,
  NORTHERN_LATN_FINAL,
  FINAL_CLEANUP,
]);
const northernLatn = (word: string) =>
  northernLatnTailPasses.reduce(
    (acc, pass) => pass(acc),
    northernLatnPrefix(word),
  );

// v1 has no `type == 1` branch for flavour '1' (extended Cyrillic notation
// doesn't apply to a Latin target) -- the word passes through untouched
// except for the shared cleanup tail.
const extendedLatnPasses = composePasses([FINAL_CLEANUP]);
const extendedLatn = (word: string) =>
  extendedLatnPasses.reduce((acc, pass) => pass(acc), word);

const LATIN_BY_FLAVOUR: Record<Flavour, (word: string) => string> = {
  '1': extendedLatn,
  '2': etymologicalLatn,
  '3': commonLatn,
  '4': commonLatn,
  S: northernLatn,
  J: commonLatn,
};

/*
 * --- `type == 2`, ASCII --------------------------------------------------
 * v1 has no flavour branching at all here: thirteen disjoint single-letter
 * swaps, none of whose outputs reintroduces any of the thirteen source
 * letters -- one pass, for every flavour, plus whatever of the shared
 * cleanup tail the soundness test can fold in.
 */
const ASCII_LATN: RawMap = {
  ṙ: 'r',
  ŕ: 'r',
  š: 'sz',
  ć: 'cz',
  č: 'cz',
  ž: 'zs',
  đ: 'dzs',
  ě: 'je',
  å: 'a',
  ę: 'e',
  ė: 'e',
  ȯ: 'o',
  ų: 'u',
};
const asciiLatnPasses = composePasses([ASCII_LATN, FINAL_CLEANUP]);
const asciiLatn = (word: string) =>
  asciiLatnPasses.reduce((acc, pass) => pass(acc), word);

/*
 * --- `type == 3`, Polish --------------------------------------------------
 * Also flavour-independent in v1. This is the densest branch: `ь`/`Ь` get
 * produced, consumed, and re-produced repeatedly, and a handful of two-
 * letter rules depend on an adjacency an *earlier* rule just created (e.g.
 * `ii -> i` then `iy -> i` can fire on what was originally `iiy`, because
 * v1 runs them as two separate passes over the whole word). Three lines in
 * v1 (`ti -> ti`, `di -> di`, `ci -> ci`) are literal identity replacements
 * and are omitted -- removing a no-op cannot change output.
 *
 * Every remaining line is still listed in v1's original order below, one
 * raw map per line; `composePasses` -- not manual inspection -- decides
 * which adjacent ones can share a single trie pass. Forty-five passes on
 * paper; however many the soundness test actually grants is a runtime
 * property of this table, reported via `fusionStats`, not a number to
 * hardcode here.
 */
const polishTail: RawMap[] = [
  { å: 'a', ė: 'e', ě: 'ьe', ȯ: 'o' },
  { ṙ: 'or', ŕ: 'er', ŭ: 'u', ṱ: '', ḓ: '', '’': '' },
  { lь: 'ĺ' },
  { lЬ: 'ĺ' },
  { li: 'ĺi' },
  { rzь: 'rz' },
  { ь: 'i' },
  { Ь: 'ь' },
  { ьý: 'ьí' },
  { ų: 'ą' },
  { š: 'sz' },
  { č: 'cz' },
  { rь: 'ŕ' },
  { ž: 'ż' },
  { v: 'w' },
  { h: 'ch' },
  { l: 'ł' },
  { ĺ: 'l' },
  { tь: 'ť' },
  // v1: `ti -> ti` (identity, omitted).
  { dь: 'ď' },
  // v1: `di -> di` (identity, omitted).
  { cь: 'ć' },
  // v1: `ci -> ci` (identity, omitted).
  { dzь: 'dź' },
  // v1: `dzi -> dzi` (identity, omitted).
  { sь: 'ś' },
  { zь: 'ź' },
  // A second `lь -> ĺ`, not a copy-paste bug: the `Ь -> ь` pass above
  // produces a fresh batch of `ь` that this specific-consonant group is
  // what consumes, so the same source pattern legitimately fires twice.
  { lь: 'ĺ' },
  { nь: 'ń' },
  { ь: 'j' },
  { ii: 'i' },
  { ji: 'i' },
  { iy: 'i' },
  { jy: 'i' },
  { ky: 'ki', gy: 'gi' },
  { ke: 'kie', ge: 'gie' },
  { jn: '#jn' },
  { js: '#js' },
  { cyj: 'cj' },
  { cyi: 'cji' },
  { lij: 'li' },
  { ya: 'ja' },
  { yą: 'ją' },
  { yu: 'ju' },
  { yo: 'jo' },
  { rzj: 'rj' },
  { '#': '' },
  FINAL_CLEANUP,
];
const polishTailPasses = composePasses(polishTail);
const polishLatn = (word: string) =>
  polishTailPasses.reduce((acc, pass) => pass(acc), jgedoe(word));

/**
 * v1 `toScript` for the Latin-alphabet targets (`type 1`, `2`, `3`). Takes a
 * word already through `resolveLiquids` + `flavorize` -- i.e. still on the
 * etymological alphabet, `%`-bounded, with any `#`/`ı` phase markers still
 * in place. The shared cleanup tail is now folded into each branch's own
 * composed pass list above rather than applied here as a separate final
 * call -- see the `FINAL_CLEANUP` uses above.
 */
export function latn2latn(word: string, options: Latn2LatnOptions): string {
  const { flavour, variant } = options;
  return variant === 'latin'
    ? LATIN_BY_FLAVOUR[flavour](word)
    : variant === 'ascii'
      ? asciiLatn(word)
      : polishLatn(word);
}
