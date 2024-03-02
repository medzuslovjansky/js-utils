import { declensionPronoun } from '../declensionPronoun';
import { pronouns_reciprocal } from '../../__utils__/fixtures';

describe('pronoun', () => {
  describe('reciprocal', () => {
    test.each(pronouns_reciprocal())('%s', (_id, _morphology, lemma) => {
      const actual = declensionPronoun(lemma, 'reciprocal');
      expect(actual).toMatchSnapshot();
    });
  });
});
