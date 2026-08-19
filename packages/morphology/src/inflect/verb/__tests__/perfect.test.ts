import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { conjugateVerb } from '../index.ts';
import { verbs_perfect } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('verb', () => {
  describe('perfect', () => {
    for (const [id, morphology, lemma, extra] of verbs_perfect()) {
      test(id, (t) => {
        const actual = conjugateVerb(lemma, extra, morphology);
        snap.match(t, `verb perfect ${id}`, actual);
      });
    }
  });
});
