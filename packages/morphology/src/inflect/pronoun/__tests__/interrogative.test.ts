import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { declinePronoun } from '../index.ts';
import { pronouns_interrogative } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('pronoun', () => {
  describe('interrogative', () => {
    for (const [id, , lemma] of pronouns_interrogative()) {
      test(id, (t) => {
        const actual = declinePronoun(lemma, 'interrogative');
        snap.match(t, `pronoun interrogative ${id}`, actual);
      });
    }
  });
});
