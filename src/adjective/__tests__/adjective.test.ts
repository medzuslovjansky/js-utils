import { declensionAdjective } from '../declensionAdjective';
import { adjectives } from '../../__utils__/fixtures';

describe('adjective', () => {
  test.each(adjectives())('%s', (_id, morphology, lemma) => {
    if (!morphology.startsWith('adj')) throw 'not an adjective';
    const actual = declensionAdjective(lemma, '', morphology);
    expect(actual).toMatchSnapshot();
  });
});
