import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - nouns', () => {
  test.each([
    [2155, 'm./f.', 'pųť', undefined],
    [24047, 'm.sg.', 'absint', undefined],
    [7404, 'f.pl.', 'bliznečky', undefined],
    [2792, 'n.', 'nebo', '(neba/nebese)'],
    // Athematic declension examples
    [1313, 'm.', 'kamenj', ''],
    [1, 'n.', 'oko', '(oka/očese; pl. oči)'],
    [15074, 'n.', 'telę', ''],
    [17770, 'f.', 'mati', '(matere)'],
    [20837, 'f.', 'žȯlv', ''],
    [16928, 'f.', 'crkȯv', ''],
    [22830, 'f.', 'znajema', '(znajemoj)'],
    [37082, 'f.sg.', 'Vltava', undefined],
  ])('%s', (id, xpos, word, irregular) => {
    const forms = conllufy(word, xpos, { id, irregular });
    const conlluString = formatTokensAsConllu(forms);
    expect(conlluString).toMatchSnapshot();
  });
});
