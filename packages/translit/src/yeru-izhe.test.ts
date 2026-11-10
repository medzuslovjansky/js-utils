import { describe, test } from 'node:test';
import assert from 'node:assert';

import { transliterate } from './transliterate.ts';

// After Yeru (ȯ) a `j` takes the separate Izhe (ⰺ), because Yeru + Izhe (ⱏⰹ)
// already spells `y`. The soft-sign twin (ėj → ⱐⰺ) was handled by `izhefy`.
describe('Latin → Glagolitic: ȯj is not y', () => {
  const cases: [string, string][] = [
    ['sȯjdti', 'ⱄⱏⰺⰴⱅⰻ'],
    ['sòjdti', 'ⱄⱏⰺⰴⱅⰻ'],
    ['vȯjna', 'ⰲⱏⰺⱀⰰ'],
    ['ryba', 'ⱃⱏⰹⰱⰰ'],
    ['Kyjev', 'Ⰽⱏⰹⰺⰵⰲ'],
  ];

  for (const [latn, glag] of cases) {
    test(`${latn} → ${glag}`, () => {
      assert.strictEqual(transliterate(latn, 'isv-Glag-x-etymolog'), glag);
    });
  }
});
