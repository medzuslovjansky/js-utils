import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - numerals', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
    // Cardinal numerals
    [2856, 'num.card.', 'četyri', undefined],
    // Ordinal numerals
    [636, 'num.ord.', 'četvŕty', undefined],
    // Collective numerals
    [16431, 'num.coll.', 'četvero', undefined],
    // Distributive numerals
    [1, 'num.diff.', 'četveraky', undefined],
    // Fractional numerals
    [2, 'num.fract.', 'četvŕtina', undefined],
    // Multiplicative numerals
    [3, 'num.mult.', 'četverny', undefined],
    // Substantivized numerals
    [4, 'num.subst.', 'četverka', undefined],
    // Automatically inflecting numerals (kosť)
    [6, 'num.card.', 'šesť', undefined],
    [7, 'num.card.', 'sedm', undefined],
    [8, 'num.card.', 'osm', undefined],
    [9, 'num.card.', 'devęť', undefined],
    [10, 'num.card.', 'desęť', undefined],
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - numerals ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }
});
