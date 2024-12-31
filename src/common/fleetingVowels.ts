import {
  ALL_CONSONANTS,
  ALL_LETTERS,
  HARD_YER_LOOSE,
  SOFT_YER_LOOSE,
  VOCALIZED,
  YERS,
} from '../substitutions';
import { soften } from './soften';

export function markFleetingVowel(word: string, add: string): string {
  let i = 0;

  const L = Math.min(word.length - 1, add.length);
  while (i < L && word[i] === add[i]) {
    i++;
  }

  if (word[i] !== add[i]) {
    if (word[i + 1] === add[i]) {
      return replaceFleetingVowel(word, i);
    }

    if (word[i + 1] === add[i + 1] && isLJNJ(add, i - 1)) {
      return replaceFleetingVowel(word, i);
    }
  }

  return word;
}

export function inferFleetingVowel(word: string): string {
  let end = word.length;
  let result = word;

  for (let i = end - 1; i >= 0; i--) {
    const char = word[i];
    if (isNonLetter(char)) {
      end = i;
      continue;
    }

    if (YERS.has(char) || isEC(word, i, end)) {
      if (isLastSyllable(word, i, end) && canOmitYer(word, i)) {
        result = replaceFleetingVowel(result, i);
      }
    }
  }

  return result;
}

function replaceFleetingVowel(word: string, j: number): string {
  const consonant = shouldSoftenPreceedingConsonant(word, j)
    ? soften(word[j - 1])
    : word[j - 1];

  const before = word.slice(0, j - 1);
  const after = word.slice(j + 1);
  return `${before}${consonant}${toBracketNotation(word[j])}${after}`;
}

function shouldSoftenPreceedingConsonant(word: string, i: number): boolean {
  return isLN(word, i - 1) && SOFT_YER_LOOSE.has(word[i]);
}

function toBracketNotation(maybeYer: string): string {
  if (SOFT_YER_LOOSE.has(maybeYer)) {
    return '(e)';
  }

  if (HARD_YER_LOOSE.has(maybeYer)) {
    return '(o)';
  }

  return maybeYer;
}

function isLastSyllable(word: string, i: number, end: number): boolean {
  if (i === end - 2) return ALL_CONSONANTS.has(word[i + 1]);
  if (i === end - 3) return isLJNJ(word, i + 1);
  return false;
}

/**
 * Checks if the yer can be omitted in the word.
 *
 * @param word - The word to check.
 * @param i - The index of the yer.
 * @returns True if the yer can be omitted.
 */
function canOmitYer(word: string, i: number): boolean {
  const [c2, c1] = isLJNJ(word, i - 2)
    ? [word[i - 3], word[i - 2]]
    : [word[i - 2], word[i - 1]];

  return (isNonLetter(c2) || VOCALIZED.has(c2)) && c1 !== word[i + 1];
}

function isNonLetter(char: string): boolean {
  return !ALL_LETTERS.has(char);
}

function isLJNJ(word: string, i: number): boolean {
  return i >= 0 && word[i + 1] === 'j' && isLN(word, i);
}

function isLN(word: string, i: number): boolean {
  const c = word[i];
  return c === 'l' || c === 'n' || c === 'L' || c === 'N';
}

function isEC(word: string, i: number, end: number): boolean {
  return i > 0 && word[i] === 'e' && word[i + 1] === 'c' && i === end - 2;
}
