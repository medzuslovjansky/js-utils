import { describe, test } from 'node:test';
import assert from 'node:assert';

import { soften } from './soften.ts';

describe('soften function', () => {
  test('softens the last consonant by default', () => {
    assert.strictEqual(soften('dnes'), 'dneś');
    assert.strictEqual(soften('gaz'), 'gaź');
    assert.strictEqual(soften('lad'), 'laď');
  });

  test('softens the specified consonant at given index', () => {
    assert.strictEqual(soften('lad', 0), 'ľad');
    assert.strictEqual(soften('selsky', 2), 'seľsky');
    assert.strictEqual(soften('měd', 2), 'měď');
  });

  test('handles negative indices', () => {
    assert.strictEqual(soften('dnes', -1), 'dneś');
    assert.strictEqual(soften('test', -2), 'teśt');
  });

  test('handles all softenable consonants', () => {
    assert.strictEqual(soften('D'), 'Ď');
    assert.strictEqual(soften('L'), 'Ľ');
    assert.strictEqual(soften('N'), 'Ń');
    assert.strictEqual(soften('R'), 'Ŕ');
    assert.strictEqual(soften('S'), 'Ś');
    assert.strictEqual(soften('T'), 'Ť');
    assert.strictEqual(soften('Z'), 'Ź');
    assert.strictEqual(soften('d'), 'ď');
    assert.strictEqual(soften('l'), 'ľ');
    assert.strictEqual(soften('n'), 'ń');
    assert.strictEqual(soften('r'), 'ŕ');
    assert.strictEqual(soften('s'), 'ś');
    assert.strictEqual(soften('t'), 'ť');
    assert.strictEqual(soften('z'), 'ź');
  });

  test('does not change non-softenable consonants and vowels', () => {
    assert.strictEqual(soften('baba'), 'baba');
    assert.strictEqual(soften('mama'), 'mama');
    assert.strictEqual(soften('papa'), 'papa');
  });

  test('handles empty strings', () => {
    assert.strictEqual(soften(''), '');
    assert.strictEqual(soften('', 0), '');
  });

  test('handles out of range index', () => {
    assert.strictEqual(soften('test', 4), 'test');
    assert.strictEqual(soften('test', -5), 'test');
  });
});
