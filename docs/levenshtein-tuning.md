# Levenshtein: known issues in the normalization pipelines

Open issues and proposed normalizations in `@interslavic/levenshtein`.

## 1. ru: Soft sign after hushers — ночь → `noč` (currently `nočj`)

**Cause:** ж, ч, ш, щ are phonetically unpaired for palatalization in Russian; final `ь` in ночь/мышь/рожь/вещь/беречь is orthographic. `nočj` vs ISV `noč` adds an extra edit distance.

**Proposed Fix:** First step in `src/normalize/langs/ru.ts` (before `ru-je` and `cyrillic-base`):

```ts
regexStep('ru-hushers-soft-sign', /(?<=[жчшщ])ь(?![еёюяи])/g, '')
```

**Caveat:** Do not drop unconditionally. `ь` before iotated vowels must survive for `cyrillic-base` composites (e.g. ночью → `nočju`, чью → `čju`, чьи → `čji`).

**Fixtures:** `ночь` → `noč`, `ешь` → `ješ`, plus `ночью` → `nočju` and `чьи` → `čji`.

## 2. ru: Phantom glide in ё/ю after hushers — шофёр → `šofor` (currently `šofjor`)

After hushers (ж, ч, ш, щ), iotated letters do not carry an independent glide in Russian phonetics (e.g. шёпот → `šopot`, чёрный → `čornyj`, шофёр → `šofor`, жюри → `žuri`, парашют → `parašut`, брошюра → `brošura`).

**Proposed Fix:** Replace with Cyrillic о/у before `cyrillic-base`:

```ts
.replace(/(?<=[жчшщ])ё/g, 'о')
.replace(/(?<=[жчшщ])ю/g, 'у')
```

## 3. be: Apostrophe normalization

сям'я → `sjam'ja`: the apostrophe is currently not stripped in Belarusian normalization, leaking into standard alphabet comparisons.

**Proposed Fix:** Extend `be-letters`: `{ 'ў': 'v', '’': '', "'": '' }` (yielding `sjamja`, `abjekt`).

## 4. hr: Non-jat *ije* false positives

`rijeka` → `rěka`, `mlijeko` → `mlěko`, but `nije` → `ně`, `čije` → `čě`, and `pijem` → `pěm`.

Non-jat *ije* represents stem-final *i* + *je* (`pije`, `nije`), but genuine jat also occurs word-finally (`dvije` → `dvě`, `prije` → `prě`).

**Options:**
1. Check a small stop-list of frequent non-jat lemmas (`nije`, `čije`, `pije` forms) before applying the rule.
2. Tolerate the divergence in inflectional forms.

## 5. hr: Short jat (C+je)

`hr-jat` currently handles only long jat (*ije*). Short jat appears as consonant + *je* (`mjesto` → `město`, `djeca` → `děca`, `vjera` → `věra`, `pjesma` → `pěsma`).

**Proposed Step:**

```ts
regexStep('hr-short-jat', /(?<=[bcčdfgklmnprsštvzž])je/g, 'ě')
```

**Limitation:** May affect Latinate loanwords (e.g. `objekt` → `oběkt`).

## 6. Weights: `j↔i` substitution

Infinitives ending in soft consonants (e.g. `govoriti` vs `говорить` → `govoritj`) incur an edit distance of 1.0 on `j↔i`.

**Proposed Fix:** Add `['i', 'j', 'vowelReduction']` to `PHONETIC_PAIRS` in `src/weights.ts`.

## Rejected normalizations

- **ru жи/ши → žy/šy:** Phonetically accurate, but increases edit distance against ISV etymological *i* (`žiti`, `šiti`).
- **ru genitive -ого = [ovo]:** Spelled forms already align with ISV `togo`/`jego`.
- **sk ia→ja (piatok):** `piatok` ↔ `petok` is lower distance via `i↔e` (vowelReduction 0.5) than via `pjatok`.
- **Final devoicing (город [gorat], hlěb [hlěp]):** Voicing pairs in `weights.ts` absorb mismatches directly.
