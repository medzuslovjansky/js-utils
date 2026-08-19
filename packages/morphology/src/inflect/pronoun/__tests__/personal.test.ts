import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { declinePronoun } from '../index.ts';
import { pronouns_personal } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('pronoun', () => {
  describe('personal', () => {
    for (const [id, , lemma] of pronouns_personal()) {
      test(id, (t) => {
        const actual = declinePronoun(lemma, 'personal');
        snap.match(t, `pronoun personal ${id}`, actual);
      });
    }
  });
});
