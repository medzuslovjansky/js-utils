import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { declinePronoun } from '../index.ts';
import { pronouns_reflexive } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('pronoun', () => {
  describe('reflexive', () => {
    for (const [id, , lemma] of pronouns_reflexive()) {
      test(id, (t) => {
        const actual = declinePronoun(lemma, 'reflexive');
        snap.match(t, `pronoun reflexive ${id}`, actual);
      });
    }
  });
});
