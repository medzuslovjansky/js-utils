// noinspection NonAsciiCharacters,JSNonASCIINames

import { createReplacer } from './createReplacer.ts';
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
const jgedoePrefix = createReplacer({
  ć: 'cj',
  đ: 'dzj',
  ľ: 'lj',
  ń: 'nj',
  ř: 'rj',
  ď: 'dj',
  ť: 'tj',
  ś: 'sj',
  ź: 'zj',
});

/**
 * v1's `jgedoe` scan: a `j` between two consonants becomes a hard mark (`Ь`,
 * later respelled per the following consonant), a `j` after a consonant and
 * before a vowel becomes a soft mark (`ь`), and a `j` next to a word
 * boundary (`%`), a delimiter (`#`), or another `j` is always left alone.
 * This depends on the vowel/consonant class of both neighbours, which a flat
 * longest-match map cannot express -- the one place in the Latin branch that
 * genuinely needs a scan instead of a replacer.
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

function jgedoe(word: string): string {
  return jgedoeScan(jgedoePrefix(word));
}

/*
 * --- `type == 1`, Latin -------------------------------------------------
 * v1 branches this purely on flavour; there is no shared prefix between the
 * branches, so each is its own little pipeline below.
 */

// Etymological ('2'): pass 1 is five disjoint single-letter swaps (none of
// the five outputs reintroduces a source letter another one of them wants).
// Pass 2 must run after, since it re-reads the `ŕ` that pass 1's `ř -> ŕ`
// just produced, on top of whatever `ŕ` was already there.
const etymologicalLatnBase = createReplacer({
  ṙ: 'r',
  ř: 'ŕ',
  ľ: 'ĺ',
  ť: 't́',
  ď: 'd́',
});
const etymologicalLatnSibilantR = createReplacer({
  čŕ: 'čr',
  šŕ: 'šr',
  žŕ: 'žr',
  jŕ: 'jr',
});
const etymologicalLatn = (word: string) =>
  etymologicalLatnSibilantR(etymologicalLatnBase(word));

// Standard / slovianto / southern ('3', '4', 'J'): v1 gives all three the
// same two unconditional, disjoint swaps -- one pass.
const commonLatn = createReplacer({ ṙ: 'r', ŕ: 'r', ȯ: 'ă' });

// Northern ('S'): five ordered steps.
// 1) `ě -> ьe` on its own, ahead of `jgedoe`, exactly where v1 puts it.
// 2) `jgedoe` -- see above.
// 3) `Ьıь -> i` must run alone, before step 4: step 4's generic `ь -> i`
//    would otherwise consume the trailing `ь` of this very pattern first
//    (since a later pass never re-reads what an earlier one produced), and
//    the three-character pattern would never get a chance to match.
// 4) The sibilant-conditioned `[čšžj]ь -> $1i` plus the generic `ь -> i`
//    merge into one pass: longest-match already prefers the two-character
//    keys over the plain `ь` at the same position, which is exactly the
//    precedence v1's two separate `.replace` calls give.
// 5) `h -> ch` plus the seven consonant+`Ь` respellings plus the generic
//    `Ь -> j` merge the same way -- `h` shares no letters with the `Ь`
//    family, and longest-match again reproduces "specific consonant first,
//    generic catch-all last".
const northernLatnEPre = createReplacer({ ě: 'ьe' });
const northernLatnMarker = createReplacer({ Ьıь: 'i' });
const northernLatnSoft = createReplacer({
  čь: 'či',
  šь: 'ši',
  žь: 'ži',
  jь: 'ji',
  ь: 'i',
});
const northernLatnFinal = createReplacer({
  h: 'ch',
  lЬ: 'ľ',
  nЬ: 'ń',
  rЬ: 'ŕ',
  tЬ: 'ť',
  dЬ: 'ď',
  sЬ: 'ś',
  zЬ: 'ź',
  Ь: 'j',
});
const northernLatn = (word: string) =>
  northernLatnFinal(
    northernLatnSoft(northernLatnMarker(jgedoe(northernLatnEPre(word)))),
  );

// No BCP 47 tag pairs flavour '1' (extended Cyrillic notation) with a Latin
// target, so only these three branches are reachable.
function latinByFlavour(word: string, flavour: Flavour): string {
  switch (flavour) {
    case '2':
      return etymologicalLatn(word);
    case 'S':
      return northernLatn(word);
    default:
      return commonLatn(word);
  }
}

/*
 * --- `type == 2`, ASCII --------------------------------------------------
 * v1 has no flavour branching at all here: thirteen disjoint single-letter
 * swaps, none of whose outputs reintroduces any of the thirteen source
 * letters -- one pass, for every flavour.
 */
const asciiLatn = createReplacer({
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
});

