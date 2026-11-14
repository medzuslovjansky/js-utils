import type { NormalizeOptions } from './normalize-input.ts';
import { transliterate } from './transliterate.ts';

export type { NormalizeOptions } from './normalize-input.ts';

/** The two Latin alphabets a text can be normalized to. */
export type NormalizeTarget = 'etymolog' | 'standard';

const TARGETS = {
  etymolog: 'isv-Latn-x-etymolog',
  standard: 'isv-Latn',
} as const;

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
  target: NormalizeTarget,
  options?: NormalizeOptions,
): string {
  const lang = TARGETS[target];
  if (!lang) throw new TypeError(`Unsupported normalization target: ${target}`);

  return transliterate(text, lang, options);
}
