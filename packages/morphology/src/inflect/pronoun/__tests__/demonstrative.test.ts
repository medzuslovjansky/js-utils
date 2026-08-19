import { describe, test } from 'node:test';
import assert from 'node:assert';
import { snapshots } from '@interslavic/dev-snapshot';

import { declinePronoun } from '../index.ts';
import { pronouns_demonstrative } from '../../../__utils__/fixtures.ts';
import { declinePronounSimple } from '../index.ts';

const snap = snapshots(import.meta.filename);

describe('pronoun', () => {
  describe('demonstrative', () => {
    for (const [id, , lemma] of pronouns_demonstrative()) {
      test(id, (t) => {
        const actual = declinePronoun(lemma, 'demonstrative');
        snap.match(t, `pronoun demonstrative ${id}`, actual);
      });
    }

    for (const [alternative, canonical] of [
      ['ona', 'onȯj'],
      ['ono', 'onȯj'],
      ['ota', 'otȯj'],
      ['oto', 'otȯj'],
      ['ova', 'ov'],
      ['ovo', 'ov'],
      ['tamta', 'tamtȯj'],
      ['tamto', 'tamtȯj'],
      ['tuta', 'tutȯj'],
      ['tuto', 'tutȯj'],
      ['ta', 'tȯj'],
      ['to', 'tȯj'],
      ['te', 'tȯj'],
      ['se', 'sėj'],
      ['sa', 'sėj'],
    ]) {
      test(`${alternative} (pron.dem.) should decline as ${canonical}`, () => {
        const actual = declinePronounSimple(alternative, 'pron.dem.');
        const expected = declinePronounSimple(canonical, 'pron.dem.');
        assert.deepStrictEqual(actual, expected);
      });
    }
  });
});
