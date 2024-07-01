import { SuffixTrie, TrieMatch } from './SuffixTrie';

describe('SuffixTrie', () => {
  let trie: SuffixTrie;

  beforeEach(() => {
    trie = new SuffixTrie(['concat', 'cat']);
  });

  describe('constructor', () => {
    test('initializes with empty node when no argument is provided', () => {
      trie = new SuffixTrie();
      expect([...trie]).toEqual([]);
    });

    test('initializes with provided tokens', () => {
      trie = new SuffixTrie(['cat', 'dog']);
      expect([...trie]).toEqual(['cat', 'dog']);
    });
  });

  describe('add', () => {
    test('adds a token to the trie', () => {
      trie = new SuffixTrie();
      expect([...trie.add('cat').add('dog')]).toEqual(['cat', 'dog']);
    });
  });

  describe('match', () => {
    beforeEach(() => {
      trie.add('cat').add('concat');
    });

    test('match method returns WHOLE for exact matches', () => {
      expect(trie.match('cat')).toBe(TrieMatch.WHOLE);
      expect(trie.match('concat')).toBe(TrieMatch.WHOLE);
    });

    test('match method returns ENDS for partial matches at the end', () => {
      expect(trie.match('copycat')).toBe(TrieMatch.ENDS);
    });

    test('match method returns MISMATCH for non-matches', () => {
      expect(trie.match('at')).toBe(TrieMatch.MISMATCH);
      expect(trie.match('dog')).toBe(TrieMatch.MISMATCH);
    });

    test('match method returns MISMATCH for empty string', () => {
      expect(trie.match('')).toBe(TrieMatch.MISMATCH);
    });
  });

  describe('findIndex', () => {
    beforeEach(() => {
      trie.add('cat').add('concat');
    });

    test('findIndex method returns the index of the match', () => {
      expect(trie.findIndex('cat')).toBe(0);
      expect(trie.findIndex('oncat')).toBe(2);
      expect(trie.findIndex('concat')).toBe(0);
      expect(trie.findIndex('anticoncat')).toBe(4);
    });

    test('findIndex method returns -1 for non-matches', () => {
      expect(trie.findIndex('at')).toBe(-1);
      expect(trie.findIndex('dog')).toBe(-1);
    });

    test('findIndex method returns -1 for empty string', () => {
      expect(trie.findIndex('')).toBe(-1);
    });
  });

  test('serialization', () => {
    const before = [...trie];
    const json = JSON.stringify(trie);
    const after = new SuffixTrie(JSON.parse(json));

    expect([...after]).toEqual(before);
  });
});
