import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - pronouns (interrogative)', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
    [19670, 'pron.int.', 'čto', undefined],
    [3019, 'pron.int.', 'kto', undefined],
    [143, 'pron.int.', 'kogo', undefined],
    [5693, 'pron.int.', 'koj', undefined],
    [4189, 'pron.int.', 'ktory', undefined],
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - pronouns (interrogative) ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }
});
