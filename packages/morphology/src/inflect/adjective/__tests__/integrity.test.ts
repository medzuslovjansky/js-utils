import { test } from 'node:test';
import assert from 'node:assert';

import { adjectiveForms } from '../../flatten.ts';

test('an adjective yields the whole of its paradigm and nothing empty', () => {
  const positive = adjectiveForms('dobry', '', 'adj.');
  const comparative = adjectiveForms('lěpši', '', 'adj.comp.');
  const superlative = adjectiveForms('najlěpši', '', 'adj.sup.');
  const joint = [...positive, ...comparative, ...superlative];

  assert.strictEqual(joint.filter(Boolean).length, joint.length);
  assert.strictEqual(positive.length, 19);
  assert.strictEqual(comparative.length, 14);
  assert.strictEqual(superlative.length, 12);
});
