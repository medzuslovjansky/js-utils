import { mapStep, prosody, regexStep, type Step } from '../steps.ts';
import { cyrillicBase, pleophony } from './cyrillicBase.ts';

export const uk: readonly Step[] = [
  prosody,
  pleophony,
  // adjective -ий is ISV -y (бідний→bidny); nouns use -ій (геній), short
  // pronouns are guarded by the stem length (чий, який)
  regexStep('uk-adj', /(?<=\S{3}и)й(?=$|\s)/g, ''),
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
