import { conjugationVerb } from '../conjugationVerb';
import { verbs_perfect } from '../../__utils__/fixtures';

describe('verb', () => {
  describe('perfect', () => {
    test.each(verbs_perfect())('%s', (_id, morphology, lemma, extra) => {
      const actual = conjugationVerb(lemma, extra, morphology);
      expect(actual).toMatchSnapshot();
    });
  });
});
