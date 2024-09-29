import {
  ALL_LETTERS,
  ALL_CONSONANTS,
  HARD_YER_LOOSE,
  SOFT_YER_LOOSE,
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

    if (word[i + 1] === add[i + 1] && hasLJNJ(add, i - 1)) {
      return replaceFleetingVowel(word, i);
    }
  }

  return word;
}

function hasLJNJ(str: string, index: number) {
  const [ln, j] = str.toLowerCase().slice(index, index + 2);
  return j === 'j' && (ln === 'l' || ln === 'n');
}

export function inferFleetingVowel(word: string): string {
  let i = word.length - 1;
  let end = word.length;
  let replaced = false;
  let result = word;

  while (i > 0) {
    const char = word[i];
    if (!ALL_LETTERS.has(char)) {
      end = i;
      replaced = false;
    }

    if (!replaced && YERS.has(char)) {
      if (isLastSyllable(word, i, end)) {
        result = replaceFleetingVowel(result, i);
      }
    }

    i--;
  }

  if (!replaced && word.endsWith('ec')) {
    result = replaceFleetingVowel(result, word.length - 2);
  }

  return result;
}

function replaceFleetingVowel(word: string, j: number): string {
  const fleetingVowel = yerToFleetingVowel(word[j]);
  const before = word.slice(0, j - 1);
  const consonant =
    isL(word[j - 1]) && fleetingVowel === '(e)'
      ? soften(word[j - 1])
      : word[j - 1];
  const after = word.slice(j + 1);
  return `${before}${consonant}${fleetingVowel}${after}`;
}

function isL(char: string): boolean {
  return char === 'l' || char === 'L';
}

function yerToFleetingVowel(maybeYer: string): string {
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
  if (i === end - 3) return word[i + 1] === 'n' && word[i + 2] === 'j';
  return false;
}
