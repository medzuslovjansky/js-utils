import { declensionPronoun } from '../declensionPronoun';
import { pronouns_indefinite } from '../../__utils__/fixtures';

describe('pronoun', () => {
  describe('indefinite', () => {
    test.each(pronouns_indefinite())('%s', (_id, _morphology, lemma) => {
      const actual = declensionPronoun(lemma, 'indefinite');
      expect(actual).toMatchSnapshot();
    });
  });
});
