import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - nouns', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
    [2155, 'm./f.', 'pųť', undefined],
    [24047, 'm.sg.', 'absint', undefined],
    [7404, 'f.pl.', 'bliznečky', undefined],
    [2792, 'n.', 'nebo', '(neba/nebese)'],
    // Athematic declension examples
    [1313, 'm.', 'kamenj', ''],
    [1, 'n.', 'oko', '(oka/očese; pl. oči)'],
    [15074, 'n.', 'telę', ''],
    [17770, 'f.', 'mati', '(matere)'],
    [20837, 'f.', 'žȯlv', ''],
    [16928, 'f.', 'crkȯv', ''],
    [22830, 'f.', 'znajema', '(znajemoj)'],
    [37082, 'f.sg.', 'Vltava', undefined],
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - nouns ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }
});
