import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import type { XPOS } from '@interslavic/conllu';

import { normalize } from '../../normalize.ts';
import { inflectLemma } from '../inflect.ts';
import {
  ADJECTIVES,
  NOUNS,
  OTHER,
  PRONOUNS,
  VERBS,
  fixtures,
  type Row,
} from '../../__utils__/fixtures.ts';

/**
 * The tables were written to be printed, and one cell can carry two forms that
 * differ in something the print never writes down: `oka / očese` is a second
 * stem, `dobrogo / dobry` is animacy, `dělajų, dělam` is contraction. Each
 * module has to name that difference as features, and every time it guesses —
 * by string length, by position — it has silently lost a distinction somewhere
 * else.
 *
 * So this counts what survives. Two invariants have to hold outright:
 *
 * - no form keeps display punctuation, or the split never happened;
 * - no (form, features) pair repeats inside a paradigm, or two cells collapsed
 *   into one and the paradigm now says the same thing twice.
 *
 * The third number is not a defect and not a target: `rivals` counts cells
 * where two different forms come out with identical features. Some of those are
 * honest free variants, where §2's contract says the order carries the
 * preference and no feature should be invented. The rest are distinctions we
 * have not named yet. Which is which is a decision for the owner, recorded in
 * `__fixtures__/target-paradigms.tsv`; what this test does is make sure the
 * number cannot move without someone noticing.
 */

function survey(rows: Row[]) {
  let lemmas = 0;
  let dirty = 0;
  let collapsed = 0;
  let rivals = 0;

  for (const [, xpos, word, addition] of rows) {
    // Phrases inflect as a unit, which is a different job.
    if (word.includes(' ')) continue;

    const [lemma] = normalize({
      isv: word,
      addition,
      partOfSpeech: xpos as XPOS,
    });
    if (!lemma) continue;

    const tokens = inflectLemma(lemma);
    if (!tokens?.length) continue;
    lemmas++;

    if (tokens.some((token) => /[/(),;]/.test(token.form))) dirty++;

    const seen = new Set<string>();
    const formsByFeats = new Map<string, Set<string>>();

    for (const token of tokens) {
      const feats = JSON.stringify(token.feats ?? {});
      const key = `${token.form}\t${feats}`;
      if (seen.has(key)) collapsed++;
      seen.add(key);

      const forms = formsByFeats.get(feats) ?? new Set<string>();
      forms.add(token.form);
      formsByFeats.set(feats, forms);
    }

    for (const forms of formsByFeats.values()) {
      if (forms.size > 1) rivals++;
    }
  }

  return { lemmas, dirty, collapsed, rivals };
}

describe('distinctions survive the display format', () => {
  test('nouns', () => {
    // Every pair the tables print turned out to be the same alternation: the
    // athematic declension beside the ordinary one. `telęte` beside `telęta`,
    // `cŕkve` beside `cŕkvi`, `matere` beside `materi`, `očese` beside `oka`,
    // and `kamen, kamene, kamenem` beside `kamenj, kamenja, kamenjem`.
    assert.deepEqual(survey(fixtures(...NOUNS)), {
      lemmas: 8227,
      dirty: 0,
      collapsed: 0,
      rivals: 0,
    });
  });

  test('adjectives', () => {
    // Nothing outstanding: every alternative the table prints is told apart by
    // Animacy, which is what the other parts of speech are measured against.
    assert.deepEqual(survey(fixtures(...ADJECTIVES)), {
      lemmas: 2987,
      dirty: 0,
      collapsed: 0,
      rivals: 0,
    });
  });

  test('verbs', () => {
    // Nothing outstanding either, and it took two features to get there: the
    // contraction of the ĵ-stems is `Variant=Long`/`Short`, and the `-m` of the
    // first person singular — a different alternation entirely, on a cell the
    // contraction never reaches — is `Variant=Athematic`.
    assert.deepEqual(survey(fixtures(...VERBS)), {
      lemmas: 3873,
      dirty: 0,
      collapsed: 0,
      rivals: 0,
    });
  });

  test('pronouns', () => {
    assert.deepEqual(survey(fixtures(...PRONOUNS)), {
      lemmas: 101,
      dirty: 0,
      collapsed: 0,
      rivals: 0,
    });
  });

  test('everything else', () => {
    assert.deepEqual(survey(fixtures(...OTHER)), {
      lemmas: 1028,
      dirty: 0,
      collapsed: 0,
      rivals: 0,
    });
  });
});
