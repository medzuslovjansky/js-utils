# ConLL-U API

> [!WARNING]
> **Alpha Quality**: This API is in early development and may have bugs, incomplete features, or breaking changes. Use with caution and report any issues you encounter.

## Overview

The ConLL-U API provides functionality to convert Interslavic words into ConLL-U format tokens with morphological features. It supports nouns, adjectives, verbs, pronouns, numerals, and other parts of speech.

## Basic Usage

### Import the function

```typescript
import { conllufy } from '@interslavic/utils';
```

### Convert a word to ConLL-U tokens

The main function is `conllufy`, which takes a word, its XPOS tag, and optional details:

```typescript
// Simple usage
const tokens = conllufy('dobry', 'adj.');

// With word ID and irregular forms
const tokens = conllufy('oko', 'n.', {
  id: 1,
  irregular: '(oka/očese; pl. oči)'
});
```

## API Reference

### `conllufy(word: string, xpos: XPOS, details?: WordDetails): Token[]`

Converts a word into an array of ConLL-U tokens with all inflected forms.

**Parameters:**
- `word` (string): The word form (lemma)
- `xpos` (XPOS): The part-of-speech tag (e.g., `'adj.'`, `'m.'`, `'v.pf.'`)
- `details` (optional): Object with:
  - `id` (number): Optional word ID (used for lemma URI)
  - `irregular` (string): Optional irregular declension information

**Returns:** Array of `Token` objects with all inflected forms

## XPOS Tags

The API supports various XPOS tags for different parts of speech:

### Nouns
- `'m.'` - masculine
- `'f.'` - feminine
- `'n.'` - neuter
- `'m.anim.'` - masculine animate
- `'m.sg.'`, `'f.pl.'`, etc. - with number restrictions
- `'m./f.'` - masculine or feminine

### Adjectives
- `'adj.'` - positive degree
- `'adj.comp.'` - comparative
- `'adj.sup.'` - superlative
- `'adj.pfap.'`, `'adj.pfpp.'`, etc. - participles

### Verbs
- `'v.pf.'` - perfective
- `'v.ipf.'` - imperfective
- `'v.tr.'`, `'v.intr.'` - transitive/intransitive
- `'v.refl.'` - reflexive
- `'v.aux.'` - auxiliary

### Pronouns
- `'pron.pers.'` - personal
- `'pron.poss.'` - possessive
- `'pron.dem.'` - demonstrative
- `'pron.refl.'` - reflexive
- etc.

### Other
- `'adv.'` - adverb
- `'num.'` - numeral
- `'prep.'` - preposition
- `'conj.'` - conjunction
- `'particle'` - particle
- `'intj.'` - interjection

## Examples

### Noun with irregular forms

```typescript
const tokens = conllufy('oko', 'n.', {
  id: 1,
  irregular: '(oka/očese; pl. oči)'
});
// tokens is an array of Token objects with all inflected forms
```

### Adjective

```typescript
const tokens = conllufy('dobry', 'adj.');
// Generates all case/number/gender combinations
```

### Verb

```typescript
const tokens = conllufy('čitať', 'v.ipf.');
// Generates infinitive and other verb forms
```

### Personal pronoun

```typescript
const tokens = conllufy('ja', 'pron.pers.', { id: 12345 });
// Generates all case forms for first person singular
```

## Token Structure

Each token contains:
- `token`: The inflected word form
- `lemma`: Object with `value` (the lemma) and optional `uri` (e.g., `'steen:123'`)
- `upos`: Universal POS tag (e.g., `'NOUN'`, `'ADJ'`, `'VERB'`)
- `xpos`: Language-specific POS tag
- `feats`: Object with morphological features (Case, Number, Gender, etc.)

## Limitations

- **Alpha Quality**: The API is still under development
- Some edge cases may not be handled correctly
- Irregular forms require manual specification via the `irregular` parameter
- Multi-word expressions are not fully supported
- Some XPOS tags may not be fully implemented

## Contributing

If you encounter issues or have suggestions, please report them. The API is actively being developed and improved.

