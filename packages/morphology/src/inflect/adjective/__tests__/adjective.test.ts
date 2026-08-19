import { describe, test } from 'node:test';
import assert from 'node:assert';
import { snapshots } from '@interslavic/dev-snapshot';

import { declineAdjective } from '../index.ts';
import { adjectives } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('adjective', () => {
  for (const [id, morphology, lemma] of adjectives()) {
    test(id, (t) => {
      assert.ok(
        morphology.startsWith('adj'),
        `not an adjective: ${morphology}`,
      );
      const actual = declineAdjective(lemma, '', morphology);
      snap.match(t, `adjective ${id}`, actual);
    });
  }
});
