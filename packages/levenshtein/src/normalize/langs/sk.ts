import { mapStep, type Step } from '../steps.ts';

export const sk: readonly Step[] = [
  mapStep('sk-gh', { ch: 'h', h: 'g' }),
  // ľ is soft (ľud→ljud), ĺ/ŕ are long syllabic (stĺp→stlp, vŕba→vrba);
  // sk dz is the dj-reflex = ISV dž (medzi→medži vs ISV medžu)
  mapStep('sk-soft', {
    ď: 'dj',
    ť: 'tj',
    ň: 'nj',
    ľ: 'lj',
    ĺ: 'l',
    ŕ: 'r',
    dz: 'dž',
  }),
  // ä is ISV ę→e (mäso→meso), ie is the jat diphthong (chlieb→hlěb)
  mapStep('sk-vowels', {
    ie: 'ě',
    ä: 'e',
    ô: 'o',
    á: 'a',
    é: 'e',
    í: 'i',
    ý: 'y',
    ú: 'u',
    ó: 'o',
  }),
];
