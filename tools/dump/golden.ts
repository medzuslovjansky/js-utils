import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

import { expand, formatFeats, readFixtures } from './dump.ts';

/**
 * The whole lexicon, one line per form: `sid`, lemma, form, UPOS and features.
 *
 * The point is coverage the hand-picked snapshots cannot give. Those hold 140
 * lemmas out of 16 216 — enough to show what a paradigm is supposed to look
 * like, not enough to notice that a rewrite swapped the dative and the locative
 * on eight thousand nouns. Legacy's own 35 074 snapshots do cover everything,
 * but what they cover is the display format, which is the thing being removed;
 * they stop being a net precisely when the work reaches them.
 *
 * So this is the acceptance net for replacing the engine: every form of every
 * lemma with every feature it carries, frozen. It is expected not to move. When
 * it does move, that is either a bug or a deliberate improvement, and the diff
 * says which.
 */
export const GOLDEN_PATH = path.join(
  import.meta.dirname,
  '__fixtures__/paradigms.tsv.gz',
);

export function generate(): string {
  const lines: string[] = ['# sid\tlemma\tform\tfeats'];

  for (const row of readFixtures()) {
    for (const entry of expand(row)) {
      for (const token of entry.tokens) {
        lines.push(
          `${entry.sid}\t${entry.lemma}\t${token.form}\t${formatFeats(token)}`,
        );
      }
    }
  }

  return lines.join('\n') + '\n';
}

export function read(): string {
  return zlib.gunzipSync(fs.readFileSync(GOLDEN_PATH)).toString('utf8');
}

export function write(content: string): void {
  fs.mkdirSync(path.dirname(GOLDEN_PATH), { recursive: true });
  fs.writeFileSync(
    GOLDEN_PATH,
    zlib.gzipSync(content, { level: zlib.constants.Z_BEST_COMPRESSION }),
  );
}

/** First differing lines, with enough context to name the lemma that moved. */
export function diff(expected: string, actual: string, limit = 20): string[] {
  const a = expected.split('\n');
  const b = actual.split('\n');
  const report: string[] = [];

  for (
    let i = 0;
    i < Math.max(a.length, b.length) && report.length < limit;
    i++
  ) {
    if (a[i] === b[i]) continue;
    report.push(`- ${a[i] ?? '<missing>'}`);
    report.push(`+ ${b[i] ?? '<missing>'}`);
  }

  return report;
}
