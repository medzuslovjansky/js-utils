import { declensionPronoun } from '../declensionPronoun';
import { pronouns_interrogative } from '../../__utils__/fixtures';

describe('pronoun', () => {
  describe('interrogative', () => {
    test.each(pronouns_interrogative())('%s', (_id, _morphology, lemma) => {
      const actual = declensionPronoun(lemma, 'interrogative');
      expect(actual).toMatchSnapshot();
    });
  });
});
