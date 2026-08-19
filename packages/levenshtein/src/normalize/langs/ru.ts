import { regexStep, type Step } from '../steps.ts';
import { cyrillicBase } from './cyrillicBase.ts';

export const ru: readonly Step[] = [
  // Word-initial or post-vocalic е is /je/ (единство→jedinstvo); after a consonant it
  // stays e (берег→bereg). The context class excludes ь/ъ because the base
  // composites ье/ъе already yield je (варенье→varenje, съезд→sjezd).
  regexStep('ru-je', /(?<=^|[аеёиоуыэюяй\s-])е/g, 'je'),
  cyrillicBase,
];
