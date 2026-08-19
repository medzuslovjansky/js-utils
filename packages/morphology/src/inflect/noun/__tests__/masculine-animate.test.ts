import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { declineNounSimple } from '../index.ts';
import { nouns_masculine_animate } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('noun', () => {
  describe('masculine (animate)', () => {
    for (const [id, morphology, lemma, extra] of nouns_masculine_animate()) {
      test(id, (t) => {
        const actual = declineNounSimple(lemma, morphology, extra);
        snap.match(t, `noun masculine (animate) ${id}`, actual);
      });
    }
  });
});
