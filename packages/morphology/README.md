# @interslavic/morphology

Morphological engine for Interslavic: inflection paradigms, word derivation, and part-of-speech detection. Returns full inflection paradigms and derived forms as CoNLL-U tokens with UPOS and FEATS annotations.

```bash
npm install @interslavic/morphology
```

## Inflection (`inflect`)

`inflect` generates full inflection paradigms:

```ts
import { inflect } from '@interslavic/morphology';

inflect('žena');
// [ { form: 'žena', lemma: 'žena', upos: 'NOUN', xpos: 'f.',
//     feats: { Gender: 'Fem', Case: 'Nom', Number: 'Sing' } },
//   { form: 'ženy', … Case: 'Nom', Number: 'Plur' }, … 14 tokens ]
```

When passed a string, POS is inferred from the ending. Pass an object to specify explicit constraints:

```ts
inflect({ form: 'sudja', xpos: 'm.anim.' });   // masculine -a noun
inflect({ form: 'pisati', feats: { Aspect: 'Perf' } });
```

Pass multiple principal parts for irregular or suppletive stems:

```ts
inflect([{ form: 'idti', xpos: 'v.intr. ipf.' }, { form: 'ide' }, { form: 'šėl' }]);
// idti, idem, idų, … and the suppletive past šėl, šla, šlo, šli
```

You can also provide a lemma alongside an oblique form: `inflect({ form: 'ide', lemma: 'idti' })`.

`inflect` is idempotent: `inflect(inflect(x))` returns the same token array.

Note: `inflect` handles single words. Multi-word expressions (e.g. `bojati sę` or `Sjedinjene Štaty Ameriky`) must be tokenized separately.

Tokens can be serialized directly to CoNLL-U:

```ts
import { formatTokens } from '@interslavic/conllu';

formatTokens(inflect('žena'));
// 1  žena  žena  NOUN  f.  Case=Nom|Gender=Fem|Number=Sing  _  _  _  _
// 2  ženy  žena  NOUN  f.  Case=Nom|Gender=Fem|Number=Plur  _  _  _  _
```

## Derivation (`derive`)

`derive` generates derived lexical entries and headwords (e.g. participles and verbal nouns from verbs; comparatives, superlatives, and adverbs from adjectives):

```ts
import { derive } from '@interslavic/morphology';

derive('dělati');
// [
//   { form: 'dělajųći', lemma: 'dělajųći', upos: 'VERB', xpos: 'v.prap.', feats: { VerbForm: 'Part', Tense: 'Pres', Voice: 'Act' }, misc: { Derivation: 'v_prap' }, ... },
//   { form: 'dělany', lemma: 'dělany', upos: 'VERB', xpos: 'v.pfpp.', feats: { VerbForm: 'Part', Tense: 'Past', Voice: 'Pass' }, misc: { Derivation: 'v_pfpp' }, ... },
//   { form: 'dělanje', lemma: 'dělanje', upos: 'NOUN', xpos: 'n.', feats: { Gender: 'Neut', VerbForm: 'Vnoun' }, misc: { Derivation: 'v_noun' }, ... },
//   ...
// ]

derive('dobry');
// [
//   { form: 'dobrějši', lemma: 'dobrějši', upos: 'ADJ', xpos: 'adj.comp.', misc: { Derivation: 'adj_cmp' }, ... },
//   { form: 'najdobrějši', lemma: 'najdobrějši', upos: 'ADJ', xpos: 'adj.sup.', misc: { Derivation: 'adj_sup' }, ... },
//   { form: 'dobro', lemma: 'dobro', upos: 'ADV', xpos: 'adv.', misc: { Derivation: 'adv_pos' }, ... },
//   ...
// ]
```

## POS Detection (`detectPos`)

`detectPos` inspects a surface form to infer its part of speech, UPOS, and rationale based on morphological patterns:

```ts
import { detectPos } from '@interslavic/morphology';

detectPos('dělati');
// { xpos: 'v.tr. ipf.', upos: 'VERB', label: 'Verb (imperfective)', reason: 'infinitive ending' }

detectPos('rěka');
// { xpos: 'f.', upos: 'NOUN', label: 'Noun (feminine)', reason: 'ending -a' }
```

Inflection tables follow Jan van Steenbergen's grammar algorithms (located in `src/inflect/`).

