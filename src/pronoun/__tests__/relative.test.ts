import { declensionPronoun } from '../declensionPronoun';
import { pronouns_relative } from '../../__utils__/fixtures';

describe('pronoun', () => {
  describe('relative', () => {
    test.each(pronouns_relative())('%s', (_id, _morphology, lemma) => {
      const actual = declensionPronoun(lemma, 'relative');
      expect(actual).toMatchSnapshot();
    });
  });
});
