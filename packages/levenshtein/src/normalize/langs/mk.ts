import { mapStep, prosody, type Step } from '../steps.ts';
import { cyrillicBase } from './cyrillicBase.ts';

export const mk: readonly Step[] = [
  prosody,
  mapStep('mk-letters', {
    љ: 'lj',
    њ: 'nj',
    ј: 'j',
    ѓ: 'dž',
    ќ: 'č',
    џ: 'dž',
    ѕ: 'z',
  }),
  cyrillicBase,
];
