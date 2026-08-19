# `latn2glag2` (= v1) vs. the existing `latn2glag`: where they disagree

`latn2glag2.ts` is a faithful port of v1's `toScript(word, 7, flavour)` (proved
byte-equivalent by `latn2glag2.test.ts`). `latn2glag.ts` is a pre-existing,
independently designed Glagolitic converter in this same directory -- it was
never meant to reproduce v1, and this file exists to state, in numbers and
rules, how far apart the two actually are. This is input to a maintainer
decision, not an argument for either side.

## Method

Word list: `tools/dump/__fixtures__/paradigms.tsv.gz`, column 3 (the word
form), lower-cased and deduplicated -- **195,378 distinct forms** (the raw count
prior to deduplication / lower-casing was 195,553; lower-casing merges a
small number of forms that differ only in case).

For each form and each of the 6 flavours `latn2glag2` handles, the word was
run through v1's real pre-`toScript` pipeline (`nmsifyLoose` -> `resolveLiquids`
-> `flavorize`) and then `latn2glag2`, and compared against `latn2glag(form)`
called with its own defaults (`latinateMyslite: false, shta: true`). Note that
**`latn2glag` has no flavour parameter at all** -- it always assumes something
close to the raw etymological spelling. That asymmetry matters for reading the
per-flavour table below.

## Headline numbers

| Flavour            | Mismatched forms  | Fraction |
| ------------------ | ----------------- | -------- |
| `1` (extended)     | 108,479 / 195,378 | 55.5%    |
| `2` (etymological) | 108,479 / 195,378 | 55.5%    |
| `3` (standard)     | 141,255 / 195,378 | 72.3%    |
| `4` (slovianto)    | 150,594 / 195,378 | 77.1%    |
| `S` (northern)     | 139,305 / 195,378 | 71.3%    |
| `J` (southern)     | 149,637 / 195,378 | 76.6%    |

Flavour `2` yields a 55.5% mismatch (44.5% match) against `isv-Glag-x-etymolog`.

Flavours `3`/`4`/`S`/`J` disagree more, but a large share of that gap is not a
genuine letter-choice disagreement -- it is `latn2glag2` correctly reflecting
what `flavorize` does for those flavours (flattening `ų`->`u`, `å`->`a`,
`ę`/`ė`->`e`, etc.) against an `latn2glag` that has no flavour concept and
never flattens anything. See "Flavour-flattening noise" below. Flavours `1`
and `2` are the fair, apples-to-apples comparison.

## Disagreements, reduced to rules (biggest class first)

Counts below are for flavour `2` (etymological), the fairest single-flavour
comparison; where a rule is flavour-independent the count is essentially the
same for flavour `1` too.

### 1. `m` -> ⱞ vs. ⰿ (73,402 forms, 37.6%)

v1 unconditionally maps `m` to the **Latinate Myslite** (ⱞ). `latn2glag`
defaults to the classic **Myslite** (ⰿ) and only switches to ⱞ if the caller
passes `latinateMyslite: true`.

> `"abhazskom"` -- v1: `ⰰⰱⱈⰰⰸⱏⱄⰽⱁⱞ` -- existing: `ⰰⰱⱈⰰⰸⱄⰽⱁⰿ`

### 2. `y` -> ⱐⰹ vs. ⱏⰹ (24,168 forms, 12.4%)

v1 spells `y` as **Yeri + Izhe** (ⱐⰹ). `latn2glag` spells it as
**Yeru + Izhe** (ⱏⰹ) -- two visually similar but distinct letters (ⱐ "yeri"
vs. ⱏ "yeru") swapped for the same sound.

> `"abhazsky"` -- v1: `ⰰⰱⱈⰰⰸⱏⱄⰽⱐⰹ` -- existing: `ⰰⰱⱈⰰⰸⱄⰽⱏⰹ`

### 3. `ja` ligature vs. decomposed `j` + `a` (~12,557 forms, 6.4%)

v1 always folds a `j`+`a` pair -- however it arose, whether from a plain `ja`,
a word-initial `ja`, or a softened-consonant-plus-`ja` cluster -- into the
single ligature letter **Trokutasti A** (ⱝ). `latn2glag`'s letter map has no
`ja` entry at all (unlike `ju`, `ję`, `jų`, `jo`, which it _does_ ligate), so
it falls through to spelling `j` and `a` separately, using whichever `j`
variant its position rules pick: Izhe (ⰹ) mid-word, Yeri (ⱐ) after a softened
consonant, or Initial Izhe (ⰺ) at a word/vowel boundary.

> `"azijatsky"` -- v1: `ⰰⰸⰻⱝⱅⱄⰽⱐⰹ` -- existing: `ⰰⰸⰻⰹⰰⱅⱄⰽⱏⰹ`
> (ⱝ vs. ⰹⰰ)
>
> `"bezposrědnja"` -- v1: `...ⰴⱀⱝ` -- existing: `...ⰴⱀⱐⰰ` (ⱝ vs. ⱐⰰ)

