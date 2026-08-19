import { mapStep, type Step } from '../steps.ts';
import { cyrillicBase } from './cyrillicBase.ts';

export const sr: readonly Step[] = [
  mapStep('sr-letters', { љ: 'lj', њ: 'nj', ј: 'j', ђ: 'dž', ћ: 'č', џ: 'dž' }),
  cyrillicBase,
];
