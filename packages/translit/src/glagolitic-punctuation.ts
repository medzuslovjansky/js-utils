/**
 * Glagolitic has its own punctuation. The letter engine only ever sees runs
 * of letters, so the marks are mapped here, on the whole text: Glagolitic
 * marks to Latin ones whenever the source contains Glagolitic, and Latin
 * marks to Glagolitic ones whenever the target is Glagolitic. Both together
 * give Glag → Glag a clean round trip.
 */
const GLAG_TO_LATN: Record<string, string> = {
  ';': '?',
  '։': '.',
  '·': ',',
  '⁖': '(',
  '჻': ')',
  '⸪': '"',
  '··': '!',
  '⸬': ':',
  '⁘': ';',
  '···': '...',
};

const LATN_TO_GLAG: Record<string, string> = {
  '?': ';',
  '.': '։',
  ',': '·',
  '(': '⁖',
  ')': '჻',
  '"': '⸪',
  '«': '⸪',
  '»': '⸪',
  '!': '··',
  ':': '⸬',
  ';': '⁘',
  '...': '···',
  '…': '···',
};

// longest first, so that `···` is not read as `·` three times
const GLAG_MARKS = /···|··|[;։·⁖჻⸪⸬⁘]/g;
const LATN_MARKS = /\.\.\.|[?.,()"«»!:;…]/g;

export const hasGlagolitic = (text: string): boolean => /[Ⰰ-ⱟ]/.test(text);

export const glagToLatnMarks = (text: string): string =>
  text.replace(GLAG_MARKS, (m) => GLAG_TO_LATN[m]);

export const latnToGlagMarks = (text: string): string =>
  text.replace(LATN_MARKS, (m) => LATN_TO_GLAG[m]);
