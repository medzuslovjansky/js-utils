import { declensionPronoun } from '../declensionPronoun';
import { pronouns_personal } from '../../__utils__/fixtures';

describe('pronoun', () => {
  describe('personal', () => {
    test.each(pronouns_personal())('%s', (_id, _morphology, lemma) => {
      const actual = declensionPronoun(lemma, 'personal');
      expect(actual).toMatchSnapshot();
    });
  });
});
