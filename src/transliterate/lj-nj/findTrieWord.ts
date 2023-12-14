export interface Dict {
  [key: string]: Dict | number;
}

export const ENDS = 1;
export const WHOLE = 0;
export const MISMATCH = -1;

export function findTrieWord(
  word: string,
  dict: Dict,
): Dict | number | undefined {
  let node: Dict | number = dict;
  const length = word.length;
  let chr = '';
  let i: number;

  for (i = length - 1; typeof node === 'object' && i >= 0; i--) {
    chr = word[i];
    node = node[chr];
  }

  return node === 0 ? (i > 0 ? ENDS : WHOLE) : MISMATCH;
}

export function findTriePosition(endings: Dict, word: string): number {
  const length = word.length;
  let node: Dict | number = endings;
  let i: number;
  let chr: string;
  for (i = length - 1; typeof node === 'object' && i >= 0; i--) {
    chr = word[i];
    node = node[chr];
  }

  return node === 0 ? i + 1 : -1;
}
