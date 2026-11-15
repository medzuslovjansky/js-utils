# @interslavic/translit

Transliterates Interslavic text across orthographies and alphabets using standard BCP 47 language tags.

```ts
import { transliterate } from '@interslavic/translit';

transliterate('Slovjansky jezyk', 'isv-Cyrl'); // Словјанскы језык
transliterate('Slovjansky jezyk', 'isv-Glag'); // Ⱄⰾⱁⰲⱝⱀⱄⰽⱐⰹ ⰹⰵⰸⱐⰹⰽ
transliterate('Slovjansky jezyk', 'isv-x-fonipa'); // sɫɔvjanskɪ jɛzɪk
```

In addition to primary scripts (`isv-Latn`, `isv-Cyrl`, `isv-Glag`, `isv-x-fonipa`), regional and simplified flavorisations are supported:

```ts
transliterate('Slovjansky jezyk', 'isv-Latn-x-northern'); // Slovianski jezyk
transliterate('Slovjansky jezyk', 'isv-Latn-x-sloviant'); // Slovjanski jezik
```

The etymological orthography (`isv-Latn-x-etymolog`) restores historical vowels (`å`, `ę`, `ȯ`, `ė`, etc.) when present in the source: standard Latin input without etymological characters passes through unchanged.

The third argument says how to read the input. By default anything goes: ASCII fallbacks, Cyrillic, Glagolitic, the accents of other orthographies. Input that is already etymological can say so and is then left as it is spelled:

```ts
transliterate('czas', 'isv-Latn'); // čas
transliterate('czas', 'isv-Latn', { input: 'isv-x-etymolog' }); // czas
```

A boolean third argument still works as before (`true` is `{ input: 'isv-x-etymolog' }`).

Two more things can be said about the input:

```ts
// Naučny Medžuslovjanski: its ė is ě and its ĺ is a syllabic l
transliterate('vėrh, vĺk', 'isv-Latn-x-etymolog', { input: 'isv-x-nms' }); // věrh, vȯlk

// a word-final hard yer (ⱏ, ъ) is silent after a vowel and kept in vȯ, sȯ, kȯ
transliterate('въ каналъ', 'isv-Latn-x-etymolog'); // vȯ kanal
transliterate('въ каналъ', 'isv-Latn-x-etymolog', { finalYer: 'drop' }); // v kanal
transliterate('въ каналъ', 'isv-Latn-x-etymolog', { finalYer: 'keep' }); // vȯ kanalȯ
```

A Cyrillic or Latin word written with yers can be read by Havlík's law instead
(counting yers from the end: the last is weak, the one before it strong, and so
on). A strong yer is vocalized, a weak ъ is gone, a weak ь softens. Glagolitic
is read by the neighbours either way:

```ts
transliterate('кръвь', 'isv-Latn-x-etymolog', { yers: 'havlik' }); // krȯv
transliterate('dьržati', 'isv-Latn-x-etymolog', { yers: 'havlik' }); // dŕžati
transliterate('konь', 'isv-Latn-x-etymolog', { yers: 'havlik' }); // konj
```

Glagolitic writes numbers from 1 to 999 999 in letters, with `ⱍ` for the thousand and the count of thousands before it. This is off unless asked for; the value says how a number is marked (`true` is `'titlo'`, a titlo over every letter), and every mark is read whichever is chosen:

```ts
transliterate('19 knig', 'isv-Glag', { glagoliticNumerals: 'titlo' }); // ⰸ҃ⰺ҃ ⰽⱀⰻⰳ
transliterate('19 knig', 'isv-Glag', { glagoliticNumerals: 'dots' }); // ·ⰸⰺ· ⰽⱀⰻⰳ
transliterate('19 knig', 'isv-Glag', { glagoliticNumerals: 'dots-titlo' }); // ·ⰸ҃ⰺ҃· ⰽⱀⰻⰳ
transliterate('10000', 'isv-Glag', { glagoliticNumerals: 'dots' }); // ·ⰺⱍ·
transliterate('·ⰸⰺ· ⰽⱀⰻⰳ', 'isv-Latn', { glagoliticNumerals: true }); // 19 knig
```

`normalize` is the same reading with a Latin result, etymological or standard:

```ts
import { normalize } from '@interslavic/translit/normalize';

normalize('рѫка, czlovek'); // rųka, človek
normalize('рѫка, czlovek', { output: 'isv-Latn' }); // ruka, človek
```

Tag inventories are exported as constants (`FlavorisationBCP47`). Phonological and alphabet tables are available via `@interslavic/translit/phonology` and `@interslavic/translit/alphabet`.

A standalone browser bundle is available at `dist/index.browser.min.js`.
