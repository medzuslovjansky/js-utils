import { ALL_LETTERS, ALL_CONSONANTS } from '../substitutions';

export function markFleetingVowel(word: string, add: string): string {
  let i = 0;

  const L = Math.min(word.length - 1, add.length);
  while (i < L && word[i] === add[i]) {
    i++;
  }

  if (word[i] !== add[i] && word[i + 1] === add[i]) {
    return replaceFleetingVowel(word, i);
  }

  return word;
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

    if (!replaced && isFleetingVowel(char)) {
      if (isLastSyllable(word, i, end)) {
        result = replaceFleetingVowel(result, i);
      }
    }

    i--;
  }

  return result;
}

function isFleetingVowel(char: string): boolean {
  return char === 'è' || char === 'ė' || char === 'ȯ' || char === 'ò';
}

function replaceFleetingVowel(word: string, j: number): string {
  const fleetingVowel = word[j].normalize('NFD')[0];
  return `${word.slice(0, j)}(${fleetingVowel})${word.slice(j + 1)}`;
}

function isLastSyllable(word: string, i: number, end: number): boolean {
  if (i === end - 2) return ALL_CONSONANTS.has(word[i + 1]);
  if (i === end - 3) return word[i + 1] === 'n' && word[i + 2] === 'j';
  return false;
}
