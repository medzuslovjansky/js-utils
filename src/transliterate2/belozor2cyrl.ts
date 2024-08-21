import { createReplacer } from './createReplacer';
import { replaceByWord } from './replaceByWord';

const belozormap = createReplacer({
  a: 'а',
  b: 'б',
  c: 'ц',
  ć: 'ч',
  č: 'ч',
  d: 'д',
  đ: 'дж',
  ď: 'дь',
  e: 'е',
  ě: 'є',
  ę: 'ен',
  f: 'ф',
  g: 'г',
  h: 'х',
  i: 'и',
  j: 'ј',
  k: 'к',
  l: 'л',
  lj: 'љ',
  m: 'м',
  n: 'н',
  nj: 'њ',
  o: 'о',
  p: 'п',
  r: 'р',
  s: 'с',
  ś: 'с',
  š: 'ш',
  t: 'т',
  u: 'у',
  ų: 'ун',
  v: 'в',
  y: 'ы',
  z: 'з',
  ź: 'з',
  ž: 'ж',
});

export function belozor2cyrl(text: string): string {
  return replaceByWord(text, belozormap);
}
