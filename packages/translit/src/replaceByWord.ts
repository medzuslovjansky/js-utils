import { normalize } from './normalize.ts';

export function replaceByWord(
  text: string,
  replacer: (word: string) => string,
): string {
  return text.replace(/[\p{Letter}\p{Mark}]+/gu, (word) => {
    const restore = getCaseRestorer(word);
    return restore(replacer(normalize(word.toLowerCase())));
  });
}

function getCaseRestorer(word: string): CaseRestorer {
  if (isUpper(word, 0)) {
    return isUpper(word, word.length - 1) ? toUpper : toFirstUpper;
  } else {
    return toLower;
  }
}

// `word` is always a non-empty match of the letter regex above, so both
// indices the caller asks for are in range.
function isUpper(word: string, index: number): boolean {
  const letter = word[index];
  return letter === letter.toUpperCase();
}

function toUpper(word: string): string {
  return word.toUpperCase();
}

function toFirstUpper(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}

function toLower(word: string): string {
  return word.toLowerCase();
}

type CaseRestorer = (word: string) => string;
