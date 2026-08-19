import test from 'node:test';
import assert from 'node:assert/strict';
import { graphemes } from '../graphemes.ts';
import { weightedLevenshtein } from '../weightedLevenshtein.ts';
import { WEIGHTS } from '../weights.ts';

test('identical arrays cost 0', () => {
  assert.equal(
    weightedLevenshtein(['v', 'o', 'd', 'a'], ['v', 'o', 'd', 'a']),
    0,
  );
});

test('single in-group substitution costs the group weight', () => {
  assert.equal(weightedLevenshtein(['s'], ['š']), WEIGHTS.diacriticFold);
  assert.equal(weightedLevenshtein(['g'], ['h']), WEIGHTS.ghSpirantization);
  assert.equal(weightedLevenshtein(['b'], ['p']), WEIGHTS.voicing);
  assert.equal(weightedLevenshtein(['o'], ['u']), WEIGHTS.vowelReduction);
});

test('pair lookup is symmetric', () => {
  assert.equal(
    weightedLevenshtein(['š'], ['s']),
    weightedLevenshtein(['s'], ['š']),
  );
});

test('pairs are not transitively closed: e↔y is a plain substitute', () => {
  assert.equal(weightedLevenshtein(['e'], ['y']), WEIGHTS.substitute);
});

test('empty vs non-empty is pure indel', () => {
  assert.equal(weightedLevenshtein([], ['a', 'b']), 2 * WEIGHTS.indel);
  assert.equal(weightedLevenshtein(['a', 'b'], []), 2 * WEIGHTS.indel);
});

test('kitten/sitting classic, expressed through weights', () => {
  // k↔s substitute, e↔i vowelReduction, +g indel
  assert.equal(
    weightedLevenshtein(graphemes('kitten'), graphemes('sitting')),
    WEIGHTS.substitute + WEIGHTS.vowelReduction + WEIGHTS.indel,
  );
});

test('dž is one grapheme', () => {
  assert.deepEqual(graphemes('medžu'), ['m', 'e', 'dž', 'u']);
});
