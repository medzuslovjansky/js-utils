import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { adjectiveForms, nounForms, verbForms } from '../flatten.ts';
import type { XPOS } from '@interslavic/conllu';

import { derive } from '../../derive/index.ts';
import { etymologify } from '../../etymologify.ts';
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
 * Every form a paradigm module produces should come back out of `inflect`, or
 * out of `inflect` applied to what `derive` produces from the same word.
 *
 * The modules are read twice over: once flat, as a bare list of forms, and once
 * through the whole token pipeline. Anything the pipeline drops on the way —
 * a cell nobody wired up, a case the dispatcher never reaches — shows up here
 * as a gap between the two. The counts below are exact: a change in either
 * direction is a result worth looking at, not a threshold to relax.
 */

/** What `inflect` reaches, on its own and through one round of derivation. */
function reachableForms([id, xpos, word, addition]: Row): Set<string> {
  const forms = new Set<string>();

  for (const lemma of normalize({
    isv: word,
    addition,
    partOfSpeech: xpos as XPOS,
  })) {
    for (const token of inflectLemma(lemma) ?? []) forms.add(token.form);

    for (const derivedToken of derive({ lemma, lid: id })) {
      for (const token of inflect(derivedToken) ?? []) {
        forms.add(token.form);
      }
      // 2-step derivation: adjective -> adverb -> comparative/superlative adverbs
      for (const secondHopToken of derive(derivedToken)) {
        for (const token of inflect(secondHopToken) ?? []) {
          forms.add(token.form);
        }
      }
    }
  }

  return forms;
}

function countCovered(rows: Row[], flatForms: (row: Row) => string[]) {
  let checked = 0;
  let covered = 0;

  for (const row of rows) {
    // Phrases and reflexives inflect as a unit, which is a different job.
    if (row[2].includes(' ')) continue;

    // Same boundary on the way out: an analytic form like `bolje abhazski` is
    // two words, and two words are not what a paradigm filler produces.
    const expected = new Set(
      flatForms(row)
        .map((form) => etymologify(form))
        .filter((form) => !form.includes(' ')),
    );
    if (expected.size === 0) continue;
    checked++;

    const actual = reachableForms(row);
    if ([...expected].every((form) => actual.has(form))) covered++;
  }

  return { checked, covered };
}

describe('the pipeline keeps every form the tables produce', () => {
  test('nouns', () => {
    const result = countCovered(
      fixtures(...NOUNS),
      ([, xpos, word, addition]) => {
        // `m./f.` leaves the table without a gender to decline by; inflectNoun
        // gets one
        // per variant out of parseXPos, so here the first gender that works wins.
        for (const gender of [undefined, 'masculine', 'feminine'] as const) {
          try {
            return nounForms(word, xpos, addition || '', gender);
          } catch {
            continue;
          }
        }
        return [];
      },
    );

    assert.deepEqual(result, { checked: 8224, covered: 8224 });
  });

  test('adjectives', () => {
    const result = countCovered(fixtures(...ADJECTIVES), ([, xpos, word]) =>
      adjectiveForms(word, '', xpos),
    );

    // The one outstanding is `!duži`, where the `!` metacharacter survives the
    // flat read and `normalize()` strips it out of the pipeline's.
    assert.deepEqual(result, { checked: 2987, covered: 2986 });
  });

  test('verbs', () => {
    const result = countCovered(
      fixtures(...VERBS),
      ([, xpos, word, addition]) => verbForms(word, addition || '', xpos),
    );

    assert.deepEqual(result, { checked: 3872, covered: 3872 });
  });
});
