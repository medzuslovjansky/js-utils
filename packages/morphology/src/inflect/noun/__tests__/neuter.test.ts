import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { declineNounSimple } from '../index.ts';
import { nouns_neuter } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('noun', () => {
  describe('neuter', () => {
    for (const [id, morphology, lemma, extra] of nouns_neuter()) {
      test(id, (t) => {
        const actual = declineNounSimple(lemma, morphology, extra);
        snap.match(t, `noun neuter ${id}`, actual);
      });
    }
  });
});
