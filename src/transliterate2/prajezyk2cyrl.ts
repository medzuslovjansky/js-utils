import { createReplacer } from './createReplacer';
import { replaceByWord } from './replaceByWord';

const protomap = createReplacer({
  a: 'а',
  b: 'б',
  c: 'ц',
  d: 'д',
  e: 'е',
  f: 'ф',
  g: 'г',
  h: 'х',
  h́: 'хь',
  i: 'и',
  j: 'ј',
  k: 'к',
  l: 'л',
  lj: 'ль',
  m: 'м',
  n: 'н',
  nj: 'нь',
  p: 'п',
  r: 'р',
  s: 'с',
  w: 'ў',
  t: 'т',
  u: 'у',
  z: 'з',
  // ā: 'а' + ':',
  ą: 'ан',
  // ē: 'е' + ':',
  ę: 'ен',
  ī: 'ӣ',
  į: 'ин',
  // ū: 'у' + ':',
  ŭ: 'ў',
  ų: 'ун',
  ǵ: 'гь',
  ḱ: 'кь',
});

export function proto2cyrl(text: string): string {
  return replaceByWord(text, protomap);
}
