#!/usr/bin/env node

import fs from 'node:fs';
import _ from 'lodash';

function* extractWords(str: string) {
  // include letters and combining marks
  const regex = /([\p{L}\p{M}]+)/gu;
  let match;

  while ((match = regex.exec(str)) !== null) {
    yield match[1];
  }
}

function* extractWordsFromFile(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf8');
  yield* extractWords(raw);
}

function* readAllWords() {
  yield* extractWordsFromFile(
    'src/adjective/__snapshots__/declensionAdjective.test.ts.snap',
  );
  yield* extractWordsFromFile(
    'src/noun/__snapshots__/declensionNoun.test.ts.snap',
  );
  yield* extractWordsFromFile('src/numeral/testCases.json');
  yield* extractWordsFromFile('src/pronoun/testCases.json');
  yield* extractWordsFromFile('src/verb/testCases.json');
  yield* extractWordsFromFile('scripts/dictionary.txt');
}

export default function () {
  const allWords = [...readAllWords()];
  const allUpper = allWords.filter((word) => word[0].toUpperCase() === word[0]);
  const allLower = allWords.filter((word) => word[0].toLowerCase() === word[0]);
  const allUniqueWords = _.uniq([...allLower, ...allUpper]);
  return bucketSortByLength(allUniqueWords);
}

function bucketSortByLength(data: string[]): string[] {
  const buckets: string[][] = [];

  for (const word of data) {
    const length = word.length;
    if (!buckets[length]) {
      buckets[length] = [];
    }
    buckets[length].push(word);
  }

  return buckets.flat();
}
