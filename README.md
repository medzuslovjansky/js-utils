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

Versions are per package and bumped by hand in a PR. The same PR adds a
`## <version>` section on top of the package's `CHANGELOG.md`: that section
becomes the release notes, and a version without one is refused.

After the PR is merged, open **Actions → [Release](../../actions/workflows/release.yml)
→ Run workflow** on `main`. It starts as a dry run: the run summary lists what
would be published, with the notes, and the `release` artifact holds the
tarballs. Untick the dry run to publish. The run then publishes, in dependency
order, every public package whose version is not on npm yet, through npm trusted
publishing (GitHub OIDC, with provenance; there is no npm token), and creates a
GitHub release `@interslavic/<name>@<version>` on the released commit, with the
published tarball attached. Everything goes to the `latest` tag; there is no
prerelease channel.

If the publishing job fails halfway, use **Re-run failed jobs**: it publishes
the same tarballs and skips whatever is already on npm or GitHub. npm hides a
new version for a few minutes while it scans it; a re-run inside that window
fails on that version and can simply be repeated later.

`v*` tags, which trigger the lexicon dump, are still pushed by hand.

One-time setup: a `npm-release` environment restricted to `main` (add yourself
as a required reviewer for a second confirmation), and for each package a
trusted publisher on npmjs.com: repository `medzuslovjansky/js-utils`, workflow
`release.yml`, environment `npm-release`. The packing half of the workflow is
[`tools/release`](tools/release/pack.mjs).

The packages are at 0.x, where a caret range stops at the minor version: `^0.1.0`
does not accept 0.2.0. After a minor bump of a package, bump the packages that
depend on it as well (`morphology` and `stemmer` depend on `translit`,
`morphology` on `conllu`), or they go on installing the old one.

## Documentation

- [CoNLL-U conventions](docs/conllu-conventions.md) — which dictionary tag
  becomes which UPOS tag, what lands in FEATS and MISC
- [Levenshtein tuning](docs/levenshtein-tuning.md) — known issues in the
  normalization pipelines, with fixes
- [Hunspell dictionaries](docs/hunspell.md) — how the spellchecker files are
  built, what Hunspell actually does, and why they are built elsewhere
