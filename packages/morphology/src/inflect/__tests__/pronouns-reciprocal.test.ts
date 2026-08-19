import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - pronouns (reciprocal)', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
    [532, 'pron.rec.', 'jedin drugogo', undefined],
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - pronouns (reciprocal) ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }
});
