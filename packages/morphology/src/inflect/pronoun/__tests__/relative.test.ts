import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { declinePronoun } from '../index.ts';
import { pronouns_relative } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('pronoun', () => {
  describe('relative', () => {
    for (const [id, , lemma] of pronouns_relative()) {
      test(id, (t) => {
        const actual = declinePronoun(lemma, 'relative');
        snap.match(t, `pronoun relative ${id}`, actual);
      });
    }
  });
});
