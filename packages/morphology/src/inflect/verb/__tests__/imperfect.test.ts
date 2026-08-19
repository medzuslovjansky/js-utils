import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { conjugateVerb } from '../index.ts';
import { verbs_imperfect } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('verb', () => {
  describe('imperfect', () => {
    for (const [id, morphology, lemma, extra] of verbs_imperfect()) {
      test(id, (t) => {
        const actual = conjugateVerb(lemma, extra, morphology);
        snap.match(t, `verb imperfect ${id}`, actual);
      });
    }
  });
});
