import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { declinePronoun } from '../index.ts';
import { pronouns_reciprocal } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('pronoun', () => {
  describe('reciprocal', () => {
    for (const [id, , lemma] of pronouns_reciprocal()) {
      test(id, (t) => {
        const actual = declinePronoun(lemma, 'reciprocal');
        snap.match(t, `pronoun reciprocal ${id}`, actual);
      });
    }
  });
});
