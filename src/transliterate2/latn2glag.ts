// noinspection NonAsciiCharacters,JSNonASCIINames

import { createReplacer } from './createReplacer';
import { Glagolitic } from '../constants';
import { replaceByWord } from './replaceByWord';
import { syllabicR } from './syllabicR';

export interface Latn2GlagOptions {
  /** @default false */
  latinateMyslite?: boolean;
  /** @default true */
  shta?: boolean;
}

function optionsToInt({ latinateMyslite, shta }: Required<Latn2GlagOptions>) {
  const b0 = latinateMyslite ? 1 : 0;
  const b1 = shta ? 2 : 0;

  return b0 | b1;
}

type Glagolitizer = (word: string) => string;

const MEMO: Record<number, Glagolitizer> = {};

const desoftener = createReplacer({
  ď: 'dь',
  ľ: 'lь',
  lj: 'lь',
  ń: 'nь',
  nj: 'nь',
  ŕ: 'rь',
  ś: 'sь',
  ť: 'tь',
  ź: 'zь',
  Ŕ: 'ьr',
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
  [Glagolitic.Yeri + Glagolitic.Izhe]:
    Glagolitic.Yeri + Glagolitic.Initial_Izhe,
  [Glagolitic.Izhe + Glagolitic.Izhe]:
    Glagolitic.Izhe + Glagolitic.Initial_Izhe,
});

function buildGlagolitizer({
  latinateMyslite = false,
  shta = false,
}: Latn2GlagOptions) {
  const id = optionsToInt({ latinateMyslite, shta });
  if (!MEMO[id]) {
    const glagolify = createReplacer({
      a: Glagolitic.Azu, // ⰰ
      å: Glagolitic.Otu, // ⱉ
      b: Glagolitic.Buky, // ⰱ
      c: Glagolitic.Tsi, // ⱌ
      ć: shta ? Glagolitic.Shta : Glagolitic.Chrivi + Glagolitic.Yeri, // ⱋ | ⱍⱐ
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
      k: Glagolitic.Kako, // ⰽ
      l: Glagolitic.Ljudije, // ⰾ
      m: latinateMyslite ? Glagolitic.Latinate_Myslite : Glagolitic.Myslite, // ⰿ
      mj:
        (latinateMyslite ? Glagolitic.Latinate_Myslite : Glagolitic.Myslite) +
        Glagolitic.Initial_Izhe, // ⰿⰺ
      n: Glagolitic.Nashi, // ⱀ
      o: Glagolitic.Onu, // ⱁ
      ȯ: Glagolitic.Yeru, // ⱏ
      p: Glagolitic.Pokoji, // ⱂ
      pj: Glagolitic.Pokoji + Glagolitic.Initial_Izhe, // ⱂⰺ
      r: Glagolitic.Ritsi, // ⱃ
      R: Glagolitic.Yeru + Glagolitic.Ritsi, // ⱏⱃ
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

    MEMO[id] = (word) => izhefy(glagolify(desoftener(syllabicR(word))));
  }

  return MEMO[id]!;
}

const DEFAULT_OPTIONS: Required<Latn2GlagOptions> = {
  latinateMyslite: false,
  shta: true,
};

export function latn2glag(text: string, options = DEFAULT_OPTIONS): string {
  return punctuate(replaceByWord(text, buildGlagolitizer(options)));
}
