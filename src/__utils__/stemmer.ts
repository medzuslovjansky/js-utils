function findPrefixBetweenTwo(prefix: string, word: string): string {
  let i = 0;
  const minLength = Math.min(prefix.length, word.length);
  while (i < minLength && prefix[i] === word[i]) {
    i++;
  }
  return prefix.slice(0, i);
}

function findCommonPrefix(words: string[]): string {
  if (words.length === 0) return '';
  return words.reduce(findPrefixBetweenTwo);
}

function computeSuffix(this: string, word: string): string {
  return word.slice(this.length);
}

function computeSuffixes(words: string[], prefix: string): string[] {
  return words.map(computeSuffix, prefix);
}

export function stemmer(words: string[]): [string, string[]] {
  if (words.length === 0) return ['', []];

  const prefix = findCommonPrefix(words);
  const suffixes = computeSuffixes(words, prefix);

  return [prefix, suffixes];
}
