import { mapStep, type Step } from '../steps.ts';
import { cyrillicBase } from './cyrillicBase.ts';

export const bg: readonly Step[] = [
  // ъ is a vowel (yer), like ISV ȯ→o: сън→son. щ is /ʃt/: щука→štuka.
  mapStep('bg-letters', { щ: 'št', ъ: 'o' }),
  cyrillicBase,
];
