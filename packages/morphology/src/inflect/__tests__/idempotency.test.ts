import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import type { Token, XPOS } from '@interslavic/conllu';

import { normalize } from '../../normalize.ts';
import { inflect, inflectLemma } from '../inflect.ts';
import {
  ADJECTIVES,
  NOUNS,
  VERBS,
  fixtures,
  type Row,
} from '../../__utils__/fixtures.ts';

/**
 * A paradigm handed back to the engine that produced it comes out unchanged.
 *
 * This is the property that lets a paradigm travel: whatever a consumer stores,
 * re-inflecting it has to land on the same table, or the dictionary entry and
 * its own output are two different words. It replaces the older
 * `inflect(inflect(t)[0]) === inflect(t)`, which only ever fed the citation
 * form back and so never noticed that the bracketed principal part — `velěti
 * (veli)` — was being lost on the way out.
 */

const shape = (tokens: Token[]) =>
  tokens.map((t) => `${t.form}\t${JSON.stringify(t.feats ?? {})}`).join('\n');

function countStable(rows: Row[]) {
  let checked = 0;
  let stable = 0;

  for (const [, xpos, word, addition] of rows) {
    // Phrases inflect as a unit, which is a different job.
    if (word.includes(' ')) continue;

    const [lemma] = normalize({
      isv: word,
      addition,
      partOfSpeech: xpos as XPOS,
    });
    if (!lemma) continue;

    const once = inflectLemma(lemma);
    if (!once?.length) continue;

    checked++;
    if (shape(once) === shape(inflect(once))) stable++;
  }

  return { checked, stable };
}

describe('idempotency', () => {
  test('nouns', () => {
    // The one outstanding is `gaće (gaćij)`, the only plural-only noun in the
    // dictionary whose hint is not an `-yh` ending: the table answers `null` to
    // that combination, so the first pass already has no paradigm to repeat.
    assert.deepEqual(countStable(fixtures(...NOUNS)), {
      checked: 8227,
      stable: 8226,
    });
  });

  test('adjectives', () => {
    assert.deepEqual(countStable(fixtures(...ADJECTIVES)), {
      checked: 2987,
      stable: 2987,
    });
  });

  test('verbs', () => {
    assert.deepEqual(countStable(fixtures(...VERBS)), {
      checked: 3873,
      stable: 3873,
    });
  });
});
