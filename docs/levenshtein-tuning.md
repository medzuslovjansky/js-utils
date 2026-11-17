# Levenshtein: tuning notes

Open issues, adopted and rejected normalizations in `@interslavic/levenshtein`, with the
bench numbers that decided them.

## Bench

The numbers below come from a scoring bench that is not part of this repository. It scored
the package against three tiers of cognate data:

- **Gold: IE-CoR.** Expert cognate sets between national languages.
  Within a concept, cross-language pairs from the same set are positives and pairs from
  different sets are negatives. Loan sets are never positives; doubt/loan forms are dropped.
  Cyrillic languages use the native-script form (skipped when absent); `sh` is scored as `hr`
  (IE-CoR has no Cyrillic `sh`, so the `sr` column stays empty). Reported: ROC-AUC, best
  accuracy, and an AUC matrix per language pair. Gold does not involve ISV at all, so it
  only sees the national pipelines and the shared weights.
- **Silver: Wiktionary.** A Proto-Slavic descendant tree joined to an
  ISV lemma (etymological spelling). Distance is ISV vs the closest untagged `wikt` form.
  Reported: mean/median d, share above LOW (0.35) and HIGH (0.65), and AUC against a
  same-POS random row (fixed seed). The 15 worst pairs per language are printed. Most of
  them are bad joins (the ISV row and the Proto-Slavic tree differ in meaning: `iglasty lěs` /
  `бор`), not normalization gaps. To find gaps, aggregate alignment operations over pairs
  with d < 0.7 instead (`distance(..., { details: true })`).
- **Bronze: words.csv.** Translation tokens and `+ ~ -` intelligibility
  ratings. **Noisy** (machine + human, loose interpretations). Use it only for aggregates
  (AUC + vs -, mean d per class). Never derive a fixture or a rule from a single bronze row.

Two limits of the metrics:

- Silver mean d drops whenever any substitution gets cheaper, so it cannot decide a change
  on its own. Gold AUC and silver AUC measure discrimination.
- A rule that makes a shared suffix match better (infinitive -t/-ти → ti) lowers every
  verb-verb distance, the negatives included, so gold AUC falls even when cognates get closer.

## Adopted (bench: baseline after the sibling-port fixes → final)

| change                                                                    | example                                       | effect                                                                                                      |
| ------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `prosody` (ru be uk bg mk sr hr sl; replaces `sl-accents`)                | `бо́гом→bogom`, `rȉjeka→rěka`, `jẹ̑zero→jezero` | silver mean ru 0.462→0.385, hr 0.519→0.381, sl 0.425→0.385; gold unchanged (IE-CoR carries no marks)        |
| ISV `å` kept, `å↔a`/`å↔o` = `etymVowel` 0.25                              | `kråva` ~ `krava`/`krowa`                     | silver ru −0.004, pl −0.006, South +0.002 (0.1 was marginally better everywhere; 0.25 kept as less overfit) |
| `pleophony` (ru, uk): `оро→rå`, `оло→lå`, `ере/ерё→rě` between consonants | `город→gråd`, `берег→brěg`                    | silver ru −0.009, uk −0.010; gold overall flat; bronze ru AUC −0.007                                        |
| `ru-adj`: -ый, velar/husher -ий → -y/-i                                   | `бедный→bedny`, `гений→genij` kept            | silver ru −0.016 (438 better / 21 worse)                                                                    |
| `uk-adj`: -ий → -y (stem ≥ 3 letters)                                     | `бідний→bidny`, `чий` kept                    | silver uk −0.018 (477 / 22)                                                                                 |
| `pl-ie`: labial/velar/l + ie → e                                          | `bieda→beda`                                  | silver pl −0.008 (199 / 28); gold pl 0.951 kept                                                             |
| ISV `ę` kept, `ę↔e`/`ę↔a` = `etymVowel`                                   | `męso` ~ `meso`/`maso`/`мясо`                 | silver ru/be/uk −0.004/−0.005/−0.005, South +0.001..0.002                                                   |

