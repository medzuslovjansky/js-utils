import { declensionNounSimple } from '../declensionNounSimple';
import { nouns_masculine_animate } from '../../__utils__/fixtures';

describe('noun', () => {
  describe('masculine (animate)', () => {
    test.each(nouns_masculine_animate())(
      '%s',
      (_id, morphology, lemma, extra) => {
        const actual = declensionNounSimple(lemma, morphology, extra);
        expect(actual).toMatchSnapshot();
      },
    );
  });
});
