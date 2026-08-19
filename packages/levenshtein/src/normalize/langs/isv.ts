import { mapStep, type Step } from '../steps.ts';

const soften = mapStep('isv-soften', {
  ď: 'dj',
  ľ: 'lj',
  ĺ: 'lj',
  ń: 'nj',
  ś: 'sj',
  ť: 'tj',
  ź: 'zj',
  d́: 'dj', // d + combining acute (no precomposed form exists)
  t́: 'tj',
});

/**
 * Folds etymological/extended ISV orthography into the standard base
 * (a–z without q/w/x, plus č š ž ě). Extended graphemes never reach the comparison.
 */
export const isv: readonly Step[] = [
  // rare "Jan"/Slovianto letters, cf. deJanizator() chains cut down to the standard base
  mapStep('isv-rare', {
    '’': '',
    "'": '',
    ù: 'v',
    ḓ: '',
    è: 'e',
    ı: '',
    ò: 'o',
    ṙ: 'r',
  }),
  mapStep('isv-etymology', {
    å: 'a',
    ę: 'e',
    ų: 'u',
    ȯ: 'o',
    ė: 'e',
    ć: 'č',
    đ: 'dž',
  }),
  {
    name: 'isv-soften',
    // soft ŕ before a vowel is a j-glide (buŕa→burja), syllabic ŕ is plain r (sŕdce→srdce)
    apply: (word) =>
      soften
        .apply(word)
        .replace(/ŕ(?=[aeiouyě])/g, 'rj')
        .replace(/ŕ/g, 'r'),
  },
];
