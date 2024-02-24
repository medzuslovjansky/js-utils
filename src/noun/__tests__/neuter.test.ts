import { declensionNounSimple } from '../declensionNounSimple';
import { nouns_neuter } from '../../__utils__/fixtures';

describe('noun', () => {
  describe('neuter', () => {
    test.each(nouns_neuter())('%s', (_id, morphology, lemma, extra) => {
      const actual = declensionNounSimple(lemma, morphology, extra);
      expect(actual).toMatchSnapshot();
    });
  });
});
