import { test } from 'node:test';
import assert from 'node:assert';

import { declineNounSimple, inflectNoun } from '../index.ts';

test('a v-stem feminine declines the same spelled with a plain o', () => {
  const plain = declineNounSimple('ljubov', 'f.');

  assert.deepStrictEqual(plain, declineNounSimple('ljubȯv', 'f.'));
  assert.strictEqual(plain?.nom[0]?.[0].form, 'ljubȯv');
});

test('a genitive hint no declension class can produce leaves the stem alone', () => {
  assert.deepStrictEqual(
    declineNounSimple('čaj', 'm.', 'čaju'),
    declineNounSimple('čaj', 'm.'),
  );
});

test('morphology that is not a noun is refused rather than declined', () => {
  assert.throws(() => declineNounSimple('dobry', 'adj.'), /not a noun/);
});

test('a tag that is not a noun yields no forms at all', () => {
  assert.deepStrictEqual(inflectNoun('dobry', 'adj.'), []);
});
