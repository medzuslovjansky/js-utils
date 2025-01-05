import { Encoding, Letter } from '../core';
import { LETTER_MAP } from './dictionary/letter-map';
import { reducers } from './dictionary/reducers';

export const DictionaryEncoding: Encoding = {
  encode(input: string): Uint8Array {
    const decomposed = input.normalize('NFD');
    const n = decomposed.length;
    const sequence = new Uint8Array(decomposed.length);
    let index = 0;
    for (let i = 0; i < n; i++) {
      const reduce = reducers[decomposed[i]] ?? reducers[''];
      index = reduce(sequence, index);
    }

    sequence.fill(Letter.None, index);
    return sequence;
  },

  decode(input: Uint8Array | Letter[]): string {
    return Array.from(input, decodeLetter).join('');
  },
};

function decodeLetter(letter: Letter): string {
  return LETTER_MAP[letter] ?? '?';
}
