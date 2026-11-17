import { prosody, regexStep, type Step } from '../steps.ts';
import { cyrillicBase, pleophony } from './cyrillicBase.ts';

export const ru: readonly Step[] = [
  prosody,
  pleophony,
  // ж ч ш щ are unpaired for palatalization: ь after them is pure orthography
  // (ночь→noč, ешь→ješ). The lookahead keeps ь before an iotated vowel, where it
  // must survive to feed the base composites (ночью→ью→ju, чьи→ьи→ji).
  regexStep('ru-hushers-soft-sign', /(?<=[жчшщ])ь(?![еёюяи])/g, ''),
  {
    name: 'ru-hushers-glide',
    // after hushers the iotated ё/ю carry no glide: шёпот→šopot, жюри→žuri,
    // парашют→parašut. (я after hushers is not written; е is already safe — ru-je
    // fires only after vowels.) Replace with plain о/у and let the base finish.
    apply: (word) =>
      word.replace(/(?<=[жчшщ])ё/g, 'о').replace(/(?<=[жчшщ])ю/g, 'у'),
  },
  // Word-initial or post-vocalic е is /je/ (единство→jedinstvo); after a consonant it
  // stays e (берег→bereg). The context class excludes ь/ъ because the base
  // composites ье/ъе already yield je (варенье→varenje, съезд→sjezd).
  // adjective -ый/-ий is ISV -y/-i (бедный→bedny); -ий only after velars and
  // hushers, where ы is not written, so loan nouns keep it (гений→genij)
  regexStep('ru-adj', /(?<=ы|\S\S[кгхжшчщ]и)й(?=$|\s)/g, ''),
  regexStep('ru-je', /(?<=^|[аеёиоуыэюяй\s-])е/g, 'je'),
  cyrillicBase,
];
