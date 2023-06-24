export function markFluentVowel(word: string, add: string): string {
  let i = 0;

  const L = Math.min(word.length - 1, add.length);
  while (i < L && word[i] === add[i]) {
    i++;
  }

  if (word[i] !== add[i] && word[i + 1] === add[i]) {
    return replaceFluentVowel(word, i);
  }

  return word;
}

function replaceFluentVowel(word: string, j: number): string {
  const fluentVowel = word[j].normalize('NFD')[0];
  return `${word.slice(0, j)}(${fluentVowel})${word.slice(j + 1)}`;
}
