import { declensionNounSimple } from '../declensionNounSimple';
import { nouns_feminine } from '../../__utils__/fixtures';

describe('noun', () => {
  describe('feminine', () => {
    test.each(nouns_feminine())('%s', (_id, morphology, lemma, extra) => {
      const actual = declensionNounSimple(lemma, morphology, extra);
      expect(actual).toMatchSnapshot();
    });
  });
});
