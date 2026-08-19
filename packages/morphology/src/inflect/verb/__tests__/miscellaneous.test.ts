import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { conjugateVerb } from '../index.ts';
import { verbs_misc } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('verb', () => {
  describe('miscellaneous', () => {
    for (const [id, morphology, lemma, extra] of verbs_misc()) {
      test(id, (t) => {
        const actual = conjugateVerb(lemma, extra, morphology);
        snap.match(t, `verb miscellaneous ${id}`, actual);
      });
    }
  });
});
