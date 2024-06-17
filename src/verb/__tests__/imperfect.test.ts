import { conjugationVerb } from '../conjugationVerb';
import { verbs_imperfect } from '../../__utils__/fixtures';

describe('verb', () => {
  describe('imperfect', () => {
    test.each(verbs_imperfect())('%s', (_id, morphology, lemma, extra) => {
      const actual = conjugationVerb(lemma, extra, morphology);
      expect(actual).toMatchSnapshot();
    });
  });
});
