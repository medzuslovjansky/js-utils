import { declensionPronoun } from '../declensionPronoun';
import { pronouns_possessive } from '../../__utils__/fixtures';

describe('pronoun', () => {
  describe('possessive', () => {
    test.each(pronouns_possessive())('%s', (_id, _morphology, lemma) => {
      const actual = declensionPronoun(lemma, 'possessive');
      expect(actual).toMatchSnapshot();
    });
  });
});
