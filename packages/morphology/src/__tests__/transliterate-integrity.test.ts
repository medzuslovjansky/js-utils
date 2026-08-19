import { describe, test } from 'node:test';
import assert from 'node:assert';

import { transliterate } from '@interslavic/translit';

import * as fixtures from '../__utils__/fixtures.ts';

describe('transliteration integrity', () => {
  for (const [id, , lemma, additional] of [
    ...fixtures.adjectives(),
    ...fixtures.nouns_feminine(),
    ...fixtures.nouns_masculine_animate(),
    ...fixtures.nouns_masculine(),
    ...fixtures.nouns_misc(),
    ...fixtures.nouns_neuter(),
    ...fixtures.verbs_imperfect(),
    ...fixtures.verbs_perfect(),
    ...fixtures.verbs_misc(),
    ...fixtures.pronouns_demonstrative(),
    ...fixtures.pronouns_indefinite(),
    ...fixtures.pronouns_interrogative(),
    ...fixtures.pronouns_personal(),
    ...fixtures.pronouns_possessive(),
    ...fixtures.pronouns_reciprocal(),
    ...fixtures.pronouns_reflexive(),
    ...fixtures.pronouns_relative(),
    ...fixtures.other(),
  ]) {
    test(id, () => {
      const value = lemma + ' ' + additional;
      const script = 'isv-Cyrl-x-etymolog';
      const withPreprocessing = transliterate(value, script, false);
      const withoutPreprocessing = transliterate(value, script, true);
      assert.strictEqual(withPreprocessing, withoutPreprocessing);
    });
  }
});
