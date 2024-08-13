// noinspection NonAsciiCharacters,JSNonASCIINames

import { createReplacer } from './createReplacer';
import { Glagolitic } from '../constants';
import { replaceByWord } from './replaceByWord';

const ciafy = (text: string) =>
  text.replace(/([cs])i([aåeěęėioȯuųùy])/g, '$1’j$2');

const softener = createReplacer({
  ď: 'dь',
  ľ: 'lь',
  lj: 'lь',
  ń: 'nь',
  nj: 'nь',
  ŕ: 'rь',
  ś: 'sь',
  ť: 'tь',
  ź: 'zь',
});

const punctuate = createReplacer({
  '?': ';',
  '.': '։',
  ',': '·',
  '(': '⁖',
  ')': '჻',
  '"': '⸪',
  '«': '⸪',
  '»': '⸪',
  '!': '··',
  ':': '⸬',
  ';': '⁘',
  '...': '···',
  '…': '···',
});

const izhefy = createReplacer({
  [Glagolitic.Yeru + Glagolitic.Izhe]:
    Glagolitic.Yeru + Glagolitic.Initial_Izhe,
  [Glagolitic.Yeri + Glagolitic.Izhe]:
    Glagolitic.Yeri + Glagolitic.Initial_Izhe,
  [Glagolitic.Izhe + Glagolitic.Izhe]:
    Glagolitic.Izhe + Glagolitic.Initial_Izhe,
});

const glagolify = createReplacer({
  a: Glagolitic.Azu, // ⰰ
  å: Glagolitic.Otu, // ⱉ
  b: Glagolitic.Buky, // ⰱ
  c: Glagolitic.Tsi, // ⱌ
  // "ć": Glagolitic.Chrivi + Glagolitic.Yeri, // ⱍⱐ
  ć: Glagolitic.Shta, // ⱋ
  č: Glagolitic.Chrivi, // ⱍ
  d: Glagolitic.Dobro, // ⰴ
  đ: Glagolitic.Djervi, // ⰼ
  ѕ: Glagolitic.Dzelo, // ⰷ
  dž: Glagolitic.Dobro + Glagolitic.Zhivete, // ⰴⰶ
  e: Glagolitic.Yestu, // ⰵ
  ě: Glagolitic.Yati, // ⱑ
  ę: Glagolitic.Small_Yus, // ⱔ
  ė: Glagolitic.Yeri, // ⱐ
  ь: Glagolitic.Yeri, // ⰴⱐ
  f: Glagolitic.Fritu, // ⱇ
  g: Glagolitic.Glagoli, // ⰳ
  h: Glagolitic.Heru, // ⱈ
  i: Glagolitic.I, // ⰻ
  j: Glagolitic.Izhe, // ⰹ
  '’j': Glagolitic.Initial_Izhe, // ⰺ
  ję: Glagolitic.Iotated_Small_Yus, // ⱗ
  jo: Glagolitic.Yo, // ⱖ
  ju: Glagolitic.Yu, // ⱓ
  jų: Glagolitic.Iotated_Big_Yus, // ⱙ

  // "ja": Glagolitic.Trokutasti_A, // ⱝ
  // "ja": "ⰹⰰ", zavisi od města?
  // "je": Glagolitic.Initial_Izhe + Glagolitic.Yestu, // ⰺⰵ
  // "ji": Glagolitic.Initial_Izhe + Glagolitic.I, // ⰺⰻ
  // "jy": Glagolitic.Initial_Izhe + Glagolitic.Izhe + Glagolitic.Yeru, // ⰺⰹⱏ

  k: Glagolitic.Kako, // ⰽ
  l: Glagolitic.Ljudije, // ⰾ
  m: Glagolitic.Myslite, // ⰿ
  mj: Glagolitic.Myslite + Glagolitic.Initial_Izhe, // ⰿⰺ
  n: Glagolitic.Nashi, // ⱀ
  o: Glagolitic.Onu, // ⱁ
  ȯ: Glagolitic.Yeru, // ⱏ
  p: Glagolitic.Pokoji, // ⱂ
  pj: Glagolitic.Pokoji + Glagolitic.Initial_Izhe, // ⱂⰺ
  r: Glagolitic.Ritsi, // ⱃ
  s: Glagolitic.Slovo, // ⱄ
  sj: Glagolitic.Slovo + Glagolitic.Initial_Izhe, // ⱄⰺ
  š: Glagolitic.Sha, // ⱎ
  t: Glagolitic.Tvrido, // ⱅ
  tj: Glagolitic.Tvrido + Glagolitic.Initial_Izhe, // ⱅⰺ
  θ: Glagolitic.Fita, // ⱚ
  u: Glagolitic.Uku, // ⱆ
  ų: Glagolitic.Big_Yus, // ⱘ
  ù: Glagolitic.Izhitsa, // ⱛ
  v: Glagolitic.Vedi, // ⰲ
  vj: Glagolitic.Vedi + Glagolitic.Initial_Izhe, // ⰲⰺ
  y: Glagolitic.Yeru + Glagolitic.Izhe, // ⱏⰹ
  z: Glagolitic.Zemlja, // ⰸ
  ž: Glagolitic.Zhivete, // ⰶ
});

const latn2glag4word = (word: string) =>
  izhefy(glagolify(ciafy(softener(word))));

export function latn2glag(text: string): string {
  return punctuate(replaceByWord(text, latn2glag4word));
}

// Extra rules:
// [ⱏⱐⰹ]ⰹ → [ⱏⱐⰹ]ⰺ
// [ⱌⱄ]ⰻ[ⰰⰵⱁⱆ] → [ⱌⱄ]ⰺ[ⰰⰵⱁⱆ]
// Pytanje: sjesti - Initial Izhe (з'їсти)

/*


*/
