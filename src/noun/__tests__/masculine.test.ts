import { declensionNounSimple } from '../declensionNounSimple';
import { nouns_masculine } from '../../__utils__/fixtures';

describe('noun', () => {
  describe('masculine', () => {
    test.each(nouns_masculine())('%s', (_id, morphology, lemma, extra) => {
      const actual = declensionNounSimple(lemma, morphology, extra);
      expect(actual).toMatchSnapshot();
    });
  });
});