### 4. Syllabic `ŕ`: letter order swapped (~3,300 forms, 1.7%)

Both converters spell a syllabic soft `r` with the same two letters --
**Ritsi** (ⱃ, the `r` letter) and **Yeri** (ⱐ, the soft-sign letter) -- but in
opposite order. v1 writes Ritsi-then-Yeri (ⱃⱐ); `latn2glag` writes
Yeri-then-Ritsi (ⱐⱃ).

> `"cŕkȯvnoslovjansky"` -- v1: `ⱌⱃⱐⰽ...` -- existing: `ⱌⱐⱃⰽ...`

### 5. `ė` (mid vowel) -> ⰵ vs. ⱐ (~2,400 forms, 1.2%)

v1 treats `ė` as a full vowel, identical to plain `e` -- both map to
**Yestu** (ⰵ). `latn2glag`'s own map sends `ė` to **Yeri** (ⱐ), i.e. it
treats `ė` as if it were a soft-sign marker rather than a vowel.

> `"absolutėn"` -- v1: `...ⱅⰵⱀ` -- existing: `...ⱅⱐⱀ`

### 6. `nj`/`lj` immediately before a vowel: ligature vs. soft sign (~2,800 forms, 1.4%)

When a softened `n`/`l` cluster is directly followed by a vowel (e.g. the
"je" in `"basnjesloven"`), v1's ligature rules run first and fold the `j`
into the vowel ligature (`n` + Izhe + Yestu). Because `latn2glag`'s desoftener
converts `nj`/`lj` to `n`/`l` + Yeri _before_ the vowel-ligature step ever
runs, it spells the same cluster as `n` + Yeri + Yestu instead -- a soft-sign
reading rather than an iotation reading.

> `"basnjesloven"` -- v1: `...ⱀⰹⰵⱄ...` -- existing: `...ⱀⱐⰵⱄ...`

### 7. Spurious mid-word Yeru from a nmsify delimiter (~2,400-2,700 forms, ~1.2-1.4%)

`nmsifyLoose` inserts a `#` word-internal delimiter into certain consonant
clusters (`zsk` -> `z#sk`, `zst` -> `z#st`, and a handful of named prefixes)
purely to keep later rules from misreading the cluster. That `#` survives,
unconsumed, all the way to v1's `toScript`, where it is spelled out as a
literal **Yeru** (ⱏ) with no phonetic basis. `latn2glag`'s own normalization
(`normalize.ts`) does not insert an equivalent marker, so it has no spurious
letter there. This is a genuine v1 artifact, reproduced in `latn2glag2`
to remain an exact 1:1 match of v1.

> `"abhazsky"` (contains `zsk`) -- v1: `ⰰⰱⱈⰰⰸⱏⱄⰽⱐⰹ` -- existing:
> `ⰰⰱⱈⰰⰸⱄⰽⱏⰹ` (note the extra ⱏ right after ⰸ in v1's output)

## Flavour-flattening noise (flavours `3`, `4`, `S`, `J` only)

Because `latn2glag` never flavorizes its input, comparing it against
`latn2glag2` for a flattening flavour surfaces the flattening itself as
"disagreement," on top of the seven rules above:

- `ų` -> `u` (standard/slovianto): ⱆ (Uku) vs. ⱘ (Big Yus) -- ~18,000 forms per flavour
- `å` -> `a` (standard/slovianto/southern): ⰰ (Azu) vs. ⱉ (Otu) -- ~14,000 forms per flavour
- `ę`/`ė` -> `e` (standard/slovianto/southern): ⰵ (Yestu) vs. ⱔ (Small Yus) -- ~6,600-7,000 forms per flavour
- `ě` -> `ьe`/other spellings (slovianto/southern via `y`-merger and related steps): visible as the `ⰻ`/`ⰹ` <-> `ⱏⰹ` class in flavours `4`/`J`

None of these are a Glagolitic letter-choice disagreement between the two
converters -- both would spell `ų` as ⱘ given the same (unflattened) input.
They are listed for completeness, not counted into the seven rules above.

## Summary

`latn2glag2` (= v1) and `latn2glag` disagree on a majority of forms, and the
disagreement is systematic, not noisy: two single-letter substitutions
(`m`->ⱞ/ⰿ, `y`->ⱐⰹ/ⱏⰹ) already account for half of every mismatch, and seven
named rules account for nearly all of the rest once flavour-flattening noise
is set aside. The pattern across all seven rules is consistent: v1 leans on
Glagolitic's precomposed ligature/iotated letters (ⱝ, ⱞ, ⱐⰹ, ⱃⱐ) wherever one
exists, while `latn2glag` favours decomposed, position-sensitive spellings
(separate `j` + vowel, Yeri-as-softener) -- a real design difference, not a
bug in either direction, which is why this is left as input to a maintainer
decision rather than resolved here.
