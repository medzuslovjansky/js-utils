import { mapStep, type Step } from '../steps.ts';
import { cyrillicBase } from './cyrillicBase.ts';

export const uk: readonly Step[] = [
  // и=y, і=i (світ→svit vs ISV svět); г stays g — ISV g corresponds to uk г
  // (гора↔gora), confirmed by the quick/uk flavorizer. The apostrophe is dropped:
  // the following iotated vowel supplies the glide itself (м’ята→mjata).
  mapStep('uk-letters', {
    и: 'y',
    і: 'i',
    ї: 'ji',
    є: 'je',
    ґ: 'g',
    '’': '',
    "'": '',
  }),
  cyrillicBase,
];
