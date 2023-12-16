#!/usr/bin/env node

import fs from "node:fs";
import utils from '../dist/index.js';
import _ from 'lodash';

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

function* readAllWords() {
  yield* extractWordsFromFile('src/adjective/testCases.json');
  yield* extractWordsFromFile('src/noun/__snapshots__/declensionNoun.test.ts.snap');
  yield* extractWordsFromFile('src/numeral/testCases.json');
  yield* extractWordsFromFile('src/pronoun/testCases.json');
  yield* extractWordsFromFile('src/verb/testCases.json');
  yield* extractWordsFromFile('scripts/dictionary.txt');
}

console.log('Reading all words...');
const allWords = _.uniq([...readAllWords()]).map(word => {
  const lower = word.toLowerCase();
  const standard = utils.transliterate(lower, 'art-Latn-x-interslv');
  return [lower, standard];
});

function buildExceptionList(predicate) {
  const set = new Set();
  for (const [lower, standard] of allWords) {
    if (predicate(lower, standard)) {
      set.add(standard);
    }
  }
  return [...set].sort();
}

function toTrieToken(word) {
  return '%' + word + '%';
}

/**
 * @param {string[]} tokens
 * @returns string
 */
function buildSuffixTrie(tokens) {
  const trie = {};

  // iterate over the tokens array.
  tokens.forEach((token) => {
    let lettersBreakdown = token.split("").reverse();
    let current = trie;

    // iterate over every letter in the token/word.
    lettersBreakdown.forEach((letter, index) => {
      const position = current[letter];

      if (position == null) {
        // for the last letter of the word, assign 0. For others, assign empty object.
        current = current[letter] = index === lettersBreakdown.length - 1 ? 0 : {};
      } else if (position === 0) {
        current = current[letter] = { $: 0 };
      } else {
        current = current[letter];
      }
    });

  });

  return JSON.stringify(trie) + '\n';
}

function generateRuleExceptions(predicate) {
  return buildSuffixTrie(buildExceptionList(predicate).map(toTrieToken));
}

function containsLjj(word) {
  return word.includes('ľj');
}

function containsNjj(word, standard) {
  return word.includes('ńj') && !endsWithNonTypicalNje(standard) && !standard.endsWith('nju');
}

function endsWithNonTypicalNje(word) {
  return word.endsWith('nja')
    || word.endsWith('njah')
    || word.endsWith('njam')
    || word.endsWith('njami')
    || word.endsWith('nje')
    || word.endsWith('njem');
}

function endsWithNonTypicalNjju(word) {
  return word.endsWith('ńju') || word.endsWith('ńjų');
}

console.log('Generating fixtures...');

fs.writeFileSync(
  'src/transliterate/lj-nj/list-ljj.json',
  generateRuleExceptions(containsLjj)
);

fs.writeFileSync(
  'src/transliterate/lj-nj/list-njj.json',
  generateRuleExceptions(containsNjj)
);

fs.writeFileSync(
  'src/transliterate/lj-nj/exceptions-nje.json',
  generateRuleExceptions(endsWithNonTypicalNje)
);

fs.writeFileSync(
  'src/transliterate/lj-nj/exceptions-njju.json',
  generateRuleExceptions(endsWithNonTypicalNjju)
);

fs.writeFileSync(
  'src/transliterate/lj-nj/endings-nje.json',
  buildSuffixTrie([
    'nja%',
    'njah%',
    'njam%',
    'njami%',
    'nje%',
    'njem%',
  ]),
);
