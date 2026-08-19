import { mapStep, regexStep, type Step } from '../steps.ts';
import { cyrillicBase } from './cyrillicBase.ts';

export const be: readonly Step[] = [
  regexStep('be-je', /(?<=^|[аеёіоуыэюяй\s-])е/g, 'je'),
  {
    name: 'be-affricates',
    // dzekanne/tsekanne are the spelling of soft d/t: дзень→denj, быць→bytj
    apply: (word) =>
      word.replace(/дз(?=[еёіюяь])/g, 'д').replace(/ц(?=[еёіюяь])/g, 'т'),
  },
  mapStep('be-letters', { ў: 'v' }),
  cyrillicBase,
];
