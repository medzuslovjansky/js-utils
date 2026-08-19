# @interslavic/conllu

CoNLL-U and Universal Dependencies types, feature sets, and serialization utilities for Interslavic tokens.

```ts
import type { Token } from '@interslavic/conllu';

const token: Token = {
  form: 'ženy',
  lemma: 'žena',
  upos: 'NOUN',
  xpos: 'f.',
  feats: { Case: 'Nom', Gender: 'Fem', Number: 'Plur' },
};
```

`form, lemma, upos, xpos, feats, misc, head, deprel` correspond to standard CoNLL-U columns. `feats` is strictly typed per UPOS category, preventing invalid feature combinations at compile time.

### Printing and parsing

```ts
import { formatTokens } from '@interslavic/conllu';

formatTokens(tokens);
// 1  žena  žena  NOUN  f.  Case=Nom|Gender=Fem|Number=Sing  _  _  _  _
// 2  ženy  žena  NOUN  f.  Case=Nom|Gender=Fem|Number=Plur  _  _  _  _
```

`formatTokens` serializes a `Token` or `Token[]` to CoNLL-U text. `splitTokens` tokenizes raw text with punctuation tagging and `SpaceAfter=No`, while `joinTokens` reconstructs text from tokens.

See [docs/conllu-conventions.md](../../docs/conllu-conventions.md) for full annotation conventions.
