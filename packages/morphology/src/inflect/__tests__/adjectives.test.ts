import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - adjectives', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
    [36565, 'adj.', 'abhazsky', undefined],
    [6120, 'adj.', 'absolutny', undefined],
    [35660, 'adj.comp.', 'boljši', undefined],
    [35661, 'adj.sup.', 'najboljši', undefined],
    // Not from feat/conllu-fy: all four cases above end in -y/-i, so none of
    // them reaches the Variant=Short branch of parse-xpos.
    [7179, 'adj.', 'dȯlžėn', '(dȯlžna, dȯlžno)'],
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - adjectives ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }
});
