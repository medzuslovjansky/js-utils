// OUT OF SERVICE — the old engine's Glagolitic, kept commented out.
//
// A faithful port of the pre-v4 engine's `toScript(word, 7, flavour)`, proved
// byte-equivalent to it over every letter pair of the alphabet and every
// flavour. Nothing imports it: `transliterate.ts` sends Glagolitic to
// `latn2glag.ts` instead, which spells seven things differently — see
// GLAGOLITIC-DIFF.md for all seven, with counts over the lexicon.
//
// Commented out rather than deleted because that decision is provisional. Two
// of the seven still favour this file: syllabic `ŕ` as `ⱃⱐ` — consonant then
// jer, the way Old Church Slavonic wrote a syllabic liquid — and `ju` as the
// dedicated letter `ⱓ`, where the other converter's desoftening step gets
// there first and decomposes it. If either comes back, it comes back from here.
//
// The yeru fix is already applied below, so the archived copy is the corrected
// one, not the one that printed a delimiter as a letter.
//
// To restore: strip the leading `// ` from the block below, then in
// `transliterate.ts` swap the `glagolitic` case back to
// `latn2glag2(word, flavour)` and drop the marker-stripping.

// // noinspection NonAsciiCharacters,JSNonASCIINames
//
// import { createReplacer } from './createReplacer.ts';
// import { Glagolitic as G } from '../constants/index.ts';
// import type { Flavour } from './flavorize.ts';
//
// /**
//  * v1 `toScript` for Glagolitic (`type == 7`), the Rafail Gasparyan mapping.
//  * A from-scratch port of the `type == 7` branch in
//  * `../transliterate/transliterate.ts` -- unrelated to the pre-existing
//  * `latn2glag.ts` in this directory, which is an independently designed
//  * converter that disagrees with v1 on more than half of real words (see
//  * `GLAGOLITIC-DIFF.md`). This file exists solely to reproduce v1 exactly.
//  *
//  * Takes a word already through `resolveLiquids` + `flavorize` -- i.e. still
//  * on the etymological alphabet, `%`-bounded, with any `#`/`ı` phase markers
//  * still in place.
//  */
//
// /**
//  * Strip the soft-consonant marker `ı` (its job -- keeping a softened
//  * consonant and a following `j` apart during earlier phases -- is done),
//  * and resolve the two syllabic-r spellings down to one: `ṙ` (non-palatal)
//  * always becomes plain `r`, `ř` (palatal) becomes `ŕ` so every later rule
//  * only has to know one spelling of the palatal one.
//  */
// const resolveR = createReplacer({ ı: '', ṙ: 'r', ř: 'ŕ' });
//
// /**
//  * `ŕ` right after a sibilant or `j` loses its softness mark (the softness
//  * was already implied by the preceding consonant). Needs `resolveR`'s
//  * output -- a word can reach here with `ŕ` either written that way to begin
//  * with, or freshly produced from `ř` a moment ago -- so this has to be its
//  * own pass, run after.
//  */
// const desoftenAfterSibilant = createReplacer({
//   čŕ: 'čr',
//   šŕ: 'šr',
//   žŕ: 'žr',
//   jŕ: 'jr',
// });
//
// /**
//  * v1's only flavour-conditional step in the whole Glagolitic branch:
//  * standard and slovianto flatten any remaining `ŕ` to plain `r`; southern
//  * does the same and additionally re-flattens `ȯ` and `ě` (redundant with
//  * what `flavorize` already did for southern -- but that is what v1 writes,
//  * so that is what this reproduces). Must run before `softenConsonant`
//  * below: for these three flavours it has to consume `ŕ` before the
//  * softening table would otherwise turn it into `rь`.
//  */
// const FLAVOUR_R_COLLAPSE: Record<Flavour, (word: string) => string> = {
//   '1': createReplacer({}),
//   '2': createReplacer({}),
//   '3': createReplacer({ ŕ: 'r' }),
//   '4': createReplacer({ ŕ: 'r' }),
//   S: createReplacer({}),
//   J: createReplacer({ ŕ: 'r', ȯ: 'o', ě: 'e' }),
// };
//
// /**
//  * Every etymological soft consonant spells out as plain-consonant + `ь`
//  * before going further -- the iotation table below reads that `ь`.
//  */
// const softenConsonant = createReplacer({
//   ń: 'nь',
//   ľ: 'lь',
//   ŕ: 'rь',
//   ť: 'tь',
//   ď: 'dь',
//   ś: 'sь',
//   ź: 'zь',
// });
//
// /** Build `{consonant+suffix: consonant+value}` for every consonant in `consonants`. */
// function perConsonant(
//   consonants: string,
//   table: Record<string, string>,
// ): Record<string, string> {
//   const out: Record<string, string> = {};
//   for (const c of consonants) {
//     for (const [suffix, value] of Object.entries(table)) {
//       out[c + suffix] = c + value;
//     }
//   }
//   return out;
// }
//
// /** Build `{vowel+suffix: vowel+value}` for every vowel in `vowels`, one fixed suffix/value. */
// function perVowel(
//   vowels: string,
//   suffix: string,
//   value: string,
// ): Record<string, string> {
//   const out: Record<string, string> = {};
//   for (const v of vowels) {
//     out[v + suffix] = v + value;
//   }
//   return out;
// }
//
// /**
//  * A softened `dzrstln` (or, for the yus pair, `ln`) consonant followed by a
//  * vowel-ish tail picks one of a dozen combined Glagolitic letters (`ьju` ->
//  * "yeri+yu", etc.) -- depends on `softenConsonant`'s `ь` having already
//  * been produced, so this table has to run after it.
//  */
// const consonantVowel = createReplacer({
//   ...perConsonant('ln', {
//     ьę: G.Iotated_Small_Yus,
//     ьų: G.Iotated_Big_Yus,
//   }),
//   ...perConsonant('dzrstln', {
//     ьu: G.Yu,
//     ьa: G.Trokutasti_A,
//     ьje: G.Yeri + G.Yestu,
//     ьję: G.Iotated_Small_Yus,
//     ьji: G.Izhe + G.I,
//     ьju: G.Yeri + G.Yu,
//     ьjų: G.Iotated_Big_Yus,
//     ьja: G.Yeri + G.Trokutasti_A,
//     ьjo: G.Yo,
//   }),
// });
//
// /**
//  * `jo` right after a vowel (or the word boundary `%`) becomes two separate
//  * letters ("izhe+onu") instead of the `jo` ligature every other `jo` gets.
//  * Must be its own pass, run strictly before `ligature` below: v1 runs this
//  * regex call first, over text where a following `ja`/`ju`/`ję`/... pair has
//  * not been collapsed into a single Glagolitic letter yet, so its vowel is
//  * still there, literally, for THIS rule to see and claim. Merging this pass
//  * with `ligature` breaks exactly that: for input `jajo`, `ligature`'s own
//  * `ja` key would -- scanning left to right -- greedily claim the leading
//  * `ja` at the word's first position before the scan ever reaches the `a`
//  * this rule needs to start from, producing the wrong two-letter split.
//  * Keeping the passes separate lets this one run over the untouched `a`
//  * first, exactly as v1 does.
//  */
// const vowelJoContext = createReplacer(
//   perVowel('%aeėioȯuyąęųåěê', 'jo', G.Izhe + G.Onu),
// );
//
// /** Every other `j`+vowel pair becomes its own ligature letter. */
// const ligature = createReplacer({
//   je: G.Izhe + G.Yestu,
//   ję: G.Iotated_Small_Yus,
//   ji: G.Izhe + G.I,
//   ju: G.Yu,
//   jų: G.Iotated_Big_Yus,
//   ja: G.Trokutasti_A,
//   jo: G.Yo,
// });
//
// const iotate = (word: string) => ligature(vowelJoContext(consonantVowel(word)));
//
// /**
//  * `lj`/`nj` and `šč`/`šć` only survive as literal digraphs when no vowel
//  * ligature already claimed the `j` -- a word-final "kralj" cluster, not
//  * "kralja". Must run after `iotate`: that pass, reproducing v1's earlier
//  * regex calls, already consumes any `j` that has a vowel after it (v1
//  * runs its `ja`/`je`/... calls before its `lj`/`nj` calls, so by the time
//  * `lj`/`nj` would run in v1, a `j` followed by a vowel is long gone) --
//  * and must run before the base letter map below, which would otherwise
//  * split `l`/`n`/`š`/`č`/`ć` individually instead of as a digraph.
//  */
// const digraph = createReplacer({
//   lj: G.Ljudije + G.Yeri,
//   nj: G.Nashi + G.Yeri,
//   šč: G.Shta,
//   šć: G.Shta,
// });
//
// /**
//  * The base etymological-letter-to-Glagolitic table, plus the three markers
//  * that only make it this far when nothing upstream claimed them: a soft
//  * consonant marker `ь` not followed by a vowel (e.g. word-final), the
//  * boundary-turned-hard-sign markers `’`/`#`, and a literal backtick (only
//  * reachable when the caller bypasses `nmsifyLoose`'s own backtick handling,
//  * e.g. via `nmsifyStrict` -- unreachable through the normal pipeline, kept
//  * for fidelity with v1's own dead-but-present rule).
//  *
//  * v1 writes `dž` as its own two-step rule (`d` -> Dobro, then
//  * `dž` -> Dobro+Zhivete), but the first step already consumes every `d`,
//  * including ones before `ž` -- so the second step can never fire. The
//  * result is identical either way, since `ž` gets converted on its own right
//  * after, so that dead rule is omitted here rather than reproduced as dead
//  * code.
//  */
// const baseLetter = createReplacer({
//   a: G.Azu,
//   å: G.Otu,
//   b: G.Buky,
//   c: G.Tsi,
//   ć: G.Shta,
//   č: G.Chrivi,
//   d: G.Dobro,
//   ḓ: G.Dobro,
//   đ: G.Djervi,
//   e: G.Yestu,
//   ė: G.Yestu,
//   ę: G.Small_Yus,
//   ê: G.Yati,
//   ě: G.Yati,
//   f: G.Fritu,
//   g: G.Glagoli,
//   h: G.Heru,
//   i: G.I,
//   j: G.Izhe,
//   k: G.Kako,
//   l: G.Ljudije,
//   m: G.Latinate_Myslite,
//   n: G.Nashi,
//   o: G.Onu,
//   ȯ: G.Yeru,
//   p: G.Pokoji,
//   r: G.Ritsi,
//   ṙ: G.Ritsi,
//   s: G.Slovo,
//   š: G.Sha,
//   t: G.Tvrido,
//   ṱ: G.Tvrido,
//   u: G.Uku,
//   ų: G.Big_Yus,
//   v: G.Vedi,
//   ŭ: G.Vedi,
//   y: G.Yeri + G.Izhe,
//   z: G.Zemlja,
//   ž: G.Zhivete,
//   ь: G.Yeri,
//   '’': G.Yeru,
//   '`': '’',
//   // No `#` here on purpose: it is the word-internal delimiter `resolveLiquids`
//   // inserts, and it is spent by the time letters are chosen. The original
//   // engine spelled it out as a Yeru — a letter with no sound behind it, in the
//   // middle of 3 093 words — where Latin, Cyrillic and IPA all dropped it.
// });
//
// /**
//  * Shared `toScript` tail: collapse a stray double `j` (dead for this
//  * branch -- every latin `j` is consumed above -- but kept for fidelity,
//  * since v1 runs it unconditionally after every script) and drop the
//  * leftover phase markers: word boundary `%`, delimiter `#`, soft-consonant
//  * marker `ı`. `#`/`ı` are already gone by construction here; `%` is the one
//  * this pass actually removes.
//  */
// const finalCleanup = createReplacer({ jj: 'j', '#': '', ı: '', '%': '' });
//
// /**
//  * v1 `toScript` for `type == 7` (Glagolitic), for every flavour it handles.
//  */
// export function latn2glag2(word: string, flavour: Flavour): string {
//   const resolved = desoftenAfterSibilant(resolveR(word));
//   const collapsed = FLAVOUR_R_COLLAPSE[flavour](resolved);
//   const softened = softenConsonant(collapsed);
//   const iotated = digraph(iotate(softened));
//   return finalCleanup(baseLetter(iotated));
// }
//
