# @interslavic/utils

[![npm version](https://badge.fury.io/js/%40interslavic%2Futils.svg)](https://badge.fury.io/js/%40interslavic%2Futils)
[![Build Status](https://github.com/medzuslovjansky/js-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/medzuslovjansky/js-utils/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/medzuslovjansky/js-utils/badge.svg?branch=main)](https://coveralls.io/github/medzuslovjansky/js-utils?branch=main)

This package contains various JavaScript utilities for Interslavic language to work with BCP 47 codes, transliteration, declension, conjugation, etc.

## Installation

To install in your project, use:

```
npm install @interslavic/utils --save
```

## Overview

Reference is automatically generated at: <https://medzuslovjansky.github.io/js-utils>

### Constants

* `InterslavicBCP47` - primary BCP 47 codes for Interslavic like `art-x-interslv` and its variants per used alphabets.
* `FlavorisationBCP47` - all possible BCP 47 codes for Interslavic with flavorisations applied like Northern, Southern, Slovianto, etc.
* `Glagolitic` - collection of named constants for Glagolitic letters, e.g. `Glagolitic.AZU`, `Glagolitic.BUKY`, etc.

### Functions

#### Transliteration

* `transliterate` - transliterate text from one alphabet to another using BCP 47 codes

#### Part of speech

* `parsePos` - parse tags like `f.`, `v.tr. impf.`, etc. into an object with convenient properties

#### Adjectives

* `declensionAdjective` - declension of adjectives into an object form.
* `declensionAdjectiveFlat` - declension of adjectives into an array of strings.

#### Nouns

* `declensionNoun` - declension of nouns into an object form.
* `declensionNounFlat` - declension of nouns into an array of strings.

#### Numerals

* `declensionNumeral` - declension of numerals into an object form.
* `declensionNumeralFlat` - declension of numerals into an array of strings.

#### Pronouns

* `declensionPronoun` - declension of pronouns into an object form.
* `declensionPronounFlat` - declension of pronouns into an array of strings.

#### Verbs

* `conjugationVerb` - conjugation of verbs into an object form.
* `conjugationVerbFlat` - conjugation of verbs into an array of strings.
