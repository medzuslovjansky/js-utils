#!/usr/bin/env node

import fs from "node:fs";

function* extractWords(str) {
  // include letters and combining marks
  const regex = /([\p{L}\p{M}]+)/gu;
  let match;

  while ((match = regex.exec(str)) !== null) {
    yield match[1];
  }
}

function* extractWordsFromFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  yield* extractWords(raw);
}

function* extractWordsFromFixture(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  for (const row of json) {
    yield* extractWords(row[2]);
    if (row[3]) {
      yield* extractWords(row[3]);
    }
  }
}

function* readAllWords() {
  yield* extractWordsFromFixture('src/__fixtures__/other.json');
  yield* extractWordsFromFile('src/adjective/__tests__/__snapshots__/adjective.test.ts.snap');
  yield* extractWordsFromFile('src/noun/__tests__/__snapshots__/feminine.test.ts.snap');
  yield* extractWordsFromFile('src/noun/__tests__/__snapshots__/masculine-animate.test.ts.snap');
  yield* extractWordsFromFile('src/noun/__tests__/__snapshots__/masculine.test.ts.snap');
  yield* extractWordsFromFile('src/noun/__tests__/__snapshots__/miscellaneous.test.ts.snap');
  yield* extractWordsFromFile('src/noun/__tests__/__snapshots__/neuter.test.ts.snap');
  yield* extractWordsFromFile('src/numeral/testCases.json');
  yield* extractWordsFromFile('src/pronoun/__tests__/__snapshots__/demonstrative.test.ts.snap');
  yield* extractWordsFromFile('src/pronoun/__tests__/__snapshots__/indefinite.test.ts.snap');
  yield* extractWordsFromFile('src/pronoun/__tests__/__snapshots__/interrogative.test.ts.snap');
  yield* extractWordsFromFile('src/pronoun/__tests__/__snapshots__/personal.test.ts.snap');
  yield* extractWordsFromFile('src/pronoun/__tests__/__snapshots__/possessive.test.ts.snap');
  yield* extractWordsFromFile('src/pronoun/__tests__/__snapshots__/reciprocal.test.ts.snap');
  yield* extractWordsFromFile('src/pronoun/__tests__/__snapshots__/reflexive.test.ts.snap');
  yield* extractWordsFromFile('src/pronoun/__tests__/__snapshots__/relative.test.ts.snap');
  yield* extractWordsFromFile('src/verb/__tests__/__snapshots__/imperfect.test.ts.snap');
  yield* extractWordsFromFile('src/verb/__tests__/__snapshots__/miscellaneous.test.ts.snap');
  yield* extractWordsFromFile('src/verb/__tests__/__snapshots__/perfect.test.ts.snap');
}

console.log('Reading all words...');

const allWords = [...new Set(readAllWords())].sort();

console.log('Generating fixtures...');

fs.writeFileSync('src/__fixtures__/word-forms.json', JSON.stringify(allWords, null, 2));