Ported from the sibling copy before tuning: `ru-hushers-soft-sign` (ночь→noč),
`ru-hushers-glide` (шёпот→šopot), `be-je`/`be-letters` apostrophe and ў (сям'я→sjamja),
`hr-jat` stop-list (nije, čije, pije, pijem, piješ, piju), `hr-short-jat` (mjesto→město;
objekt→oběkt accepted), weight pair `i↔j`.

Known costs of `pleophony`: loans with оро/оло/ере (`корона→kråna`, `интерес→intrěs`) and
inherited *CerC with a real vowel (`череп→črěp` vs ISV `čerep`). `еле` is excluded: loans
and non-pleophonic words dominate it (`телефон`, `зелёный`). be is not folded: akanne
rewrites the pattern (`галава`, `бераг`).

## Rejected (bench numbers at the time of the test)

- **ru unstressed о → `ɐ` when a stress mark is present** (`ɐ↔a/o/å` cheap): silver ru
  mean 0.372→0.383, 641 pairs worse vs 70 better. The gains were mostly non-cognates
  moving closer. ISV writes etymological o, so akanje only adds cost against it.
- **Global `a↔o` pair** (for be akanne): gold AUC 0.951→0.950 (bg 0.953→0.949). It only
  shrinks every distance.
- **Global `i↔o` pair** (uk кінь/ніч/біб): gold 0.952→0.951, uk gold 0.962→0.960.
- **ISV `ų` kept** (`ų↔u/o`): silver worse in 10 of 11 languages (ru +0.002, sr +0.003); only
  bg gains (−0.002).
- **ru stressed adjective -ой → -y**: exact noun cognates break (`покой/pokoj` 0→0.44,
  `герой` 0.06→0.51).
- **pl labial ia → ě** (biały, wiara): bronze 236 pairs worse vs 212 better (`kopia/kopija`,
  `chemia`, `ziemia/zemja` 0.27→0.60).
- **cs infinitive -t → -ti** (two-vowel guard): silver cs 0.398→0.372, but gold cs
  0.971→0.966 (cs-hr 0.979→0.957), silver AUC 0.857→0.852.
- **uk infinitive -ти → ti**: silver uk −0.017, but gold uk 0.962→0.960, overall
  0.952→0.951, silver AUC 0.857→0.854.
- **ru жи/ши → žy/šy:** phonetically accurate, but adds distance against ISV etymological _i_
  (`žiti`, `šiti`).
- **ru genitive -ого = [ovo]:** spelled forms already align with ISV `togo`/`jego`.
- **sk ia→ja (piatok):** `piatok` ↔ `petok` is closer via `i↔e` (vowelReduction 0.5) than via
  `pjatok`.
- **Final devoicing (город [gorat], hlěb [hlěp]):** the voicing pairs in `weights.ts` absorb
  the mismatches already.
- **Feature-derived weights (PanPhon):** each canonical grapheme mapped to one IPA segment,
  substitution cost = PanPhon `feature_edit_distance` scaled so the most distant one-segment
  pair is 1; all 421 pairs under 0.8 went into `PHONETIC_PAIRS` (15 bins). Gold AUC
  0.952→0.878, silver AUC lower in all 11 languages (ru 0.860→0.812, hr 0.842→0.788); silver
  mean d fell everywhere only because nearly every substitution got cheap. Features rank
  vowels and consonants close to each other (o↔ě 0.15, b↔m 0.15, c↔t 0.15) and do not know
  which changes are regular in Slavic. A sharper scale (cost × k, clipped at 1) never
  beat the hand table: best gold 0.951 (k≈10, PanPhon cost on top of the hand bins).
  Mapping variants `ě=jɛ`/`ɛ`, `å=ɔ`/`ɒ` change gold by about 0.005. On the same gold pairs,
  measured on IE-CoR IPA segments: plain Levenshtein 0.915, PanPhon `feature_edit_distance`
  0.836, weighted (ICPhS 2019 normalization) 0.900, LingPy SCA 0.951. Unit-cost Levenshtein
  over our canonical graphemes gets 0.948: normalization does most of the work, and the
  hand bins add 0.004.

## Open

- **Morphology the pipelines cannot see:** bg/mk have no infinitive (`бавя` vs `baviti`:
  +t, a↔i). hr/sr/bg/mk short adjectives `-an/-en` stand against ISV `-ny`
  (`bèzdušan`/`bezdušny`). Both are lemma-form differences, not spelling ones.
- **ISV soft finals** (`čęsť→čęstj`, `čeljaď→čeljadj`) cost a full indel against every
  language that does not mark the softness (hr `čast`). A cheaper indel for `j` would need
  per-grapheme indel costs, which is a logic change, not a weight.
- **uk и vs ISV i** (`бавити` / `baviti`, 1100+ silver substitutions at 0.5): every
  normalization tried so far is an infinitive rule, which gold rejects (see above).
- **LingPy SCA scoring over our canonical graphemes:**
  gold AUC 0.956 alone, 0.960 averaged with our distance (ours 0.952). Silver and bronze are not
  measured yet. Using it would mean porting SCA's sound classes and alignment scoring to TS.
