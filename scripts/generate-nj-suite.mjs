#!/usr/bin/env node

import fs from 'node:fs';
import utils from '../dist/index.js';

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

function* allWords() {
  yield* extractWordsFromFile('src/adjective/testCases.json');
  yield* extractWordsFromFile('src/noun/__snapshots__/declensionNoun.test.ts.snap');
  yield* extractWordsFromFile('src/numeral/testCases.json');
  yield* extractWordsFromFile('src/pronoun/testCases.json');
  yield* extractWordsFromFile('src/verb/testCases.json');
}

function endsWithNj(word) {
  return word.endsWith('nja')
    || word.endsWith('njah')
    || word.endsWith('njam')
    || word.endsWith('njami')
    || word.endsWith('nje')
    || word.endsWith('njem')
    || word.endsWith('nju');
}

function buildExceptionList() {
  const set = new Set();
  for (const word of allWords()) {
    if (endsWithNj(word)) {
      set.add(utils.transliterate(word.toLowerCase(), 'art-Latn-x-interslv'));
    }
  }
  return [...set].sort();
}

function toTrieToken(word) {
  return '%' + word.split('').reverse().join('') + '%';
}

console.log(buildExceptionList().map(toTrieToken).join(' '));

