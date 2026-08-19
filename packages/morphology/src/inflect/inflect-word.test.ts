import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { inflectWord } from './inflect-word.ts';

describe('inflectWord', () => {
  test('carries the misc column onto every form', () => {
    const tokens = inflectWord('dom', 'm.', 'dom', undefined, { SID: '1234' });

    assert.ok(tokens.length > 1);
    for (const token of tokens) {
      assert.deepEqual(token.misc, { SID: '1234' });
    }
  });

  test('gives each form its own misc object', () => {
    const misc = { SID: '1234' };
    const [first, second] = inflectWord('dom', 'm.', 'dom', undefined, misc);

    assert.notEqual(first.misc, misc);
    assert.notEqual(first.misc, second.misc);
  });

  test('leaves misc unset when there is none', () => {
    assert.equal(inflectWord('dom', 'm.', 'dom')[0].misc, undefined);
  });
});
