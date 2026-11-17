import { mapStep, prosody, regexStep, type Step } from '../steps.ts';
import { cyrillicBase } from './cyrillicBase.ts';

export const be: readonly Step[] = [
  prosody,
  // The context class includes ў (здароўе→zdarovje) and the apostrophe (аб'ект→abjekt):
  // both mark a following /je/ that я/ё/ю would carry on their own but е does not.
  regexStep('be-je', /(?<=^|[аеёіоуыэюяйў’'\s-])е/g, 'je'),
  {
    name: 'be-affricates',
    // dzekanne/tsekanne are the spelling of soft d/t: дзень→denj, быць→bytj
    apply: (word) =>
      word.replace(/дз(?=[еёіюяь])/g, 'д').replace(/ц(?=[еёіюяь])/g, 'т'),
  },
  // The apostrophe is jotation, not a segment — drop it AFTER be-je consumed it as
  // context; the iotated vowel supplies the glide itself (сям'я→sjamja).
  mapStep('be-letters', { ў: 'v', '’': '', "'": '' }),
  cyrillicBase,
];
