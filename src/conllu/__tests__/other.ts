import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - other', () => {
  test.each([
    // Suffixes
    [8668, 'suffix', '-kråtno', undefined],
    // Prefixes
    [16368, 'prefix', 'anti-', undefined],
    [7953, 'prefix', 'iz-', undefined],
    [28004, 'prefix', 'naj-', undefined],
    // Phrases
    [934, 'phrase', 'može byti', undefined],
    [182, 'phrase', 'dostavka i popytka', undefined],
    [33986, 'phrase', 'dŕti grlo', '(dre)'],
    // Particles
    [1821, 'particle', 'by', undefined],
    // Interjections
    [4886, 'intj.', 'ahoj', undefined],
    // Conjunctions
    [1855, 'conj.', 'a', undefined],
    [6375, 'conj.', 'abo', undefined],
    [5101, 'conj.', 'a takože', undefined],
    [17112, 'conj.', 'ako by', undefined],
    // Prepositions
    [1434, 'prep.', 'bez', '(+2)'],
    [2134, 'prep.', 'do', '(+2)'],
  ])('%s', (id, xpos, word, irregular) => {
    const forms = conllufy(word, xpos, { id, irregular });
    const conlluString = formatTokensAsConllu(forms);
    expect(conlluString).toMatchSnapshot();
  });
});
