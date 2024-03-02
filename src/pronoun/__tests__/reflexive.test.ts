import { declensionPronoun } from '../declensionPronoun';
import { pronouns_reflexive } from '../../__utils__/fixtures';

describe('pronoun', () => {
  describe('reflexive', () => {
    test.each(pronouns_reflexive())('%s', (_id, _morphology, lemma) => {
      const actual = declensionPronoun(lemma, 'reflexive');
      expect(actual).toMatchSnapshot();
    });
  });
});
