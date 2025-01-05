import { Letter } from '../letter';

const map = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
  map[i] = i;
}

map[Letter.E] = map[Letter.En];
map[Letter.U] = map[Letter.Un];

export function nasalize(letter: Letter): Letter {
  return map[letter];
}

export function nasalizeByIndex(
  sequence: Letter[] | Uint8Array,
  index: number,
): void {
  sequence[index] = map[sequence[index]];
}
