import assert from 'node:assert';
import { describe, test } from 'node:test';

import { formatTokenAsConllu, formatTokens } from './format.ts';
import type { Token } from './schema.ts';

const columns = (line: string) => line.split('\t');

describe('formatTokenAsConllu', () => {
  test('a bare form fills the nine remaining columns with defaults', () => {
    assert.equal(
      formatTokenAsConllu({ form: 'žena' }),
      '_\tžena\t_\tX\t_\t_\t_\t_\t_\t_',
    );
  });

  test('a fully annotated token prints all ten columns', () => {
    const token: Token<'NOUN'> = {
      id: 1,
      form: 'ženy',
      lemma: 'žena',
      upos: 'NOUN',
      xpos: 'f.',
      feats: { Case: 'Nom', Gender: 'Fem', Number: 'Plur' },
      head: 0,
      deprel: 'root',
      deps: [{ head: 0, deprel: 'root' }],
      misc: { SID: '42' },
    };

    assert.equal(
      formatTokenAsConllu(token),
      '1\tženy\tžena\tNOUN\tf.\tCase=Nom|Gender=Fem|Number=Plur\t0\troot\t0:root\tSID=42',
    );
  });

  describe('ID', () => {
    test('the token id wins over the supplied fallback', () => {
      assert.equal(
        columns(formatTokenAsConllu({ id: 7, form: 'a' }, 3))[0],
        '7',
      );
    });

    test('the fallback fills in for a token with no id', () => {
      assert.equal(columns(formatTokenAsConllu({ form: 'a' }, 3))[0], '3');
    });
  });

  describe('FEATS', () => {
    test('features are sorted by name regardless of insertion order', () => {
      const token: Token<'NOUN'> = {
        form: 'ženy',
        feats: { Number: 'Plur', Case: 'Nom' },
      };
      assert.equal(
        columns(formatTokenAsConllu(token))[5],
        'Case=Nom|Number=Plur',
      );
    });

    test('an empty bundle is _', () => {
      assert.equal(
        columns(formatTokenAsConllu({ form: 'a', feats: {} }))[5],
        '_',
      );
    });

    // A bundle spread from optional properties keeps the keys but not the values.
    test('a bundle of nothing but absent features is _', () => {
      const token: Token<'NOUN'> = {
        form: 'a',
        feats: { Case: undefined, Number: undefined },
      };
      assert.equal(columns(formatTokenAsConllu(token))[5], '_');
    });

    test('absent features are dropped, present ones kept', () => {
      const token: Token<'NOUN'> = {
        form: 'a',
        feats: { Case: 'Gen', Number: undefined },
      };
      assert.equal(columns(formatTokenAsConllu(token))[5], 'Case=Gen');
    });
  });

  describe('HEAD', () => {
    test('head 0 is printed, not mistaken for absent', () => {
      assert.equal(
        columns(formatTokenAsConllu({ form: 'a', head: 0 }))[6],
        '0',
      );
    });
  });

  describe('DEPS', () => {
    test('an empty list is _', () => {
      assert.equal(
        columns(formatTokenAsConllu({ form: 'a', deps: [] }))[8],
        '_',
      );
    });

    test('relations are sorted by head', () => {
      const token: Token = {
        form: 'a',
        deps: [
          { head: 3, deprel: 'conj' },
          { head: 1, deprel: 'nsubj' },
        ],
      };
      assert.equal(columns(formatTokenAsConllu(token))[8], '1:nsubj|3:conj');
    });
  });

  describe('MISC', () => {
    test('an empty bag is _', () => {
      assert.equal(
        columns(formatTokenAsConllu({ form: 'a', misc: {} }))[9],
        '_',
      );
    });

    test('several entries are joined with a pipe', () => {
      const token: Token = { form: 'a', misc: { SID: '1', SpaceAfter: 'No' } };
      assert.equal(
        columns(formatTokenAsConllu(token))[9],
        'SID=1|SpaceAfter=No',
      );
    });

    test('drops an attribute that arrived as an explicit undefined', () => {
      const token: Token = { form: 'a', misc: { SID: '1', Gloss: undefined } };
      assert.equal(columns(formatTokenAsConllu(token))[9], 'SID=1');
    });

    // `Key=` is not a legal MISC entry, so an empty value drops out entirely.
    test('empty values are dropped', () => {
      const token: Token = { form: 'a', misc: { SID: '1', Gloss: '' } };
      assert.equal(columns(formatTokenAsConllu(token))[9], 'SID=1');
    });

    test('a bag of nothing but empty values is _', () => {
      assert.equal(
        columns(formatTokenAsConllu({ form: 'a', misc: { Gloss: '' } }))[9],
        '_',
      );
    });
  });
});

describe('formatTokens', () => {
  test('formats single token and token array polymorphically', () => {
    const t1: Token = { form: 'žena' };
    const t2: Token = { form: 'ženy' };
    assert.equal(formatTokens(t1), '_\tžena\t_\tX\t_\t_\t_\t_\t_\t_');
    assert.equal(
      formatTokens([t1, t2]),
      '1\tžena\t_\tX\t_\t_\t_\t_\t_\t_\n2\tženy\t_\tX\t_\t_\t_\t_\t_\t_',
    );
  });
});
