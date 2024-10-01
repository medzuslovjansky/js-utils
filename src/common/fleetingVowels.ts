import {
  ALL_LETTERS,
  ALL_CONSONANTS,
  HARD_YER_LOOSE,
  SOFT_YER_LOOSE,
  YERS,
  VOCALIZED,
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
    let char = word[i];
    if (!ALL_LETTERS.has(char)) {
      end = i;
      replaced = false;
    }

    if (char === 'e' && i === end - 2 && word[i + 1] === 'c') {
      char = 'ė';
    }

    if (!replaced && YERS.has(char)) {
      if (isFleetingSyllable(word, i, end) && canOmitYer(word, i)) {
        result = replaceFleetingVowel(result, i);
      }
    }

    i--;
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

function isLN(char: string): boolean {
  return char === 'l' || char === 'L' || char === 'n' || char === 'N';
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

function isFleetingSyllable(word: string, i: number, end: number): boolean {
  if (i === end - 2) return ALL_CONSONANTS.has(word[i + 1]);
  if (i === end - 3) return word[i + 1] === 'n' && word[i + 2] === 'j';
  return false;
}

function canOmitYer(word: string, i: number): boolean {
  const p1 = word[i - 1];
  const p2 = word[i - 2];
  const p3 = word[i - 3];
  const a = p1 === 'j' && isLN(p2) ? p3 : p2;
  const b = p1 === 'j' && isLN(p2) ? p2 : p1;

  return (!ALL_LETTERS.has(a) || VOCALIZED.has(a)) && b !== word[i + 1];
}
