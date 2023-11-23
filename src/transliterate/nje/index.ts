import type { Dict } from './Dict';
import njeExceptions from './exceptions';
import rules from './rules';

const ENDS = 1;
const WHOLE = 0;
const MISMATCH = -1;

function findTrieWord(word: string, dict: Dict): Dict | number | undefined {
  let node: Dict | number = dict;
  const length = word.length;
  let chr = '';
  let i: number;

  for (i = length - 1; typeof node === 'object' && i >= 0; i--) {
    chr = word[i];
    node = node[chr];
  }

  return node === 0 ? (i === -1 ? WHOLE : ENDS) : MISMATCH;
}

/**
 * Check whether we should soften nj to ńj
 */
export function njeCheck(word: string) {
  return (
    findTrieWord(word, rules) === ENDS &&
    findTrieWord(word, njeExceptions) === MISMATCH
  );
}

export function njePosition(word: string): number {
  const length = word.length;
  let node: Dict | number = rules;
  let i: number;
  let chr: string;
  for (i = length - 1; typeof node === 'object' && i >= 0; i--) {
    chr = word[i];
    node = node[chr];
  }

  return node === 0 ? i + 1 : -1;
}
