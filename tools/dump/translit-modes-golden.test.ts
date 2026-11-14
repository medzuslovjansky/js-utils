import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import zlib from 'node:zlib';

import { FlavorisationBCP47, transliterate } from '@interslavic/translit';

import { diff, read as readParadigms } from './golden.ts';

/**
 * The guard around `transliterate(text, lang, <third argument>)`, taken before
 * the third argument grew from a boolean into an options object.
 *
 * `translit-golden.test.ts` freezes the default mode over the Latin and
 * Cyrillic input alphabet. It does not cover three things this file does:
 * the second input mode, Glagolitic input (not part of `ALPHABET`), and whole
 * words rather than letter pairs. Whatever the defaults produced when these
 * fixtures were written, they must still produce.
 */

/** The third argument of `transliterate`, by the name the fixtures use. */
const MODES = { forgiving: false, strict: true } as const;
type Mode = keyof typeof MODES;

const ALL_CODES = [...new Set(Object.values(FlavorisationBCP47))].sort();

/**
 * The mode only changes the first phase (input → etymological alphabet); every
 * later phase is a function of that phase's output. So outside the default mode
 * three targets are enough: both Latin ones a reader can check by eye, and
 * `isv-Cyrl-x-iotated-ext`, the one flavour that projects nothing away.
 */
const PROBE_CODES = [
  'isv-Latn-x-etymolog',
  'isv-Latn',
  'isv-Cyrl-x-iotated-ext',
] as const;

const FIXTURES = path.join(import.meta.dirname, '__fixtures__');
const update = Boolean(process.env.UPDATE_SNAPSHOT);

function forms(): string[] {
  const out = new Set<string>();
  for (const line of readParadigms().split('\n').slice(1)) {
    const form = line.split('\t')[2];
    if (form) out.add(form);
  }
  return [...out];
}

function check(file: string, actual: string, gzip = false) {
  const target = path.join(FIXTURES, file);
  if (update) {
    fs.writeFileSync(
      target,
      gzip
        ? zlib.gzipSync(actual, { level: zlib.constants.Z_BEST_COMPRESSION })
        : actual,
    );
    return;
  }

  const raw = fs.readFileSync(target);
  const expected = (gzip ? zlib.gunzipSync(raw) : raw).toString('utf8');
  if (expected === actual) return;

  assert.fail(
    `${file} moved. Run with UPDATE_SNAPSHOT=1 to accept.\n\n` +
      diff(expected, actual).join('\n'),
  );
}

test('every paradigm form transliterates to what it did, in both modes', () => {
  const latin = forms();
  // The same words as Cyrillic and Glagolitic input. Etymological, so that no
  // letter is lost on the way out and the way back in has all of them to read.
  const inputs: Record<string, [string[], readonly string[]]> = {
    latin: [latin, ALL_CODES],
    cyrillic: [
      latin.map((w) => transliterate(w, 'isv-Cyrl-x-etymolog')),
      PROBE_CODES,
    ],
    glagolitic: [
      latin.map((w) => transliterate(w, 'isv-Glag-x-etymolog')),
      PROBE_CODES,
    ],
  };

  // 195 578 forms in 54 combinations would be a gigabyte of text, so each
  // combination is stored as one digest. A digest says that something moved,
  // not what: to see what, diff the outputs of the two revisions directly.
  const lines = [
    '# input\tmode\ttarget\tsha256 of "input<TAB>output<LF>" lines',
  ];
  for (const [script, [words, codes]] of Object.entries(inputs)) {
    for (const mode of Object.keys(MODES) as Mode[]) {
      const targets =
        script === 'latin' && mode === 'forgiving' ? codes : PROBE_CODES;
      for (const code of targets) {
        const hash = crypto.createHash('sha256');
        for (const word of words) {
          hash.update(
            `${word}\t${transliterate(word, code as never, MODES[mode])}\n`,
          );
        }
        lines.push(`${script}\t${mode}\t${code}\t${hash.digest('hex')}`);
      }
    }
  }

  check('translit-paradigms.sha256.tsv', lines.join('\n') + '\n');
});

/**
 * Glagolitic input, exhaustively for short contexts: every letter, every pair,
 * and every letter either side of a yer — the yers are read by their
 * neighbours, the end of the word and a following `ⱃ`, so those get one more
 * letter of context each.
 */
function glagoliticProbes(): string[] {
  const letters = Array.from({ length: 0x2c5f - 0x2c30 }, (_, i) =>
    String.fromCodePoint(0x2c30 + i),
  );
  const out = new Set<string>(letters);
  for (const a of letters) {
    for (const b of letters) {
      out.add(a + b);
      for (const yer of 'ⱏⱐ') {
        out.add(a + yer + b);
        out.add(a + b + yer);
        out.add(a + yer + b + yer);
        out.add(a + yer + 'ⱃ' + b);
      }
    }
  }
  // the titlo, and capitals
  out.add('ⰿ҃ⱄ').add('Ⰰⰱⰲ').add('ⰀⰁⰂ').add('Ⱄⱏ').add('ⰔⰟ');
  return [...out].sort();
}

test('every short Glagolitic word reads as it did, in both modes', () => {
  const lines = ['# probe\tmode\ttarget\ttransliteration'];
  for (const probe of glagoliticProbes()) {
    for (const mode of Object.keys(MODES) as Mode[]) {
      for (const code of PROBE_CODES) {
        lines.push(
          `${probe}\t${mode}\t${code}\t${transliterate(probe, code, MODES[mode])}`,
        );
      }
    }
  }

  check('transliterations-glagolitic.tsv.gz', lines.join('\n') + '\n', true);
});

/**
 * Out to another script and back, over the paradigm forms. A floor, not a
 * target: the forms that do not come back are known (see the counts) and the
 * number may only go up.
 *
 * This measures the reader against this package's own writer, so a mistake the
 * two share is invisible here. The case tables in `packages/translit` are what
 * check the reader against spellings that came from somewhere else.
 */
const ROUND_TRIPS = [
  ['isv-Glag-x-etymolog', 'isv-Latn-x-etymolog', 192871],
  ['isv-Glag', 'isv-Latn', 193985],
  ['isv-Cyrl-x-etymolog', 'isv-Latn-x-etymolog', 189463],
  ['isv-Cyrl', 'isv-Latn', 195578],
] as const;

for (const [via, back, floor] of ROUND_TRIPS) {
  test(`${back} → ${via} → ${back} returns at least ${floor} forms`, () => {
    let same = 0;
    for (const form of forms()) {
      const latin = transliterate(form, back);
      if (transliterate(transliterate(form, via), back) === latin) same++;
    }
    assert.ok(same >= floor, `only ${same} forms came back`);
  });
}
