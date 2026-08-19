import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - other', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
    // Suffixes
    [8668, 'suffix', '-kråtno', undefined],
    // Prefixes
    [16368, 'prefix', 'anti-', undefined],
    [7953, 'prefix', 'iz-', undefined],
    [28004, 'prefix', 'naj-', undefined],
    // Phrases
    [934, 'phrase', 'može byti', undefined],
    [182, 'phrase', 'dostavka i popytka', undefined],
    [33986, 'phrase', 'dŕti grlo', '(dre)'],
    // Particles
    [1821, 'particle', 'by', undefined],
    // Interjections
    [4886, 'intj.', 'ahoj', undefined],
    // Conjunctions
    [1855, 'conj.', 'a', undefined],
    [6375, 'conj.', 'abo', undefined],
    [5101, 'conj.', 'a takože', undefined],
    [17112, 'conj.', 'ako by', undefined],
    // Prepositions
    [1434, 'prep.', 'bez', '(+2)'],
    [2134, 'prep.', 'do', '(+2)'],
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - other ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }
});
