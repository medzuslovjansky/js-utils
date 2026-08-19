import { describe, test } from 'node:test';
import assert from 'node:assert';

import { etymologify } from './etymologify.ts';

describe('etymologify', () => {
  test('rejects combining marks it cannot compose away', () => {
    // "b" + U+0301 has no precomposed form and no etymological spelling, so it
    // would reach the inflection code as a two-code-point letter.
    assert.throws(() => etymologify('b́aba'), /has unnormalized characters/);
  });

  test('composes the acute letters that do have a precomposed form', () => {
    assert.strictEqual(etymologify('t́ma'), 'ťma');
  });
});
