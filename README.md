# Interslavic JS utilities

[![Build Status](https://github.com/medzuslovjansky/js-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/medzuslovjansky/js-utils/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-%E2%89%A599%25%20lines-brightgreen)](#working-on-it)

Libraries for working with [Interslavic](https://interslavic-language.org): its
morphology, its alphabets, and how close its words are to the Slavic languages
they were built from.

| Package | What it does |
|---|---|
| [`@interslavic/morphology`](packages/morphology) | inflection, derivation, POS detection; get paradigms and derived forms as CoNLL-U tokens |
| [`@interslavic/translit`](packages/translit) | Latin ⇄ Cyrillic ⇄ Glagolitic ⇄ IPA, addressed by BCP 47 codes |
| [`@interslavic/levenshtein`](packages/levenshtein) | how recognizable an Interslavic word is to a speaker of a given Slavic language |
| [`@interslavic/conllu`](packages/conllu) | the token type and UD features the others speak |
| [`@interslavic/stemmer`](packages/stemmer) | stemming and full-text search: one index key per word, whatever alphabet it was typed in |


Each package README has installation and examples. ESM only, Node 20+.

## Working on it

`yarn install`, `yarn build`, `yarn test`. Development requires Node 22.18+
to run TypeScript sources directly through Node type stripping. Published
packages support Node 20+.

`yarn test:coverage` runs package tests under Node test runner coverage and
enforces coverage thresholds (100% for `conllu`, `translit`, `levenshtein`; 99%
for `morphology`).

## Releasing

Versions are per package and bumped manually, then published in dependency
order:

```bash
# 1. bump the versions you are releasing, in packages/*/package.json
# 2. commit, then tag if the main package moved
git tag v4.0.0-next.1        # `v*` tags trigger the lexicon dump
git push --follow-tags
# 3. publish everything whose version is not on npm yet
yarn release
```

`yarn release` skips packages whose versions are already published. It publishes
to the `next` tag; `latest` points to 3.4.4 until v4 leaves prerelease.

## Documentation

- [CoNLL-U conventions](docs/conllu-conventions.md) — which dictionary tag
  becomes which UPOS tag, what lands in FEATS and MISC
- [Levenshtein tuning](docs/levenshtein-tuning.md) — known issues in the
  normalization pipelines, with fixes
- [Hunspell dictionaries](docs/hunspell.md) — how the spellchecker files are
  built, what Hunspell actually does, and why they are built elsewhere
