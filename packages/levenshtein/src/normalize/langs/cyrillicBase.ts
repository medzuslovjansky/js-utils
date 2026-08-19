import { mapStep, type Step } from '../steps.ts';

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
