/**
 * Glagolitic letters as numbers, 1 to 999.
 *
 * A number is a word marked with a titlo (U+0483); without the mark the same
 * letters are a word. Hundreds come first, then tens, then units, except that
 * 11 to 19 put the unit before the ten: 19 is ⰸⰺ҃. There is no zero.
 *
 * This is its own pass over the text, either side of the word-by-word
 * pipeline: digits are not letters, so that pipeline never sees them.
 */
const UNITS = [...'ⰰⰱⰲⰳⰴⰵⰶⰷⰸ'];
const TENS = [...'ⰺⰻⰼⰽⰾⰿⱀⱁⱂ'];
const HUNDREDS = [...'ⱃⱄⱅⱆⱇⱈⱉⱋⱌ'];
const TITLO = '҃';

const TO_GLAGOLITIC = new Map<string, string>();
const FROM_GLAGOLITIC = new Map<string, string>();

for (let n = 1; n <= 999; n++) {
  const hundred = HUNDREDS[Math.floor(n / 100) - 1] ?? '';
  const ten = TENS[Math.floor((n % 100) / 10) - 1] ?? '';
  const unit = UNITS[(n % 10) - 1] ?? '';
  const teen = n % 100 > 10 && n % 100 < 20;
  const numeral = hundred + (teen ? unit + ten : ten + unit) + TITLO;

  TO_GLAGOLITIC.set(String(n), numeral);
  FROM_GLAGOLITIC.set(numeral, String(n));
}

// A run of digits standing on its own: not glued to a letter, and not one side
// of a decimal point or comma. Only 1 to 999, written without leading zeros,
// is in the table; anything else is left as digits.
const DIGITS = /(?<![\p{L}\p{M}\d]|\d[.,])\d+(?![\p{L}\p{M}\d]|[.,]\d)/gu;

// A whole Glagolitic word of up to three letters with the titlo at its end,
// which is where `toGlagoliticNumerals` puts it. A titlo elsewhere in a word
// marks an abbreviation (ⰿ҃ⱄ) and is not read as a number.
const NUMERAL = /(?<![\p{L}\p{M}])[Ⰰ-ⱟ]{1,3}҃(?![\p{L}\p{M}])/gu;

/** `19` → `ⰸⰺ҃`, for every number from 1 to 999 standing on its own. */
export function toGlagoliticNumerals(text: string): string {
  return text.replace(DIGITS, (digits) => TO_GLAGOLITIC.get(digits) ?? digits);
}

/** `ⰸⰺ҃` → `19`, for every word that is a well-formed number from 1 to 999. */
export function fromGlagoliticNumerals(text: string): string {
  return text.replace(
    NUMERAL,
    (word) => FROM_GLAGOLITIC.get(word.toLowerCase()) ?? word,
  );
}
