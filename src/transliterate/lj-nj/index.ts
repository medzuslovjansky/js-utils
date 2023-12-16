import ljjList from './list-ljj.json';
import njjList from './list-njj.json';
import njeExceptions from './exceptions-nje.json';
import njjuExceptions from './exceptions-njju.json';
import njeEndings from './endings-nje.json';
import { ENDS, MISMATCH, findTrieWord, WHOLE } from './findTrieWord';

/**
 * Check whether we should soften lj to ĺj
 */
export function ljeCheck(word: string) {
  return findTrieWord(word, ljjList) === WHOLE;
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
  if (findTrieWord(word, njjList) === WHOLE) {
    return true;
  }

  if (findTrieWord(word, njeEndings) === ENDS) {
    return findTrieWord(word, njeExceptions) === MISMATCH;
  }

  if (word.endsWith('nju%') && findTrieWord(word, njjuExceptions) === WHOLE) {
    return true;
  }

  return false;
}

export function njePosition(word: string): number {
  return word.lastIndexOf('nj');
}
