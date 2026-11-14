# @interslavic/translit

Transliterates Interslavic text across orthographies and alphabets using standard BCP 47 language tags.

```ts
import { transliterate } from '@interslavic/translit';

transliterate('Slovjansky jezyk', 'isv-Cyrl');      // Словјанскы језык
transliterate('Slovjansky jezyk', 'isv-Glag');      // Ⱄⰾⱁⰲⱝⱀⱄⰽⱐⰹ ⰹⰵⰸⱐⰹⰽ
transliterate('Slovjansky jezyk', 'isv-x-fonipa');  // sɫɔvjanskɪ jɛzɪk
```

In addition to primary scripts (`isv-Latn`, `isv-Cyrl`, `isv-Glag`, `isv-x-fonipa`), regional and simplified flavorisations are supported:

```ts
transliterate('Slovjansky jezyk', 'isv-Latn-x-northern');  // Slovianski jezyk
transliterate('Slovjansky jezyk', 'isv-Latn-x-sloviant');  // Slovjanski jezik
```

The etymological orthography (`isv-Latn-x-etymolog`) restores historical vowels (`å`, `ę`, `ȯ`, `ė`, etc.) when present in the source: standard Latin input without etymological characters passes through unchanged.

The third argument says how to read the input. By default anything goes: ASCII fallbacks, Cyrillic, Glagolitic, the accents of other orthographies. Input that is already etymological can say so and is then left as it is spelled:

```ts
transliterate('czas', 'isv-Latn');                               // čas
transliterate('czas', 'isv-Latn', { input: 'isv-x-etymolog' });  // czas
```

`normalize` is the same reading with a Latin result, etymological or standard:

```ts
import { normalize } from '@interslavic/translit/normalize';

normalize('рѫка, czlovek', 'etymolog');  // rųka, človek
normalize('рѫка, czlovek', 'standard');  // ruka, človek
```

Tag inventories are exported as constants (`FlavorisationBCP47`). Phonological and alphabet tables are available via `@interslavic/translit/phonology` and `@interslavic/translit/alphabet`.

A standalone browser bundle is available at `dist/index.browser.min.js`.
