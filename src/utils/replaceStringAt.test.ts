import { replaceStringAt } from './replaceStringAt';

describe('replaceStringAt', () => {
  describe('given a character', () => {
    it('should replace a character at a specific index', () => {
      expect(replaceStringAt('hello', 1, 'a')).toBe('hallo');
    });

    it('should replace a character at the end of the string', () => {
      expect(replaceStringAt('hello', 4, 'a')).toBe('hella');
    });

    it('should replace a character at the start of the string', () => {
      expect(replaceStringAt('hello', 0, 'a')).toBe('aello');
    });

    it('should replace a character in a single character string', () => {
      expect(replaceStringAt('a', 0, 'b')).toBe('b');
    });

    it('should replace a character in a two character string', () => {
      expect(replaceStringAt('ab', 1, 'c')).toBe('ac');
    });

    it('should ignore an index that is out of bounds', () => {
      expect(replaceStringAt('hello', 5, 'a')).toBe('hello');
    });

    it('should ignore a negative index', () => {
      expect(replaceStringAt('hello', -1, 'a')).toBe('hello');
    });
  });

  describe('given a substring', () => {
    it('should replace a substring at a specific index', () => {
      expect(replaceStringAt('hello', 1, 'a world')).toBe('ha world');
    });

    it('should replace a substring at the end of the string', () => {
      expect(replaceStringAt('hello', 4, 'a world')).toBe('hella world');
    });

    it('should replace a substring at the start of the string', () => {
      expect(replaceStringAt('hello', 0, 'a world')).toBe('a world');
    });

    it('should replace a substring in a single character string', () => {
      expect(replaceStringAt('a', 0, 'b world')).toBe('b world');
    });

    it('should replace a substring in a two character string', () => {
      expect(replaceStringAt('ab', 1, 'c world')).toBe('ac world');
    });

    it('should ignore an index that is out of bounds', () => {
      expect(replaceStringAt('hello', 5, 'a world')).toBe('hello');
    });

    it('should ignore a negative index', () => {
      expect(replaceStringAt('hello', -1, 'a world')).toBe('hello');
    });
  });

  describe('given an empty replacement', () => {
    it('should remove a character at a specific index', () => {
      expect(replaceStringAt('hello', 4, '')).toBe('hell');
    });
  });

  describe('given a custom length', () => {
    it('should be able to add a substring with a custom length', () => {
      expect(replaceStringAt('pet', 1, 'o', 0)).toBe('poet');
    });

    it('should be able to remove a substring with a custom length', () => {
      expect(replaceStringAt('poet', 1, '', 2)).toBe('pt');
    });
  });
});
