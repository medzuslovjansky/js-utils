import { describe, it } from 'node:test';
import assert from 'node:assert';

import {
  createHardcodedLookup,
  type HardcodedParadigms,
} from './create-lookup.ts';

const PARADIGMS: HardcodedParadigms = {
  dva: {
    upos: 'NUM',
    feats: { NumType: 'Card' },
    forms: [
      { token: 'dva', feats: { Case: 'Nom', Gender: 'Masc' } },
      { token: 'dvě', feats: { Case: 'Nom', Gender: 'Fem' } },
    ],
  },
  dvasto: {
    upos: 'NUM',
    feats: { NumType: 'Card', Uninflect: 'Yes' },
  },
};

const lookup = createHardcodedLookup(PARADIGMS);

describe('createHardcodedLookup', () => {
  it('should answer for a lemma it has a paradigm for', () => {
    assert.deepStrictEqual(lookup('dva', 'num.card.'), [
      {
        form: 'dva',
        upos: 'NUM',
        feats: { NumType: 'Card', Case: 'Nom', Gender: 'Masc' },
      },
      {
        form: 'dvě',
        upos: 'NUM',
        feats: { NumType: 'Card', Case: 'Nom', Gender: 'Fem' },
      },
    ]);
  });

  it('should answer with the lemma itself when the paradigm lists no forms', () => {
    assert.deepStrictEqual(lookup('dvasto', 'num.card.'), [
      {
        form: 'dvasto',
        upos: 'NUM',
        feats: { NumType: 'Card', Uninflect: 'Yes' },
      },
    ]);
  });

  it('should say nothing about a lemma it has no paradigm for', () => {
    assert.deepStrictEqual(lookup('tri', 'num.card.'), []);
  });

  it('should say nothing when the tag reads the lemma as another part of speech', () => {
    assert.deepStrictEqual(lookup('dva', 'm.'), []);
  });
});
