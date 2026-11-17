import { mapStep, type Step } from '../steps.ts';

const PLEOPHONY: Readonly<Record<string, string>> = {
  оро: 'рå',
  оло: 'лå',
  ере: 'рě',
  ерё: 'рě',
};

/**
 * East Slavic pleophony (ru/uk) between consonants folds to the ISV metathesis
 * reflex: город→gråd, голова→glåva, берег→brěg, берёза→brěza. å is kept as its
 * own grapheme (cheap to both a and o, see weights.ts), so the folded word still
 * sits close to pl gród and hr grad. еле is left out: loans and non-pleophonic
 * words dominate it (телефон, зелёный). Known cost, accepted by the bench: loans
 * with оро/оло/ере (корона→kråna, интерес→intrěs) and inherited *CerC with a
 * genuine vowel (череп→črěp vs ISV čerep).
 */
export const pleophony: Step = {
  name: 'pleophony',
  apply: (word) =>
    word.replace(
      /(?<=[бвгджзклмнпрстфхцчшщ])(?:оро|оло|ер[её])(?=[бвгджзклмнпрстфхцчшщ])/g,
      (m) => PLEOPHONY[m]!,
    ),
};

/**
 * Shared Cyrillic → ISV-Latin base for ru/be/uk/sr/mk/bg. Language-specific steps run
 * BEFORE this one and consume the letters whose reading diverges (uk и→y, bg ъ→o, …).
 *
 * Softness is always a j-glide, never a droppable indel: the composite soft/hard-sign
 * + iotated-vowel keys yield a single glide (судья→sudja, not sudjja), and я/ю/ё carry
 * their own glide (тюрма→tjurma).
 */
export const cyrillicBase: Step = mapStep('cyrillic-base', {
  ья: 'ja',
  ье: 'je',
  ьё: 'jo',
  ью: 'ju',
  ьи: 'ji',
  ьо: 'jo',
  ъе: 'je',
  ъя: 'ja',
  ъю: 'ju',
  ъё: 'jo',
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ж: 'ž',
  з: 'z',
  и: 'i',
  й: 'j',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'č',
  ш: 'š',
  щ: 'šč',
  ы: 'y',
  э: 'e',
  і: 'i',
  ї: 'ji',
  ј: 'j',
  я: 'ja',
  ю: 'ju',
  ё: 'jo',
  ь: 'j',
  ъ: '',
});
