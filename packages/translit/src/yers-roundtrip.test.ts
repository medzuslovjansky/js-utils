import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';

import { transliterate } from './transliterate.ts';

/**
 * A round trip through a script that writes yers: word → script → word. It
 * measures how well the yers are read back, and it must not get worse when
 * the yer reading changes.
 *
 * Set `YERS_CORPUS` to the path of a word list (`words.csv` of the dictionary,
 * second column) to measure on all of it; the list is not part of this
 * repository. Without it only the small built-in sets run.
 */
const SCRIPTS = ['Glag', 'Cyrl'] as const;
type Script = (typeof SCRIPTS)[number];

// the soft consonants have two spellings that mean the same: ľ ĺ, ť t́, ď d́
const fold = (word: string): string =>
  word.replace(/ĺ/g, 'ľ').replace(/t́/g, 'ť').replace(/d́/g, 'ď');

function roundTrip(word: string, script: Script): string {
  const there = transliterate(word, `isv-${script}-x-etymolog`);

  return transliterate(there, 'isv-Latn-x-etymolog');
}

const ok = (word: string, script: Script): boolean =>
  fold(roundTrip(word, script)) === fold(word);

// words that come back in both scripts
const BOTH = [
  ...'kanal sȯn kralj konj vȯlk pȯlny krȯv krȯvny dųb rųka město jazyk sȯmysl'.split(
    ' ',
  ),
  ...'byk mjod trg krv dȯska vȯzduh bolěznj dȯlgo vȯ sȯ kȯ pȯlnočny'.split(' '),
  ...'objaviti podjezd izȯjdti sȯjųz tȯj'.split(' '),
];
// Cyrillic writes ė as е: pės and pes are the same word to it
const GLAG_ONLY = ['dėnj', 'pės', 'lėv', 'otėc'];

describe('yers: round trip, built-in words', () => {
  for (const word of BOTH) {
    for (const script of SCRIPTS) {
      test(`${word} through ${script}`, () => {
        assert.equal(fold(roundTrip(word, script)), fold(word));
      });
    }
  }
  for (const word of GLAG_ONLY) {
    test(`${word} through Glag`, () => {
      assert.equal(roundTrip(word, 'Glag'), word);
    });
  }
});

// Floors for the dictionary, in per cent, a little under what is measured.
const FLOOR: Record<Script, number> = { Glag: 98.3, Cyrl: 95.6 };

const corpusPath = process.env.YERS_CORPUS;

function words(path: string): string[] {
  // only the second column matters; rows may have quoted commas
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const text = readFileSync(path, 'utf8');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted && c === '"' && text[i + 1] === '"') {
      field += '"';
      i++;
    } else if (c === '"') {
      quoted = !quoted;
    } else if (!quoted && c === ',') {
      row.push(field);
      field = '';
    } else if (!quoted && c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }

  const set = new Set<string>();
  for (const r of rows.slice(1)) {
    for (const w of (r[1] ?? '').split(/[,;]/)) {
      const t = w
        .replace(/\(.*?\)/g, '')
        .trim()
        .toLowerCase();
      if (/^\p{L}+$/u.test(t)) set.add(t);
    }
  }

  return [...set];
}

describe('yers: round trip, the dictionary', { skip: !corpusPath }, () => {
  for (const script of SCRIPTS) {
    test(`through ${script}`, () => {
      const all = words(corpusPath!);
      const good = all.filter((w) => ok(w, script)).length;
      const percent = (100 * good) / all.length;
      console.log(`${script}: ${good}/${all.length} = ${percent.toFixed(2)}%`);
      assert.ok(percent >= FLOOR[script], `${script} ${percent.toFixed(2)}%`);
    });
  }
});
