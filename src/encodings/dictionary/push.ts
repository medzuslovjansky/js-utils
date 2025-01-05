import { Letter } from '../../core';
import { LetterReducer } from './types';

export function push(letter: Letter): LetterReducer {
  return (target, index) => {
    const idx =
      index > 0 && target[index - 1] === Letter.None ? index - 1 : index;
    target[idx] = letter;
    return idx + 1;
  };
}

export const push0 = push(Letter.None);
export const pushJ = push(Letter.J);
