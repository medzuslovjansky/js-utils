import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { declinePronoun } from '../index.ts';
import { pronouns_possessive } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('pronoun', () => {
  describe('possessive', () => {
    for (const [id, , lemma] of pronouns_possessive()) {
      test(id, (t) => {
        const actual = declinePronoun(lemma, 'possessive');
        snap.match(t, `pronoun possessive ${id}`, actual);
      });
    }
  });
});
