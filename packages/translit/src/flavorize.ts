import { createReplacer } from './createReplacer.ts';

/**
 * Interslavic has one full "etymological" alphabet and a handful of flavours
 * that are lossy projections of it: standard ('3') drops the nasals, slovianto
 * ('4') drops more on top of that, and the northern ('S') / southern ('J')
 * flavours each apply their own, independent projection. `flavorize` changes
 * letters only, never script.
 */
export type Flavour = '1' | '2' | '3' | '4' | 'S' | 'J';

/**
 * Etymological ('2') is the identity projection plus a couple of spelling
 * simplifications. Two passes because the second one — "e after a sibilant
 * loses its softness mark" — must see the `ě` the first pass produces from
 * `ê`, not just the `ě` that was already there.
 */
const etymologicalBase = createReplacer({
  ê: 'ě',
  ŭ: 'v',
  ṱ: '',
  ḓ: '',
  '’': '#%',
  '`': '#%',
});
const etymologicalSibilantE = createReplacer({
  čě: 'če',
  šě: 'še',
  žě: 'že',
  jě: 'je',
});
const etymological = (word: string) =>
  etymologicalSibilantE(etymologicalBase(word));

/** Standard ('3') is etymological plus dropping the remaining soft/nasal letters. */
const standardExtra = createReplacer({
  ę: 'e',
  ė: 'e',
  å: 'a',
  ȯ: 'o',
  ų: 'u',
  ć: 'č',
  đ: 'dž',
  ř: 'r',
  ľ: 'l',
  ń: 'n',
  ť: 't',
  ď: 'd',
  ś: 's',
  ź: 'z',
});
const standard = (word: string) => standardExtra(etymological(word));

/** Slovianto ('4') is standard plus flattening `ě` and `y` too. */
const sloviantoExtra = createReplacer({ ě: 'e', y: 'i' });
const slovianto = (word: string) => sloviantoExtra(standard(word));

/**
 * Northern ('S') and southern ('J') are not layered on standard — v1 treats
 * them as their own, independent projections of the etymological alphabet,
 * and each keeps distinctions the other branches erase (e.g. northern keeps
 * `ť`/`ď` where standard flattens them). The one rule they share verbatim —
 * "e after a sibilant or `c` loses its softness mark" — is factored out
 * below; everything else is written once, where v1 writes it once.
 */
const SIBILANT_E_WITH_C = {
  šě: 'še',
  žě: 'že',
  čě: 'če',
  cě: 'ce',
  jě: 'je',
};

/**
 * Northern, pass 1: unconditional single-letter swaps. Pass 2 needs this
 * pass to have already run twice over: the `ę`-after-sibilant rule's class
 * includes `č`, which this pass can produce from `ć`, and — unlike
 * etymological, where `ê`/`ė` land on `ě` — northern sends them straight to
 * `e`, so there is no plain `ě` left for pass 2 to flatten unconditionally.
 */
const northernBase = createReplacer({
  ć: 'č',
  đ: 'dž',
  ṱ: 't',
  ḓ: 'd',
  ê: 'e',
  ė: 'e',
  å: 'o',
  ȯ: 'o',
  ų: 'u',
  ŭ: 'v',
});
const northernContext = createReplacer({
  šę: 'ša',
  žę: 'ža',
  čę: 'ča',
  cę: 'ca',
  ję: 'ja',
  ę: 'ja',
  ...SIBILANT_E_WITH_C,
  'ŕ%': 'r%',
  'ṙ%': 'r%',
  ṙ: 'or',
  ŕ: 'er',
  ky: 'ki',
  gy: 'gi',
  hy: 'hi',
  '’': '#%',
  '`': '#%',
});
const northern = (word: string) => northernContext(northernBase(word));

/**
 * Southern, pass 1: unconditional swaps, including `ê`→`ě` (southern, unlike
 * northern, keeps the `ě` step). Pass 2 is the shared sibilant-`ě` rule,
 * which needs pass 1's `ě` — the one `ê` just turned into — to already be
 * there.
 */
const southernBase = createReplacer({
  ų: 'u',
  ŭ: 'v',
  ľ: 'l',
  ř: 'r',
  ń: 'n',
  ť: 't',
  ď: 'd',
  ś: 's',
  ź: 'z',
  šč: 'št',
  ṱ: '',
  ḓ: '',
  å: 'a',
  ę: 'e',
  ė: 'e',
  ê: 'ě',
  y: 'i',
  '’': '#%',
  '`': '#%',
  ı: '',
});
const southernSibilantE = createReplacer({ ...SIBILANT_E_WITH_C });
const southern = (word: string) => southernSibilantE(southernBase(word));

/**
 * Extended notation ('1') keeps everything: v1 has no branch for it, so a word
 * passes through untouched, and the whole distinction lives downstream in the
 * iotated Cyrillic spelling. Reachable as `isv-Cyrl-x-iotated-ext`.
 */
const extended = (word: string) => word;

const FLAVORIZERS: Record<Flavour, (word: string) => string> = {
  '1': extended,
  '2': etymological,
  '3': standard,
  '4': slovianto,
  S: northern,
  J: southern,
};

export function flavorize(word: string, flavour: Flavour): string {
  return FLAVORIZERS[flavour](word);
}
