import { createReplacer } from './createReplacer';
import { replaceByWord } from './replaceByWord';

const krilanmap = createReplacer({
  a: 'а',
  b: 'б',
  d: 'д',
  e: 'е',
  g: 'г',
  gź: 'ѓ',
  h: 'х',
  i: 'и',
  j: 'ј',
  k: 'к',
  kś: 'ќ',
  l: 'л',
  lj: 'љ',
  m: 'м',
  n: 'н',
  nj: 'њ',
  o: 'о',
  p: 'п',
  r: 'р',
  s: 'с',
  t: 'т',
  u: 'у',
  y: 'ы',
  z: 'з',
  å: 'å',
  æ: 'æ',
  ó: 'ó',
  į: 'ин',
  ı: 'ь',
  ŋ: 'н',
  ś: 'сь',
  ŭ: 'ў',
  ȯ: 'ъ',
});

export function krilan2cyrl(text: string): string {
  return replaceByWord(text, krilanmap);
}
