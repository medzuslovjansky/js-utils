import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { declineNounSimple } from '../index.ts';
import { nouns_misc } from '../../../__utils__/fixtures.ts';

const snap = snapshots(import.meta.filename);

describe('noun', () => {
  describe('miscellaneous', () => {
    // The only suite with named snapshot hints: the key is `<test>: <hint>`.
    for (const gender of ['masculine', 'feminine'] as const) {
      for (const [id, morphology, lemma, extra] of nouns_misc()) {
        test(`${id} (as ${gender})`, (t) => {
          const actual = declineNounSimple(lemma, morphology, extra, gender);
          snap.match(
            t,
            `noun miscellaneous ${id} (as ${gender}): ${gender}`,
            actual,
          );
        });
      }
    }
  });
});
