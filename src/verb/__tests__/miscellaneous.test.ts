import { conjugationVerb } from '../conjugationVerb';
import { verbs_misc } from '../../__utils__/fixtures';

describe('verb', () => {
  describe('miscellaneous', () => {
    test.each(verbs_misc())('%s', (_id, morphology, lemma, extra) => {
      const actual = conjugationVerb(lemma, extra, morphology);
      expect(actual).toMatchSnapshot();
    });
  });
});
