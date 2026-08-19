import { stem } from '@interslavic/stemmer';

import { expand, readFixtures } from '../dump/dump.ts';

export type Paradigms = Map<string, Set<string>>;

/**
 * Every lemma with every form `inflect` can produce for it. This is the whole
 * point of scoring a stemmer in this repo rather than by intuition: the gold
 * standard is generated, so a rule change is a number within seconds instead of
 * an argument.
 */
export function paradigms(): Paradigms {
  const out: Paradigms = new Map();

  for (const row of readFixtures()) {
    for (const entry of expand(row)) {
      let forms = out.get(entry.lemma);
      if (!forms) out.set(entry.lemma, (forms = new Set()));
      for (const token of entry.tokens) forms.add(token.form);
    }
  }

  return out;
}

export interface Score {
  /**
   * Recall. Given a form of a word, the share of that word's other forms that
   * land on the same stem — so, the share of matching documents a query finds.
   * Pairwise, which is what a searcher experiences, rather than per-lemma.
   */
  recall: number;
  /**
   * Precision. Given two forms that landed on the same stem, the chance they
   * belong to the same word — so, the share of hits that are not noise. Without
   * this a stemmer can score perfect recall by returning the first letter.
   */
  precision: number;
  /** The number to move. Harmonic mean, so neither side can be traded away. */
  f1: number;
  stems: number;
  forms: number;
}

export function score(data: Paradigms, stemmer = stem): Score {
  const owners = new Map<string, Map<string, number>>();
  let samePair = 0;
  let lemmaPair = 0;
  let forms = 0;

  for (const [lemma, set] of data) {
    const groups = new Map<string, number>();

    for (const form of set) {
      const key = stemmer(form);
      groups.set(key, (groups.get(key) ?? 0) + 1);

      let owner = owners.get(key);
      if (!owner) owners.set(key, (owner = new Map()));
      owner.set(lemma, (owner.get(lemma) ?? 0) + 1);
    }

    const n = set.size;
    forms += n;
    lemmaPair += n * n;
    for (const count of groups.values()) samePair += count * count;
  }

  let stemPair = 0;
  let agreeing = 0;
  for (const owner of owners.values()) {
    let total = 0;
    for (const count of owner.values()) {
      total += count;
      agreeing += count * count;
    }
    stemPair += total * total;
  }

  const recall = samePair / lemmaPair;
  const precision = agreeing / stemPair;

  return {
    recall,
    precision,
    f1: (2 * recall * precision) / (recall + precision),
    stems: owners.size,
    forms,
  };
}

/** The paradigms a stemmer splits worst, with the stems it split them into. */
export function splits(data: Paradigms, limit = 25, stemmer = stem) {
  const rows: Array<{ lemma: string; share: number; stems: string[] }> = [];

  for (const [lemma, set] of data) {
    const groups = new Map<string, number>();
    for (const form of set) {
      const key = stemmer(form);
      groups.set(key, (groups.get(key) ?? 0) + 1);
    }
    if (groups.size === 1) continue;

    rows.push({
      lemma,
      share: Math.max(...groups.values()) / set.size,
      stems: [...groups.keys()],
    });
  }

  return rows.sort((a, b) => a.share - b.share).slice(0, limit);
}

/** The stems that swallowed the most unrelated words. */
export function collisions(data: Paradigms, limit = 25, stemmer = stem) {
  const owners = new Map<string, Set<string>>();

  for (const [lemma, set] of data) {
    for (const form of set) {
      const key = stemmer(form);
      let owner = owners.get(key);
      if (!owner) owners.set(key, (owner = new Set()));
      owner.add(lemma);
    }
  }

  return [...owners]
    .filter(([, lemmas]) => lemmas.size > 1)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, limit)
    .map(([key, lemmas]) => ({ stem: key, lemmas: [...lemmas] }));
}
