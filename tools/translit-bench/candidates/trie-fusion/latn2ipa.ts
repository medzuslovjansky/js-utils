// noinspection NonAsciiCharacters,JSNonASCIINames

import { composePasses, type RawMap } from './fuse.ts';
import type { Flavour } from './flavorize.ts';

/**
 * v1 `toScript` for IPA (`type 10`). Takes a word already through
 * `resolveLiquids` + `flavorize` -- i.e. still on the etymological
 * alphabet, `%`-bounded, with any `#`/`ı` phase markers still in place.
 *
 * v1 has no flavour-conditional code anywhere in this branch: every
 * flavour difference is already baked into `word` by the preceding
 * `flavorize` phase, so `toScript(_, 10, flav)` produces the same output
 * for every `flav`. The parameter stays for API symmetry with the other
 * toScript ports (latn2latn, latn2cyrl, latn2glag2), which do branch on it.
 *
 * Each pass below is one flat longest-match map built from one or more of
 * v1's individual `replace()` calls; they stay as SEPARATE, ORDERED passes
 * (rather than one merged map) wherever a later pass genuinely needs to see
 * a character an earlier pass just produced -- createReplacer does not
 * rescan its own output, so that dependency has to be a pass boundary.
 * Passes that don't feed each other are merged into one map; longest-match
 * then reproduces v1's "digraph rule before its component letters" ordering
 * for free (the digraph key is longer, so it wins at the same position).
 */

/**
 * The one lexical exception in this branch: "nads" + e/ę is respelled to
 * "nac" + e/ę before anything else runs. Its output is still on the
 * etymological alphabet (a bare c, e or ę) -- the vowel pass and the
 * affricate pass below both need to see it, so this has to run first.
 */
const resolveNadsException: RawMap = {
  nadse: 'nace',
  nadsę: 'nacę',
};

/**
 * A soft consonant (ľ ń ř ť ď ś ź) followed by the "j after a soft
 * consonant" marker `ı` becomes the consonant plus a non-syllabic i̯ glide.
 * The consonant letter itself is left untouched here -- the palatalization
 * pass further down still turns it into its ʲ-marked IPA form.
 */
const markGlideAfterSoftConsonant: RawMap = {
  ľıj: 'ľi̯',
  ńıj: 'ńi̯',
  řıj: 'ři̯',
  ťıj: 'ťi̯',
  ďıj: 'ďi̯',
  śıj: 'śi̯',
  źıj: 'źi̯',
};

/**
 * Plain vowel and syllabic-liquid letters, unconditionally. `ě`, `ę` and
 * `ŕ` produce a fresh `ь` -- the sibilant-drop pass and the palatalization
 * pass both key off that, so this has to run before them. `ṙ` is the only
 * reachable half of v1's `[ŕṙ]` rule here: `ŕ` bare is fully consumed by
 * the `ŕ` -> `ьǝr` rule two lines above it in v1, so by the time v1's own
 * `[ŕṙ]` line runs there is no `ŕ` left for it to match -- dead code in
 * v1, reproduced by simply not giving `ŕ` a second (unreachable) entry
 * here rather than by adding an entry that would silently overwrite it.
 */
const vowelsAndSyllabicLiquids: RawMap = {
  e: 'ɛ',
  ė: 'ɜ',
  ě: 'ьɛ',
  ę: 'ьæ',
  ŕ: 'ьǝr',
  y: 'ɪ',
  å: 'ɒ',
  o: 'ɔ',
  ṙ: 'ər',
  ȯ: 'ə',
  '’': 'ə',
  ų: 'ʊ',
};

/**
 * A softness marker `ь` right after š/č/ž/j is orthographic, not phonemic
 * -- these consonants are already "soft" in IPA terms -- so it is dropped
 * outright rather than turned into a glide. Must run before the affricate
 * pass converts č to t͡ʃ (etc.): once that happens the literal `č` this
 * pass keys on is gone, and the marker would fall through to the generic
 * ь -> j rule instead, producing a spurious /j/.
 */
const dropSoftMarkerAfterSibilant: RawMap = {
  šь: 'š',
  čь: 'č',
  žь: 'ž',
  jь: 'j',
};

/**
 * Affricates, their fricative components, and h/x. Digraph rules (šć, dz,
 * dž, žđ) are listed alongside the single letters they overlap with --
 * longest-match always prefers the digraph at a shared starting position,
 * which is exactly the priority v1's separate, ordered replace() calls
 * give them. `h` -> `x` sits after `x` -> `ks` on purpose: v1 runs them as
 * two full-string passes, so the `x` this rule produces from `h` is never
 * fed back through the earlier `x` -> `ks` rule. Merging them into one map
 * reproduces that for free, since createReplacer never rescans its own
 * output either.
 */
