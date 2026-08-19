import { mapStep, type Step } from '../steps.ts';

export const cs: readonly Step[] = [
  // Czech h descends from g (hora→gora), ch is ISV h (chleba→hleba);
  // safe in one map: a single pass never rescans its own output
  mapStep('cs-gh', { ch: 'h', h: 'g' }),
  mapStep('cs-soft', { ř: 'rj', ď: 'dj', ť: 'tj', ň: 'nj' }),
  // vowel length is irrelevant for intelligibility; ou is ISV ų (soud→sud);
  // native č š ž ě are already canonical and pass through (město→město)
  mapStep('cs-vowels', {
    ou: 'u',
    ů: 'u',
    á: 'a',
    é: 'e',
    í: 'i',
    ý: 'y',
    ú: 'u',
    ó: 'o',
  }),
];
