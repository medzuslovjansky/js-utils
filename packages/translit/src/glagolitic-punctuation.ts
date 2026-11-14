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
  '⁞': '|',
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
  '|': '⁞',
};

// longest first, so that `···` is not read as `·` three times
const GLAG_MARKS = /···|··|[;։·⁖჻⸪⸬⁘⁞]/g;
const LATN_MARKS = /\.\.\.|[?.,()"«»!:;…|]/g;

export const hasGlagolitic = (text: string): boolean => /[Ⰰ-ⱟ]/.test(text);

const isGlagLetter = (c: string | undefined): boolean => !!c && /[Ⰰ-ⱟ]/.test(c);
// the last character before `at`, not counting spaces or other `;`
const lastLetter = (text: string, at: number): string => {
  const before = text.slice(0, at).replace(/[;\s]+$/, '');
  return before[before.length - 1];
};
const isDigit = (c: string | undefined): boolean => !!c && /\d/.test(c);

// `;` is the question mark only after a Glagolitic word; elsewhere it stays
export const glagToLatnMarks = (text: string): string =>
  text.replace(GLAG_MARKS, (m, at: number) =>
    m === ';' && !isGlagLetter(lastLetter(text, at)) ? m : GLAG_TO_LATN[m],
  );

// a decimal point or comma inside a number is not punctuation, and `||` is
// Discord's spoiler markup, not the Glagolitic mark
export const latnToGlagMarks = (text: string): string =>
  text.replace(LATN_MARKS, (m, at: number) =>
    ((m === '.' || m === ',') &&
      isDigit(text[at - 1]) &&
      isDigit(text[at + 1])) ||
    (m === '|' && (text[at - 1] === '|' || text[at + 1] === '|'))
      ? m
      : LATN_TO_GLAG[m],
  );
