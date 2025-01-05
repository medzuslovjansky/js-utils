import { Letter } from '../../core';
import { LetterReducer } from './types';

const OGONEK_MAP = new Uint8Array(256);
OGONEK_MAP[Letter.E] = Letter.En;
OGONEK_MAP[Letter.U] = Letter.Un;

export const ogonek: LetterReducer = (
  target: Uint8Array,
  index: number,
): number => {
  if (index > 0) {
    target[index - 1] = ogonek1(target[index - 1]);
  }

  return index;
};

export function ogonek1(letter: Letter): Letter {
  return OGONEK_MAP[letter] || letter;
}
