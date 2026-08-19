import { describe, it } from 'node:test';
import assert from 'node:assert';

import { removeBrackets } from './remove-brackets.ts';

describe('removeBrackets', () => {
  it('should leave text without brackets alone', () => {
    assert.strictEqual(removeBrackets('bogatstvo', '[', ']'), 'bogatstvo');
  });

  it('should cut a bracketed segment off the end', () => {
    assert.strictEqual(removeBrackets('nakaz [voj.]', '[', ']'), 'nakaz');
  });

  it('should close the gap a bracketed segment leaves behind', () => {
    assert.strictEqual(removeBrackets('nakaz [voj.] tu', '[', ']'), 'nakaz tu');
  });

  it('should keep cutting until no pair is left', () => {
    assert.strictEqual(
      removeBrackets('a [x] b [y] c', '[', ']'),
      'a b c',
      'the second pair is only reached by recursing on the shortened text',
    );
  });

  it('should ignore an opening bracket that is never closed', () => {
    assert.strictEqual(removeBrackets('nakaz [voj.', '[', ']'), 'nakaz [voj.');
  });

  it('should ignore a closing bracket that precedes the opening one', () => {
    assert.strictEqual(removeBrackets('a ] b [ c', '[', ']'), 'a ] b [ c');
  });

  it('should take the delimiters it is given', () => {
    assert.strictEqual(removeBrackets('bajati (bajaje)', '(', ')'), 'bajati');
  });
});
