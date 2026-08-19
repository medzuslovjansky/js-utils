import assert from 'node:assert';
import fs from 'node:fs';
import { test } from 'node:test';

import { learn, render, stemOf, TARGET } from './learn.ts';

/**
 * Same failure mode as the stop word list: the table is derived from the
 * lexicon and from `fold`, and nothing about a stale one looks wrong.
 */
test('the committed ending table matches the lexicon', () => {
  assert.strictEqual(
    fs.readFileSync(TARGET, 'utf8'),
    render(learn()),
    'run `yarn workspace @interslavic/dev-stembench learn`',
  );
});

test('the stem is the prefix enough of a paradigm shares', () => {
  const noun = ['leto', 'leta', 'let', 'letu', 'letah', 'letam', 'letom'];
  assert.strictEqual(stemOf(noun, 0.8), 'let');

  // one form out of eight may disagree at 0.8, two may not
  assert.strictEqual(stemOf([...noun.slice(0, 6), 'letek'], 0.8), 'let');
  assert.strictEqual(stemOf(['dela', 'delaj', 'delal', 'delam'], 0.8), 'dela');
});
