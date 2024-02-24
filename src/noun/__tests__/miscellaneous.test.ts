import { declensionNounSimple } from '../declensionNounSimple';
import { nouns_misc } from '../../__utils__/fixtures';

describe('noun', () => {
  describe('miscellaneous', () => {
    test.each(nouns_misc())(
      '%s (as masculine)',
      (_id, morphology, lemma, extra) => {
        const masculine = declensionNounSimple(
          lemma,
          morphology,
          extra,
          'masculine',
        );
        expect(masculine).toMatchSnapshot('masculine');
      },
    );

    test.each(nouns_misc())(
      '%s (as feminine)',
      (_id, morphology, lemma, extra) => {
        const feminine = declensionNounSimple(
          lemma,
          morphology,
          extra,
          'feminine',
        );
        expect(feminine).toMatchSnapshot('feminine');
      },
    );
  });
});
