import { describe, test } from 'node:test';
import assert from 'node:assert';

import { normalize } from './normalize.ts';

describe('normalize', () => {
  for (const isv of ['anti', 'anti-', 'anti -', 'anti--']) {
    test(`prefix ${JSON.stringify(isv)} becomes "anti-"`, () => {
      const [lemma] = normalize({ isv, partOfSpeech: 'prefix' });
      assert.deepStrictEqual(lemma.words, [
        { form: 'anti-', lemma: 'anti-', upos: 'X' },
      ]);
    });
  }

  for (const isv of ['nik', '-nik', '- nik', '--nik']) {
    test(`suffix ${JSON.stringify(isv)} becomes "-nik"`, () => {
      const [lemma] = normalize({ isv, partOfSpeech: 'suffix' });
      assert.deepStrictEqual(lemma.words, [
        { form: '-nik', lemma: '-nik', upos: 'X' },
      ]);
    });
  }

  test('a single-word lemma gets upos and feats from its xpos', () => {
    const [lemma] = normalize({ isv: 'råbota', partOfSpeech: 'f.' });
    assert.deepStrictEqual(lemma.words, [
      {
        form: 'råbota',
        lemma: 'råbota',
        upos: 'NOUN',
        feats: { Gender: 'Fem' },
        misc: undefined,
      },
    ]);
  });

  test('a multi-word lemma leaves its words unresolved', () => {
    // Which word carries the lexeme's upos cannot be decided here, so both
    // stay bare forms until a later pass resolves them.
    const [lemma] = normalize({ isv: 'dobry denj', partOfSpeech: 'phrase' });
    assert.deepStrictEqual(
      lemma.words.map((word) => [word.form, word.lemma, word.upos]),
      [
        ['dobry', undefined, undefined],
        ['denj', undefined, undefined],
      ],
    );
  });
});
