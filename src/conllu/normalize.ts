import { XPOS } from './schema';

type NormalizerPatch = [
  string,
  string | undefined,
  string | undefined,
  string | undefined,
];
// [inputWord, inputXposSubstring, outputLemma, outputXpos]

const PATCHES: NormalizerPatch[] = [
  // Demonstratives (Normalizing variant lemmas to canonical lemma)
  ['onoj', 'pron.dem', 'onȯj', undefined],
  ['ona', 'pron.dem', 'onȯj', undefined],
  ['ono', 'pron.dem', 'onȯj', undefined],
  ['ta', 'pron.dem', 'tȯj', undefined],
  ['to', 'pron.dem', 'tȯj', undefined],
  ['ova', 'pron.dem', 'ov', undefined],
  ['ovo', 'pron.dem', 'ov', undefined],
  ['tamta', 'pron.dem', 'tamtȯj', undefined],
  ['tamto', 'pron.dem', 'tamtȯj', undefined],
  ['tuta', 'pron.dem', 'tutȯj', undefined],
  ['tuto', 'pron.dem', 'tutȯj', undefined],
  ['śa', 'pron.dem', 'sėj', undefined],
  ['se', 'pron.dem', 'sėj', undefined],

  // Indefinite -> Negative Corrections
  // We normalize the lemma (e.g. nikogo -> nikto) but we DO NOT patch XPOS to 'pron.neg.'
  // because that might break declensionPronoun logic which expects 'pron.indef.'.
  // Instead, we rely on PRONOUN_FEATURE_OVERRIDES to set PronType=Neg.
  ['nikto', 'pron.indef', 'nikto', undefined],
  ['ničto', 'pron.indef', 'ničto', undefined],
  ['nikogo', 'pron.indef', 'nikto', undefined],
  ['nijedin', 'pron.indef', 'nijedin', undefined],
  ['nijedna', 'pron.indef', 'nijedin', undefined],
  ['nijedno', 'pron.indef', 'nijedin', undefined],
  ['nikaky', 'pron.indef', 'nikaky', undefined],
  ['ničij', 'pron.indef', 'ničij', undefined],
  ['ničij', 'pron.poss', 'ničij', undefined],

  // Personal Pronoun Aliases (Context-free usually safe for these forms)
  ['mene', undefined, 'ja', undefined],
  ['tebe', undefined, 'ty', undefined],
  ['nas', undefined, 'my', undefined],
  ['vas', undefined, 'vy', undefined],
  ['se', 'pron. refl.', 'sebę', undefined],
  ['sę', undefined, 'sebę', undefined],
  ['sobě', undefined, 'sebę', undefined],

  // Possessive Pronoun Aliases
  // Only if xpos matches poss or context-free?
  // 'moja' could be 'moj' (Poss) or noun? No, usually unique.
  ['moja', undefined, 'moj', undefined],
  ['moje', undefined, 'moj', undefined],
  ['tvoja', undefined, 'tvoj', undefined],
  ['tvoje', undefined, 'tvoj', undefined],
  ['naša', undefined, 'naš', undefined],
  ['naše', undefined, 'naš', undefined],
  ['vaša', undefined, 'vaš', undefined],
  ['vaše', undefined, 'vaš', undefined],
  ['svoja', undefined, 'svoj', undefined],
  ['svoje', undefined, 'svoj', undefined],

  // Others from previous requests
  ['vśa', undefined, 'vėś', undefined],
  ['vśe', undefined, 'vėś', undefined],
  ['vse', undefined, 'vėś', undefined],
  ['žadna', undefined, 'žadėn', undefined],
  ['žadno', undefined, 'žadėn', undefined],
  ['čija', undefined, 'čij', undefined],
  ['čije', undefined, 'čij', undefined],

  // Auxiliary Verbs
  ['byti', undefined, 'byti', 'v.aux. ipf.'],
  ['jesm', undefined, 'byti', 'v.aux. ipf.'],
  ['je, jest', undefined, 'byti', 'v.aux. ipf.'],
  ['bųde/bųdųt', undefined, 'byti', 'v.aux. ipf.'],
  ['sųt', undefined, 'byti', 'v.aux. ipf.'],

  ['hotěti', 'v.aux. ipf.', undefined, 'v.intr. ipf.'],
  ['htěti', 'v.aux. ipf.', undefined, 'v.intr. ipf.'],
  ['iměti', 'v.aux. ipf.', undefined, 'v.tr. ipf.'],
  ['imati', 'v.aux. ipf.', undefined, 'v.tr. ipf.'],
  ['mogti', 'v.aux. ipf.', undefined, 'v.intr. ipf.'],
  ['morati', 'v.aux. ipf.', undefined, 'v.intr. ipf.'],
  ['musěti', 'v.aux. ipf.', undefined, 'v.intr. ipf.'],
  ['stavati', 'v.aux. ipf.', undefined, 'v.intr. ipf.'],
  ['trěbovati', 'v.aux. ipf.', undefined, 'v.intr. ipf.'],
  ['uměti', 'v.aux. ipf.', undefined, 'v.tr. ipf.'],
  ['smogti', 'v.aux. pf.', undefined, 'v.intr. pf.'],
  ['stati', 'v.aux. pf.', undefined, 'v.intr. pf.'],
];

export function normalize(
  word: string,
  xpos: XPOS,
): { word: string; xpos: XPOS } {
  for (const [pWord, pXpos, outLemma, outXpos] of PATCHES) {
    if (pWord === word) {
      if (!pXpos || (xpos && xpos.includes(pXpos))) {
        return {
          word: outLemma || word,
          xpos: outXpos || xpos,
        };
      }
    }
  }
  return { word, xpos };
}
