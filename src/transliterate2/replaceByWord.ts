import { normalize } from './normalize';

export function replaceByWord(
  text: string,
  replacer: (word: string) => string,
): string {
  return text.replace(/[\p{Letter}\p{Mark}]+/gu, (word) => {
    const restore = getCaseRestorer(word);
    const preprocessed = addBoundaries(normalize(word.toLowerCase()));
    return restore(removeBoundaries(replacer(preprocessed)));
  });
}

function addBoundaries(word: string): string {
  return `|${word}|`;
}

function removeBoundaries(str: string) {
  const start = str[0] === '|' ? 1 : 0;
  const end = str[str.length - 1] === '|' ? -1 : str.length;
  return str.slice(start, end);
}

function getCaseRestorer(word: string): CaseRestorer {
  if (isUpper(word, 0)) {
    return isUpper(word, word.length - 1) ? toUpper : toFirstUpper;
  } else {
    return toLower;
  }
}

function isUpper(word: string, index: number): boolean {
  const letter = word[index];
  return letter ? letter === letter.toUpperCase() : false;
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