const affricatesAndFricatives: RawMap = {
  c: 't͡s',
  č: 't͡ʃ',
  šć: 'ɕt͡ɕ',
  ć: 't͡ɕ',
  dz: 'd͡z',
  dž: 'd͡ʒ',
  žđ: 'ʑd͡ʑ',
  đ: 'd͡ʑ',
  x: 'ks',
  h: 'x',
  š: 'ʃ',
  ž: 'ʒ',
};

/**
 * Consonant palatalization, plus the two catch-alls that close the class:
 * any `ь` not already consumed by a digraph above becomes a plain glide
 * `j`, and any `l` not already turned into ʎ becomes dark ɫ. All of it is
 * one map for the same longest-match reason as the affricate pass -- e.g.
 * `sť`/`zď` must out-rank the plain `ť`/`ď` rules they overlap with, and
 * `tь`/`dь`/... must out-rank the bare `ь` -> `j` catch-all. This pass
 * must run after `vowelsAndSyllabicLiquids` (which is what plants most of
 * the `ь`s this pass consumes) and after `dropSoftMarkerAfterSibilant`
 * (which removes the ones that must NOT reach here).
 */
const palatalize: RawMap = {
  sť: 'sʲtʲ',
  zď: 'zʲdʲ',
  ť: 'tʲ',
  tь: 'tʲ',
  ď: 'dʲ',
  dь: 'dʲ',
  ś: 'sʲ',
  sь: 'sʲ',
  ź: 'zʲ',
  zь: 'zʲ',
  ř: 'rʲ',
  rь: 'rʲ',
  rj: 'rʲ',
  ń: 'ɲ',
  nь: 'ɲ',
  nj: 'ɲ',
  ľ: 'ʎ',
  lь: 'ʎ',
  lj: 'ʎ',
  ь: 'j',
  l: 'ɫ',
};

/**
 * Dark ɫ reverts to plain l before a front vowel/glide (i, the i̯ glide's
 * bare combining mark, or e). Necessarily a separate, later pass: its key
 * is the ɫ the palatalization pass above just produced, so it cannot be
 * merged into that pass without losing the very letter it matches on.
 * v1's class here is `[ii̯e]`, but inside a character class "i̯" is not a
 * two-codepoint unit -- it is the single codepoints i (twice, redundantly)
 * and the bare combining mark U+032F. That is reproduced here as this
 * pass's second entry: ɫ followed by the combining mark alone, not by "i̯"
 * as a string.
 */
const revertDarkLBeforeFrontVowel: RawMap = {
  ɫi: 'li',
  ɫ̯: 'l̯',
  ɫe: 'le',
};

/**
 * t͡s/d͡z re-palatalize before a following j. Needs the affricate pass's
 * output (t͡s, d͡z) already in place, so it has to run after it; ordered
 * last to match v1, though nothing later in this branch depends on it.
 */
const palatalizeAffricateBeforeGlide: RawMap = {
  t͡sj: 't͡sʲ',
  d͡zj: 'd͡zʲ',
};

// Shared toScript tail, run after every type branch (v1 lines 569-570):
// collapse a stray double j, and drop the leftover phase markers -- word
// boundary %, delimiter #, soft-consonant marker ı.
const FINAL_CLEANUP: RawMap = {
  jj: 'j',
  '#': '',
  ı: '',
  '%': '',
};

// Handed whole to `composePasses`, in v1's original order, rather than
// pre-merged by eye -- see the module comment for the ordering constraints
// each one is here to respect; the soundness test re-derives which of them
// can actually share a trie pass, including whether `FINAL_CLEANUP` (v1's
// own separate final call) can fold into the last one.
const PASSES = composePasses([
  resolveNadsException,
  markGlideAfterSoftConsonant,
  vowelsAndSyllabicLiquids,
  dropSoftMarkerAfterSibilant,
  affricatesAndFricatives,
  palatalize,
  revertDarkLBeforeFrontVowel,
  palatalizeAffricateBeforeGlide,
  FINAL_CLEANUP,
]);

/**
 * v1 `toScript` for IPA (`type 10`, every flavour -- see the module
 * comment above for why `flavour` is accepted but unused).
 */
export function latn2ipa(word: string, flavour: Flavour): string {
  void flavour;
  return PASSES.reduce((acc, pass) => pass(acc), word);
}
