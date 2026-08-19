import fs from 'node:fs';
import path from 'node:path';

import type { Token, XPOS } from '@interslavic/conllu';
import { formatTokens } from '@interslavic/conllu';
import { inflectLemma } from '../../packages/morphology/src/inflect/inflect.ts';
import { normalize } from '../../packages/morphology/src/normalize.ts';

/** `[id, xpos, lemma, addition]` — the shape of every `__fixtures__/*.json` row. */
export type FixtureRow = [string, string, string, string];

export interface DumpEntry {
  /** Steenbergen id, carried into MISC as `SID` the way the UD guidelines want it. */
  sid: string;
  xpos: string;
  lemma: string;
  tokens: Token[];
}

/**
 * The lemma corpus lives with the tests rather than in this workspace: it is the
 * same 17.8k rows the snapshots are built from, so a dump can never drift away
 * from what the regression net covers. It is not published, hence the reach
 * across packages.
 */
export const FIXTURES_DIR = path.resolve(
  import.meta.dirname,
  '../../packages/morphology/src/__fixtures__',
);

export function readFixtures(dir = FIXTURES_DIR): FixtureRow[] {
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .flatMap(
      (name) =>
        JSON.parse(
          fs.readFileSync(path.join(dir, name), 'utf8'),
        ) as FixtureRow[],
    );
}

/**
 * One fixture row can produce several entries: `normalize()` splits biaspectual
 * verbs, homographs and comma-separated variants into separate lemmas.
 * Uninflectable ones (affixes, phrases, unresolved multi-word entries) yield
 * nothing — `inflectLemma()` returns undefined for them.
 */
export function expand([sid, xpos, lemma, addition]: FixtureRow): DumpEntry[] {
  const entries: DumpEntry[] = [];

  for (const normalized of normalize({
    isv: lemma,
    addition,
    partOfSpeech: xpos as XPOS,
  })) {
    const tokens = inflectLemma({ ...normalized, misc: { SID: sid } });
    if (tokens?.length) {
      entries.push({ sid, xpos, lemma: tokens[0].lemma ?? lemma, tokens });
    }
  }

  return entries;
}

/**
 * UniMorph-shaped: lemma, form, features. The feature bundle is UD rather than
 * the UniMorph schema — the point is a flat grep-able table, and inventing a
 * second tagset to convert into would only add a place for the two to disagree.
 */
export function toTsvRows({ lemma, tokens }: DumpEntry): string[] {
  return tokens.map(
    (token) => `${lemma}\t${token.form}\t${formatFeats(token)}`,
  );
}

export function formatFeats(token: Token): string {
  const feats = Object.entries(token.feats ?? {})
    .map(([key, value]) => `${key}=${value}`)
    .sort();

  return [token.upos ?? 'X', ...feats].join('|');
}

export function toConlluBlock({ sid, xpos, lemma, tokens }: DumpEntry): string {
  return [
    `# sent_id = ${sid}`,
    `# text = ${lemma}`,
    `# xpos = ${xpos}`,
    formatTokens(tokens),
    '',
    '',
  ].join('\n');
}
