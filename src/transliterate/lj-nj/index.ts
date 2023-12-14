import ljeExceptions from './exceptions-lj.json';
import njeExceptions from './exceptions-nj.json';
import njeEndings from './endings-nje.json';
import {
  ENDS,
  MISMATCH,
  findTrieWord,
  findTriePosition,
  WHOLE,
} from './findTrieWord';

/**
 * Check whether we should soften lj to ĺj
 */
export function ljeCheck(word: string) {
  return findTrieWord(word, ljeExceptions) === WHOLE;
}

/**
 * Check whether we should soften lj to ĺj
 */
export function ljePosition(word: string) {
  return word.lastIndexOf('lj');
}

/**
 * Check whether we should soften nj to ńj
 */
export function njeCheck(word: string) {
  return (
    findTrieWord(word, njeEndings) === ENDS &&
    findTrieWord(word, njeExceptions) === MISMATCH
  );
}

export function njePosition(word: string): number {
  return findTriePosition(njeEndings, word);
}
