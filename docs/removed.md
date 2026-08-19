# Removed Components

Changelog of removed code components and rationales.

## The resolver complex (2026-08-13)

**Removed:** `InterslavicResolver`, `resolveTable`, `Disambiguator` caller side, `core/` (`Vocabulary`, `VocabularyLookup`, `FallbackResolver`, `RefEnricher`), and `lexicon/Lexicon` (~1 330 lines).

**Rationale:**
- Zero external callers or package dependents.
- Zero unit tests or regression fixtures.
- Multi-word parsing produced invalid head assignments and spurious lemmas (e.g. `Sjedinjene Štaty Ameriky`). Multi-word syntactic structure belongs in source data (`head`/`deprel`/`Uninflect=Yes`) rather than runtime heuristics.

A future dictionary import pipeline belongs in `tools/` as offline build tooling.

**Historical reference:**
```bash
git show 75894c2:packages/utils/src/interslavic/InterslavicResolver.ts
git show 75894c2:packages/utils/src/interslavic/resolveTable.ts
git show 75894c2 --stat -- packages/utils/src/core packages/utils/src/lexicon
```

## Filename sanitisers (2026-08-13)

`packages/utils/src/utils/sanitize.ts` (`sanitizeFilename`, `isValidLemma`, `sanitizeLemma`, 67 lines). Leftovers from external scraping scripts with no repo callers.

```bash
git show 75894c2:packages/utils/src/utils/sanitize.ts
```

## Unused patch entries (2026-08-14)

Cleaned up 9 obsolete rows in `interslavic/patches.ts`:
- 6 redundant identity mappings where `PronType=Neg` is already assigned in `inflect/pronoun/pronoun-features.ts`.
- 3 obsolete comma-joined keys (`'uho, uško'`, `'sobě, si'`, `'je, jest'`).

## Word-shape guessers (2026-08-14)

Removed unused heuristic guessers (646 untested lines with no callers):

| Removed | Lines | Function |
|---|---|---|
| `interslavic/LemmaHeuristics.ts` | 458 | Multi-word lemma structure heuristics |
| `interslavic/Disambiguator.ts` | 154 | Homograph disambiguation |
| `isCitationForm`, `inferXposFromWord` | 34 | Headword and POS inference |

`uposFeatsToXpos` was retained (moved to `interslavic/upos-to-xpos.ts`) as it is used by `inflect()`.

```bash
git show 75894c2:packages/utils/src/interslavic/LemmaHeuristics.ts
git show 75894c2:packages/utils/src/interslavic/Disambiguator.ts
git show 75894c2:packages/utils/src/interslavic/citation-form.ts
```

## `formatTokensAsConlluLegacy` (2026-08-14)

Moved five-column snapshot printer from public export `formatTokensAsConlluLegacy` to test helper `conllufyToString` in `packages/morphology/src/__utils__/conllufy.ts`.

## Prototype scripts

Throwaway prototype scripts (`tools/mine/prototype/mine*.py`) remain untracked due to hardcoded local machine paths. Paradigm dump data is reproducibly generated via `tools/dump/out/interslavic-forms.tsv`.

## Fixture importer documentation (2026-08-14)

`packages/utils/scripts/import.cjs` was replaced by reproducible dump tooling. Source spreadsheet:

```
https://docs.google.com/spreadsheets/d/1N79e_yVHDo-d026HljueuKJlAAdeELAiPzdFzdBuKbY/export?format=csv&gid=1987833874
```

Routing rules into `__fixtures__`:

| `partOfSpeech` pattern | Target file |
|---|---|
| `\badj\.` | `adjectives.json` |
| `\b[mfn]\.`, zero or several genders | `nouns-misc.json` |
| `\b[mfn]\.`, feminine | `nouns-feminine.json` |
| `\b[mfn]\.`, neuter | `nouns-neuter.json` |
| `\b[mfn]\.`, masculine with `\banim\.` | `nouns-masculine-animate.json` |
| `\b[mfn]\.`, masculine | `nouns-masculine.json` |
| `^v\.` with `\bpf\.` only | `verbs-perfect.json` |
| `^v\.` with `\bipf\.` only | `verbs-imperfect.json` |
| `^v\.`, both or neither | `verbs-misc.json` |
| `^pron\.<subtype>` | `pronouns-<subtype>.json` |
| anything else | `other.json` |

## `tools/hunspell` (2026-08-17)

Private workspace `@interslavic/dev-hunspell` was removed because live dictionaries are maintained in `slovosbor`. Format constraints and behaviors are documented in [Hunspell dictionaries](hunspell.md). Flat dictionaries generated during dump serve as reference validation targets for future rule-based dictionaries.
