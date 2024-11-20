#!/usr/bin/env node

import fs from "node:fs";
import utils from '../dist/index.js';
import _utils from '../dist/utils/index.js';
import _ from 'lodash';

const SuffixTrie = _utils.SuffixTrie;

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

const NNN = 'nńň';
const ENDINGS = new Set(['ja', 'jah', 'jam', 'jami', 'je', 'jem', 'ju', 'jų']);

function* filterProblematicOnes(words) {
  for (const word of words) {
    const jIndex = word.indexOf('j');

    if (jIndex > 0 && NNN.includes(word[jIndex - 1]) && ENDINGS.has(word.slice(jIndex))) {
      yield word;
    }

    if (word.includes('ĺj') || word.includes('ľj') || word.includes('ńj') || word.includes('ňj')) {
      yield word;
    }
  }
}

console.log('Reading all words...');

const allWords = _.uniq([...readAllWords()]).sort();

function takeWords(predicate) {
  const set = new Set();
  for (const [lower, standard] of ljnjWords) {
    if (predicate(lower, standard)) {
      set.add(standard);
    }
  }
  return [...set].sort();
}

function buildSuffixTrie(predicate) {
  const tokens = takeWords(predicate);
  const trie = new SuffixTrie(tokens);
  if (tokens.length !== trie.size) {
    const diff = _.difference(tokens, [...trie]);
    throw new Error('Duplicate or missing tokens detected:\n%s', diff.join('\n'));
  }

  return trie;
}

function hasLJJ(word) {
  return word.includes('ľj');
}

function hasLigatureLJEnding(word) {
  return word.indexOf('lj') > word.indexOf('ľj');
}

function hasDigraphNJEnding(word) {
  const njIndex = word.lastIndexOf('ńj');
  return njIndex > 0 && ENDINGS.has(word.slice(njIndex + 1));
}

function hasLigatureNJEnding(word) {
  const njIndex = word.lastIndexOf('nj');
  return njIndex > 0 && ENDINGS.has(word.slice(njIndex + 1));
}

console.log('Generating fixtures...');

const ljnjWords = [...filterProblematicOnes(allWords)].map(word => {
  const lower = word.toLowerCase();
  const standard = utils.transliterate(lower, 'isv-Latn');
  return [lower, standard];
});

const trieLJJ = buildSuffixTrie(hasLJJ);
const trieLJ = buildSuffixTrie(hasLigatureLJEnding);
const trieNJJ = buildSuffixTrie(hasDigraphNJEnding);
const trieNJ = buildSuffixTrie(hasLigatureNJEnding);

const safeTrieLJJ = buildSuffixTrie((_, standard) => {
  const ljjMatch = trieLJJ.match(standard);
  const ljMatch = trieLJ.match(standard);

  if (ljjMatch && ljMatch) {
    const ljjIndex = trieLJJ.findIndex(standard);
    const ljIndex = trieLJ.findIndex(standard);
    return ljjIndex < ljIndex;
  }

  return ljjMatch;
});

const njjOverrides = buildSuffixTrie((_, standard) => {
  const njjMatch = trieNJJ.match(standard);
  const njMatch = trieNJ.match(standard);

  if (njjMatch && njMatch) {
    const njjIndex = trieNJJ.findIndex(standard);
    const njIndex = trieNJ.findIndex(standard);
    return njjIndex < njIndex;
  }

  return false;
});

async function saveTrie(filePath, trie) {
  const code =
    `import { SuffixTrie } from '../../utils';\n` +
    `export default new SuffixTrie(${JSON.stringify(trie)});`;

  const content = '/* eslint-disable */\n' + code + '\n';
  await fs.promises.writeFile(filePath, content);
}

fs.writeFileSync('src/__fixtures__/word-forms.json', JSON.stringify(allWords, null, 2));

await saveTrie('src/transliterate/tries/ljj.ts', safeTrieLJJ);
await saveTrie('src/transliterate/tries/nj.ts', trieNJ);
await saveTrie('src/transliterate/tries/njj-override.ts', njjOverrides);