/*
 * --- `type == 3`, Polish --------------------------------------------------
 * Also flavour-independent in v1. This is the densest branch: `ь`/`Ь` get
 * produced, consumed, and re-produced repeatedly, and a handful of two-
 * letter rules depend on an adjacency an *earlier* rule just created (e.g.
 * `ii -> i` then `iy -> i` can fire on what was originally `iiy`, because
 * v1 runs them as two separate passes over the whole word). `createReplacer`
 * does not re-scan its own output, so each of v1's `.replace` lines below
 * stays its own pass; only lines that are (a) already one v1 line via a
 * regex character class/alternation, or (b) provably independent
 * single-letter swaps with no shared letters at all, are combined. Three
 * lines in v1 (`ti -> ti`, `di -> di`, `ci -> ci`) are literal identity
 * replacements and are omitted -- removing a no-op cannot change output.
 */
const polishPasses: Array<(word: string) => string> = [
  jgedoe,
  // Four disjoint single-letter swaps -- safe as one pass (see the
  // etymological/ASCII passes above for why single-letter swaps with no
  // shared letters never need to be separated).
  createReplacer({ å: 'a', ė: 'e', ě: 'ьe', ȯ: 'o' }),
  createReplacer({ ṙ: 'or', ŕ: 'er', ŭ: 'u', ṱ: '', ḓ: '', '’': '' }),
  createReplacer({ lь: 'ĺ' }),
  createReplacer({ lЬ: 'ĺ' }),
  createReplacer({ li: 'ĺi' }),
  createReplacer({ rzь: 'rz' }),
  createReplacer({ ь: 'i' }),
  createReplacer({ Ь: 'ь' }),
  createReplacer({ ьý: 'ьí' }),
  createReplacer({ ų: 'ą' }),
  createReplacer({ š: 'sz' }),
  createReplacer({ č: 'cz' }),
  createReplacer({ rь: 'ŕ' }),
  createReplacer({ ž: 'ż' }),
  createReplacer({ v: 'w' }),
  createReplacer({ h: 'ch' }),
  createReplacer({ l: 'ł' }),
  createReplacer({ ĺ: 'l' }),
  createReplacer({ tь: 'ť' }),
  // v1: `ti -> ti` (identity, omitted).
  createReplacer({ dь: 'ď' }),
  // v1: `di -> di` (identity, omitted).
  createReplacer({ cь: 'ć' }),
  // v1: `ci -> ci` (identity, omitted).
  createReplacer({ dzь: 'dź' }),
  // v1: `dzi -> dzi` (identity, omitted).
  createReplacer({ sь: 'ś' }),
  createReplacer({ zь: 'ź' }),
  // A second `lь -> ĺ`, not a copy-paste bug: the `Ь -> ь` pass above
  // produces a fresh batch of `ь` that this specific-consonant group is
  // what consumes, so the same source pattern legitimately fires twice.
  createReplacer({ lь: 'ĺ' }),
  createReplacer({ nь: 'ń' }),
  createReplacer({ ь: 'j' }),
  createReplacer({ ii: 'i' }),
  createReplacer({ ji: 'i' }),
  createReplacer({ iy: 'i' }),
  createReplacer({ jy: 'i' }),
  createReplacer({ ky: 'ki', gy: 'gi' }),
  createReplacer({ ke: 'kie', ge: 'gie' }),
  createReplacer({ jn: '#jn' }),
  createReplacer({ js: '#js' }),
  createReplacer({ cyj: 'cj' }),
  createReplacer({ cyi: 'cji' }),
  createReplacer({ lij: 'li' }),
  createReplacer({ ya: 'ja' }),
  createReplacer({ yą: 'ją' }),
  createReplacer({ yu: 'ju' }),
  createReplacer({ yo: 'jo' }),
  createReplacer({ rzj: 'rj' }),
  createReplacer({ '#': '' }),
];
const polishLatn = (word: string) =>
  polishPasses.reduce((acc, pass) => pass(acc), word);

// Shared `toScript` tail, run after any type-specific branch: collapse a
// stray double `j` and drop the leftover phase markers -- word boundary
// `%`, delimiter `#`, soft-consonant marker `ı`. `jj -> j` and the marker
// removal merge into one pass in v1 too (they're two separate `.replace`
// calls, but neither's source/output touches the other's letters).
const finalCleanup = createReplacer({ jj: 'j', '#': '', ı: '', '%': '' });

/**
 * v1 `toScript` for the Latin-alphabet targets (`type 1`, `2`, `3`). Takes a
 * word already through `resolveLiquids` + `flavorize` -- i.e. still on the
 * etymological alphabet, `%`-bounded, with any `#`/`ı` phase markers still
 * in place.
 */
export function latn2latn(word: string, options: Latn2LatnOptions): string {
  const { flavour, variant } = options;
  const result =
    variant === 'latin'
      ? latinByFlavour(word, flavour)
      : variant === 'ascii'
        ? asciiLatn(word)
        : polishLatn(word);
  return finalCleanup(result);
}
