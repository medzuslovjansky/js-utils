import { LetterReducer } from './types';
import { Letter } from '../../core';
import { pushJ } from './push';

export const jotify: LetterReducer = (
  target: Uint8Array,
  index: number,
): number => {
  if (target[index - 1] === Letter.L) {
    target[index - 1] = Letter.Lj;
    return index;
  }

  if (target[index - 1] === Letter.N) {
    target[index - 1] = Letter.Nj;
    return index;
  }

  return pushJ(target, index);
};
