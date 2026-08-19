# @interslavic/levenshtein

Approximate intelligibility metric: measures lexical distance between an Interslavic (ISV) lemma and its cognate in a Slavic language.

```ts
import { distance } from '@interslavic/levenshtein';

distance('вода', 'ru', 'voda');    // 0    — cognate (defaults langB to 'isv')
distance('rijeka', 'hr', 'rěka');  // 0    — cognate through jat
distance('кошка', 'ru', 'pes');    // ~1.1 — unrelated
```

Supported languages: `ru be uk pl cs sk sl hr sr mk bg`. Pure deterministic function with zero runtime dependencies. Requires Node >= 20.

## Pipeline

1. **Normalization.** Both words are normalized to a canonical alphabet (lowercase standard ISV Latin: `a–z` without q/w/x, plus `č š ž ě`). The national word passes through language-specific rules (`src/normalize/langs/<lang>.ts`); the ISV word folds etymological characters (`å ę ų ȯ ė ć đ ď ľ ń ŕ ś ť ź`) to standard base letters. Palatalization is mapped to a j-glide (`конь→konj`, `koń→konj`).
2. **Weighted distance.** Normalized words are segmented into graphemes (e.g. `dž` as single unit) and compared using weighted Levenshtein distance, where phonetically close pairs (`s↔š`, `o↔u`, `b↔p`, `g↔h`) incur reduced substitution costs.
3. **Length normalization.** Distance is scaled by average grapheme length:

   ```
   d = totalCost / ((len(a) + len(b)) / 2)
   ```

   `0` indicates identity after normalization; `~1` indicates unrelated roots. Distance can be converted to similarity via `similarity = Math.max(0, 1 - d)`.

## Configuration

- Replacement costs and phonetic pairs are configured in `src/weights.ts` (`WEIGHTS` and `PHONETIC_PAIRS`).
- Metric thresholds for test assertions are defined in `src/fixtures/types.ts` (`THRESHOLDS`).

## Adding Test Cases

1. Add a test case to `src/fixtures/<lang>.cases.ts`:
   - transliteration rule: `{ in: 'слово', out: 'slovo', covers: 'step-name' }`
   - metric threshold: `{ isv: 'slovo', other: 'слово', max: THRESHOLDS.LOW }`
2. Run `yarn test` to verify the test runs.
3. Adjust pipeline steps in `src/normalize/langs/<lang>.ts` or weights in `src/weights.ts`.

All pipeline steps require corresponding fixture coverage verified by `src/__tests__/coverage.test.ts`.

## Tuning Candidates

See [docs/levenshtein-tuning.md](../../docs/levenshtein-tuning.md) for known edge cases and potential refinements.

## Scripts

```bash
yarn test          # node --test, runs .ts directly
yarn test:watch
yarn lint          # eslint + tsc --noEmit
```
