import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

import { FlavorisationBCP47, transliterate } from '@interslavic/translit';
import { ALPHABET } from '@interslavic/translit/alphabet';

import { read as readParadigms } from './golden.ts';

/**
 * Every flavour of every script, over every letter pair the alphabet can form.
 *
 * `@interslavic/translit` had ten tests for twenty-one flavours: one paragraph,
 * snapshotted per flavour. A paragraph is a good smoke test and a poor net — it
 * cannot say whether a rule fires on `zj` because the paragraph has no such
 * pair. This is the same net the paradigms have: frozen output, expected not to
 * move, and when it moves the diff says whether that was a fix.
 */
export const TRANSLIT_GOLDEN_PATH = path.join(
  import.meta.dirname,
  '__fixtures__/transliterations.tsv.gz',
);

/**
 * What gets transliterated, built fresh on every run rather than stored:
 *
 * - every letter on its own, and every ordered pair of letters. Exhaustive, so
 *   a rule cannot hide behind a combination nobody happened to write down. Each
 *   pair is a word in its own right, so both word boundaries are exercised too
 *   — a good half of the rules in the engine anchor on one.
 * - every three-letter sequence the lexicon actually contains. Exhaustive
 *   triples would be 3.5 million and almost all of them unpronounceable; the
 *   real ones are 10 627, and they are where three characters of context get
 *   read.
 *
 * Adding a letter to `ALPHABET` therefore adds its whole row and column here
 * without anyone editing a fixture.
 */
export function probes(): string[] {
  const out = new Set<string>(ALPHABET);

  for (const first of ALPHABET) {
    for (const second of ALPHABET) out.add(first + second);
  }

  for (const line of readParadigms().split('\n').slice(1)) {
    const form = line.split('\t')[2];
    if (!form) continue;
    const word = form.toLowerCase();
    for (let i = 0; i + 3 <= word.length; i++) out.add(word.slice(i, i + 3));
  }

  return [...out].sort();
}

export function generate(): string {
  const codes = [...new Set(Object.values(FlavorisationBCP47))].sort();
  const lines: string[] = ['# probe\tflavour\ttransliteration'];

  for (const probe of probes()) {
    for (const code of codes) {
      lines.push(`${probe}\t${code}\t${transliterate(probe, code)}`);
    }
  }

  return lines.join('\n') + '\n';
}

export function read(): string {
  return zlib
    .gunzipSync(fs.readFileSync(TRANSLIT_GOLDEN_PATH))
    .toString('utf8');
}

export function write(content: string): void {
  fs.mkdirSync(path.dirname(TRANSLIT_GOLDEN_PATH), { recursive: true });
  fs.writeFileSync(
    TRANSLIT_GOLDEN_PATH,
    zlib.gzipSync(content, { level: zlib.constants.Z_BEST_COMPRESSION }),
  );
}
