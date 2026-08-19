import type { Step } from './steps.ts';
import { isv } from './langs/isv.ts';
import { ru } from './langs/ru.ts';
import { be } from './langs/be.ts';
import { uk } from './langs/uk.ts';
import { pl } from './langs/pl.ts';
import { cs } from './langs/cs.ts';
import { sk } from './langs/sk.ts';
import { sl } from './langs/sl.ts';
import { hr } from './langs/hr.ts';
import { sr } from './langs/sr.ts';
import { mk } from './langs/mk.ts';
import { bg } from './langs/bg.ts';

export const LANGS = [
  'ru',
  'be',
  'uk',
  'pl',
  'cs',
  'sk',
  'sl',
  'hr',
  'sr',
  'mk',
  'bg',
] as const;

/** Slavic languages supported as the "other" side of the comparison. */
export type SupportedLang = (typeof LANGS)[number];

/** `'isv'` selects the etymology-folding pipeline for the Interslavic side. */
export type NormalizeLang = SupportedLang | 'isv';

export const PIPELINES: Record<NormalizeLang, readonly Step[]> = {
  isv,
  ru,
  be,
  uk,
  pl,
  cs,
  sk,
  sl,
  hr,
  sr,
  mk,
  bg,
};

/**
 * Bring a word to the canonical comparison alphabet: lowercase standard ISV Latin
 * (a–z without q/w/x, plus č š ž ě). NFC, lowercasing, trimming and whitespace
 * collapsing are language-independent invariants applied before the pipeline;
 * the named steps carry all language knowledge.
 */
export function normalize(word: string, lang: NormalizeLang): string {
  if (!Object.hasOwn(PIPELINES, lang)) {
    throw new RangeError(
      `Unsupported language "${String(lang)}"; expected one of: isv, ${LANGS.join(', ')}`,
    );
  }
  let result = word.normalize('NFC').toLowerCase().trim().replace(/\s+/g, ' ');
  for (const step of PIPELINES[lang]) {
    result = step.apply(result);
  }
  return result;
}
