import type { NormalizeOptions } from './normalize-input.ts';
import { transliterate } from './transliterate.ts';

export type { NormalizeOptions } from './normalize-input.ts';

export interface NormalizeTextOptions extends NormalizeOptions {
  /**
   * The Latin alphabet to write: the etymological one or the standard one.
   * @default 'isv-Latn-x-etymolog'
   */
  output?: 'isv-Latn' | 'isv-Latn-x-etymolog';
}

/**
 * Reads a text in any supported spelling — ASCII fallbacks, Cyrillic,
 * Glagolitic, other orthographies' accents — and writes it in the Interslavic
 * Latin alphabet: the etymological one, or the standard one.
 *
 * It is `transliterate` to that alphabet and nothing else, so everything said
 * about one holds for the other. It only respells what is there: a text that
 * was not etymological gets no letters it did not have (`smysl` stays `smysl`
 * and does not become `sȯmysl`).
 */
export function normalize(
  text: string,
  { output = 'isv-Latn-x-etymolog', ...options }: NormalizeTextOptions = {},
): string {
  if (output !== 'isv-Latn' && output !== 'isv-Latn-x-etymolog') {
    throw new TypeError(`Unsupported normalization output: ${output}`);
  }

  return transliterate(text, output, options);
}
