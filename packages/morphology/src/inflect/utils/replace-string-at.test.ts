import { describe, it } from 'node:test';
import assert from 'node:assert';

import { replaceStringAt } from './replace-string-at.ts';

describe('replaceStringAt', () => {
  describe('given a character', () => {
    it('should replace a character at a specific index', () => {
      assert.strictEqual(replaceStringAt('hello', 1, 'a'), 'hallo');
    });

    it('should replace a character at the end of the string', () => {
      assert.strictEqual(replaceStringAt('hello', 4, 'a'), 'hella');
    });

    it('should replace a character at the start of the string', () => {
      assert.strictEqual(replaceStringAt('hello', 0, 'a'), 'aello');
    });

    it('should replace a character in a single character string', () => {
      assert.strictEqual(replaceStringAt('a', 0, 'b'), 'b');
    });

    it('should replace a character in a two character string', () => {
      assert.strictEqual(replaceStringAt('ab', 1, 'c'), 'ac');
    });

    it('should ignore an index that is out of bounds', () => {
      assert.strictEqual(replaceStringAt('hello', 5, 'a'), 'hello');
    });

    it('should ignore a negative index', () => {
      assert.strictEqual(replaceStringAt('hello', -1, 'a'), 'hello');
    });
  });

  describe('given a substring', () => {
    it('should replace a substring at a specific index', () => {
      assert.strictEqual(replaceStringAt('hello', 1, 'a world'), 'ha world');
    });

    it('should replace a substring at the end of the string', () => {
      assert.strictEqual(replaceStringAt('hello', 4, 'a world'), 'hella world');
    });

    it('should replace a substring at the start of the string', () => {
      assert.strictEqual(replaceStringAt('hello', 0, 'a world'), 'a world');
    });

    it('should replace a substring in a single character string', () => {
      assert.strictEqual(replaceStringAt('a', 0, 'b world'), 'b world');
    });

    it('should replace a substring in a two character string', () => {
      assert.strictEqual(replaceStringAt('ab', 1, 'c world'), 'ac world');
    });

    it('should ignore an index that is out of bounds', () => {
      assert.strictEqual(replaceStringAt('hello', 5, 'a world'), 'hello');
    });

    it('should ignore a negative index', () => {
      assert.strictEqual(replaceStringAt('hello', -1, 'a world'), 'hello');
    });
  });

  describe('given an empty replacement', () => {
    it('should remove a character at a specific index', () => {
      assert.strictEqual(replaceStringAt('hello', 4, ''), 'hell');
    });
  });

  describe('given a custom length', () => {
    it('should be able to add a substring with a custom length', () => {
      assert.strictEqual(replaceStringAt('pet', 1, 'o', 0), 'poet');
    });

    it('should be able to remove a substring with a custom length', () => {
      assert.strictEqual(replaceStringAt('poet', 1, '', 2), 'pt');
    });
  });
});
