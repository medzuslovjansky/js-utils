import { createReplacer } from './createReplacer';
import { Glagolitic } from '../constants';
import { replaceByWord } from './replaceByWord';

const punctuate = createReplacer({
  ';': '?',
  '։': '.',
  '·': ',',
  '⁖': '(',
  '჻': ')',
  '⸪': '"',
  '··': '!',
  '⸬': ':',
  '⁘': ';',
  '···': '...',
});

const softener = createReplacer({
  dь: 'ď',
  lь: 'ľ',
  nь: 'ń',
  rь: 'ŕ',
  sь: 'ś',
  tь: 'ť',
  zь: 'ź',
  ьr: 'ŕ',
  ȯr: 'r',
});

const yerify = (word: string) =>
  word.replace(/([dlnrstz])ь([cčklnr])/, '$1ė$2');

const deglagolify = createReplacer({
  [Glagolitic.Azu]: 'a',
  [Glagolitic.Otu]: 'å',
  [Glagolitic.Buky]: 'b',
  [Glagolitic.Tsi]: 'c',
  [Glagolitic.Chrivi]: 'č',
  [Glagolitic.Chrivi + Glagolitic.Yeri]: 'ć',
  [Glagolitic.Shta]: 'ć',
  [Glagolitic.Dobro]: 'd',
  [Glagolitic.Djervi]: 'đ',
  [Glagolitic.Dzelo]: 'ѕ',
  [Glagolitic.Yestu]: 'e',
  [Glagolitic.Yati]: 'ě',
  [Glagolitic.Small_Yus]: 'ę',
  [Glagolitic.Yeri]: 'ь',
  [Glagolitic.Fritu]: 'f',
  [Glagolitic.Glagoli]: 'g',
  [Glagolitic.Heru]: 'h',
  [Glagolitic.Spidery_Ha]: 'h',
  [Glagolitic.I]: 'i',
  [Glagolitic.Izhe]: 'j',
  [Glagolitic.Initial_Izhe]: 'j',
  [Glagolitic.Trokutasti_A]: 'ja',
  [Glagolitic.Iotated_Small_Yus]: 'ję',
  [Glagolitic.Yo]: 'jo',
  [Glagolitic.Yu]: 'ju',
  [Glagolitic.Iotated_Big_Yus]: 'jų',
  [Glagolitic.Kako]: 'k',
  [Glagolitic.Ljudije]: 'l',
  [Glagolitic.Myslite]: 'm',
  [Glagolitic.Latinate_Myslite]: 'm',
  [Glagolitic.Nashi]: 'n',
  [Glagolitic.Onu]: 'o',
  [Glagolitic.Yeru]: 'ȯ',
  [Glagolitic.Pokoji]: 'p',
  [Glagolitic.Ritsi]: 'r',
  [Glagolitic.Slovo]: 's',
  [Glagolitic.Sha]: 'š',
  [Glagolitic.Tvrido]: 't',
  [Glagolitic.Fita]: 'θ',
  [Glagolitic.Uku]: 'u',
  [Glagolitic.Big_Yus]: 'ų',
  [Glagolitic.Izhitsa]: 'ù',
  [Glagolitic.Vedi]: 'v',
  [Glagolitic.Yeri + Glagolitic.Izhe]: 'y',
  [Glagolitic.Yeru + Glagolitic.Izhe]: 'y',
  [Glagolitic.Zemlja]: 'z',
  [Glagolitic.Zhivete]: 'ž',
});

function glag2latn4word(word: string): string {
  return softener(yerify(deglagolify(word)));
}

export function glag2latn(text: string): string {
  return punctuate(replaceByWord(text, glag2latn4word));
}
