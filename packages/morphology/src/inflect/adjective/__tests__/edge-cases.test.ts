import { test } from 'node:test';
import assert from 'node:assert';

import {
  type AdjectiveCell,
  declineAdjective,
  inflectAdjective,
} from '../index.ts';

const forms = (cells: AdjectiveCell[]) => cells.map(([{ form }]) => form);

test('a velar stem stays hard however the lemma spells its ending', () => {
  const hard = declineAdjective('rusky');
  const soft = declineAdjective('ruski');

  assert.deepStrictEqual(forms(soft.singular.nom), forms(hard.singular.nom));
  assert.deepStrictEqual(forms(soft.singular.gen), ['ruskogo', 'ruskoj']);
});

test('`blagy` gets the same suppletive comparison as `blågy`', () => {
  const { comparison } = declineAdjective('blagy', '', 'adj.');

  assert.deepStrictEqual(comparison.comparative, [
    'unši, blažejši',
    'unje, blažeje',
  ]);
  assert.deepStrictEqual(comparison.superlative, [
    'najunši, najblažejši',
    'najunje, najblažeje',
  ]);
});

test('a lemma no root rule recognises declines off an empty root', () => {
  // Pronouns and numerals hand this function whatever the dictionary spells,
  // without checking it first, so a lemma with no findable stem — a short form
  // like `zdrav` — has to come back as bare endings rather than as a throw.
  const { singular, short } = declineAdjective('zdrav');

  assert.deepStrictEqual(forms(singular.nom), ['y', 'o', 'a']);
  assert.strictEqual(short, undefined);
});

test('a tag that is not an adjective yields no forms at all', () => {
  assert.deepStrictEqual(inflectAdjective('kot', 'm.'), []);
});
