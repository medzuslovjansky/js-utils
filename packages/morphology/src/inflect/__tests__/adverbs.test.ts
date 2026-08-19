import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - adverbs', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
    [6123, 'adv.', 'absolutno', undefined],
    [6123, 'adv.comp.', 'lěpje', undefined],
    [6123, 'adv.sup.', 'najlěpje', undefined],
    [16921, 'adv.', 'aktivno', undefined],
    [19603, 'adv.', 'kdekoli', undefined],
    [120, 'adv.', 'kȯgda-nebųď', undefined],
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - adverbs ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }
});
