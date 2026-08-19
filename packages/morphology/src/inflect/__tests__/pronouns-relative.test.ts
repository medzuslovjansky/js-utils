import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - pronouns (relative)', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
    [8172, 'pron.rel.', 'iže', undefined],
    [5694, 'pron.rel.', 'koj', undefined],
    [2643, 'pron.rel.', 'ktory', undefined],
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - pronouns (relative) ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }
});
