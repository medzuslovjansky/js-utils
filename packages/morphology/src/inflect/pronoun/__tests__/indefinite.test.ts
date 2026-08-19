import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { declinePronoun } from '../index.ts';
import { pronouns_indefinite } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('pronoun', () => {
  describe('indefinite', () => {
    for (const [id, , lemma] of pronouns_indefinite()) {
      test(id, (t) => {
        const actual = declinePronoun(lemma, 'indefinite');
        snap.match(t, `pronoun indefinite ${id}`, actual);
      });
    }
  });
});
