/**
 * Glagolitic letters as numbers, 1 to 999 999.
 *
 * Hundreds come first, then tens and units, except that 11 to 19 put the unit
 * before the ten: 19 is ⰸⰺ. ⱍ is 1000, and a number before it counts the
 * thousands: ⰱⱍ is 2000, ⰺⱍ is 10 000, ⱍⰱ is 1002. There is no zero.
 *
 * A number is told from a word by a titlo (U+0483) over every letter, by a
 * middle dot on each side, or by both: ⰸ҃ⰺ҃, ·ⰸⰺ·, ·ⰸ҃ⰺ҃·. That is what is
 * written. Read as well are a single titlo at the end (ⰸⰺ҃), the other izhe
 * for 10, and the late Croatian letters for 2000 to 5000 (ⱎ, ⱏ, ⱑ, ⱓ).
 *
 * This is its own pass over the text, either side of the word-by-word
 * pipeline: digits are not letters, so that pipeline never sees them.
 */
const UNITS = [...'ⰰⰱⰲⰳⰴⰵⰶⰷⰸ'];
const TENS = [...'ⰺⰻⰼⰽⰾⰿⱀⱁⱂ'];
const HUNDREDS = [...'ⱃⱄⱅⱆⱇⱈⱉⱋⱌ'];
const THOUSAND = 'ⱍ';
const OLD_THOUSANDS = 'ⱎⱏⱑⱓ'; // 2000 to 5000, read but never written
const TITLO = '҃';

export type GlagoliticNumeralStyle = 'titlo' | 'dots' | 'dots-titlo';

const titled = (letters: string) => [...letters].join(TITLO) + TITLO;

export const GLAGOLITIC_NUMERAL_STYLES: Record<
  GlagoliticNumeralStyle,
  (letters: string) => string
> = {
  titlo: titled,
  dots: (letters) => `·${letters}·`,
  'dots-titlo': (letters) => `·${titled(letters)}·`,
};

// 0 to 999; zero is no letters at all
const TO_LETTERS = [''];
const FROM_LETTERS = new Map([['', 0]]);

for (let n = 1; n <= 999; n++) {
  const hundred = HUNDREDS[Math.floor(n / 100) - 1] ?? '';
  const ten = TENS[Math.floor((n % 100) / 10) - 1] ?? '';
  const unit = UNITS[(n % 10) - 1] ?? '';
  const teen = n % 100 > 10 && n % 100 < 20;
  const letters = hundred + (teen ? unit + ten : ten + unit);

  TO_LETTERS.push(letters);
  FROM_LETTERS.set(letters, n);
}

function toLetters(n: number): string {
  if (n < 1000) return TO_LETTERS[n];

  const thousands = Math.floor(n / 1000);
  // one thousand is the bare ⱍ
  return (
    TO_LETTERS[thousands % 1000 > 1 ? thousands : 0] +
    THOUSAND +
    TO_LETTERS[n % 1000]
  );
}

function fromLetters(letters: string): number | undefined {
  const at = letters.indexOf(THOUSAND);
  const old = OLD_THOUSANDS.indexOf(letters[0]);
  // what counts the thousands, and what is left after them; a number before
  // ⱍ is never zero, since it is at least one letter
  const [thousands, rest] =
    at > 0
      ? [FROM_LETTERS.get(letters.slice(0, at)), letters.slice(at + 1)]
      : at === 0
        ? [1, letters.slice(1)]
        : old >= 0
          ? [old + 2, letters.slice(1)]
          : [0, letters];
  const below = FROM_LETTERS.get(rest);

  return thousands === undefined || below === undefined
    ? undefined
    : thousands * 1000 + below;
}

// A run of digits standing on its own: not glued to a letter, and not one side
// of a decimal point or comma. Only 1 to 999 999, written without leading
// zeros, becomes letters; anything else is left as digits.
const DIGITS = /(?<![\p{L}\p{M}\d]|\d[.,])\d+(?![\p{L}\p{M}\d]|[.,]\d)/gu;
const WRITABLE = /^[1-9]\d{0,5}$/;

// A whole Glagolitic word, either between two dots or ending in a titlo. A
// dot with a letter on its other side (ⰰ·ⰲ·ⰱ) is a comma.
const NUMERAL =
  /(?<![\p{L}\p{M}])(?:·(?:[Ⰰ-ⱟ]҃?)+·|(?:[Ⰰ-ⱟ]҃?)*[Ⰰ-ⱟ]҃)(?![\p{L}\p{M}])/gu;

/** `19` → `ⰸ҃ⰺ҃`, for every number from 1 to 999 999 standing on its own. */
export function toGlagoliticNumerals(
  text: string,
  style: GlagoliticNumeralStyle = 'titlo',
): string {
  const mark = GLAGOLITIC_NUMERAL_STYLES[style];

  return text.replace(DIGITS, (digits) =>
    WRITABLE.test(digits) ? mark(toLetters(Number(digits))) : digits,
  );
}

/**
 * `ⰸ҃ⰺ҃`, `ⰸⰺ҃`, `·ⰸⰺ·`, `·ⰸ҃ⰺ҃·` → `19`, for every word that is a well-formed
 * number, however it is marked.
 *
 * With `strict`, only a titlo over every letter makes a number (`ⰸ҃ⰺ҃`,
 * `·ⰸ҃ⰺ҃·`, `ⰶ҃`): the one mark that is not also something else. A lone titlo
 * at the end may close an abbreviation, and a dot is also the comma.
 */
export function fromGlagoliticNumerals(text: string, strict = false): string {
  return text.replace(NUMERAL, (word) => {
    const bare = word.replace(/·/g, '');
    const letters = bare.replaceAll(TITLO, '');
    const titlos = bare.length - letters.length;
    // A titlo over every letter, one at the end, or (between dots) none.
    // Anything else, such as ⰿ҃ⱄ, is an abbreviation.
    const marked =
      titlos === letters.length ||
      (!strict && (titlos === 0 || (titlos === 1 && bare.endsWith(TITLO))));
    const value = marked
      ? fromLetters(letters.toLowerCase().replaceAll('ⰹ', 'ⰺ'))
      : undefined;

    return value === undefined ? word : String(value);
  });
}
