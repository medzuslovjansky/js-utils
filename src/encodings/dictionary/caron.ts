import { Letter } from '../../core';
import { LetterReducer } from './types';

const CARON_MAP = new Uint8Array(256);
CARON_MAP[Letter.C] = Letter.Cz;
CARON_MAP[Letter.S] = Letter.Sz;
CARON_MAP[Letter.Z] = Letter.Zz;
CARON_MAP[Letter.D] = Letter.Di;
CARON_MAP[Letter.L] = Letter.Li;
CARON_MAP[Letter.N] = Letter.Ni;
CARON_MAP[Letter.R] = Letter.Ri;
CARON_MAP[Letter.T] = Letter.Ti;

export const caron: LetterReducer = (
  target: Uint8Array,
  index: number,
): number => {
  if (index > 0) {
    target[index - 1] = caron1(target[index - 1]);
  }

  return index;
};

export function caron1(letter: Letter): Letter {
  return CARON_MAP[letter] || letter;
}
