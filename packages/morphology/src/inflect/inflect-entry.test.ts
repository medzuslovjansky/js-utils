import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { inflect, inflectLemma } from './inflect.ts';

describe('inflect', () => {
  test('a UPOS with no dictionary tag of its own falls back to the ending', () => {
    assert.equal(inflect({ form: 'dom', upos: 'X' })[0].xpos, 'm.');
  });

  test('a described form the paradigm has no principal part for is no hint', () => {
    // An adjective is built from its citation form alone, so naming its
    // feminine says nothing the module can act on.
    assert.deepEqual(
      inflect([{ form: 'dobry' }, { form: 'dobra', feats: { Gender: 'Fem' } }]),
      inflect('dobry'),
    );
  });

  test('among described forms only the one filling the cell is the hint', () => {
    const forms = inflect([
      { form: 'idti' },
      { form: 'ide', feats: { Number: 'Sing', Person: '3', Tense: 'Pres' } },
      { form: 'šėl' },
    ]);

    assert.deepEqual(
      forms.map((token) => token.form),
      inflect([{ form: 'idti' }, { form: 'ide' }]).map((token) => token.form),
      '`šėl` says nothing about the present tense, so it is not a principal part',
    );
  });
});

describe('inflectLemma', () => {
  test('inflects a resolved single-word record', () => {
    const tokens = inflectLemma({
      xpos: 'm.',
      words: [{ form: 'dom', lemma: 'dom', upos: 'NOUN' }],
    });

    assert.deepEqual(tokens, inflect('dom'));
  });

  test('answers with nothing while a word is missing its part of speech', () => {
    assert.equal(
      inflectLemma({
        xpos: 'v.intr. ipf.',
        words: [
          { form: 'bojati', lemma: 'bojati', upos: 'VERB' },
          { form: 'sę', lemma: 'sę' },
        ],
      }),
      undefined,
    );
  });

  test('answers with nothing while a word is missing its lemma', () => {
    assert.equal(
      inflectLemma({
        xpos: 'm.',
        words: [{ form: 'dom', upos: 'NOUN' }],
      }),
      undefined,
    );
  });
});
