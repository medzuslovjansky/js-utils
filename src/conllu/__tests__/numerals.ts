import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - numerals', () => {
  test.each([
    // Cardinal numerals
    [2856, 'num.card.', 'četyri', undefined],
    // Ordinal numerals
    [636, 'num.ord.', 'četvŕty', undefined],
    // Collective numerals
    [16431, 'num.coll.', 'četvero', undefined],
    // Distributive numerals
    [1, 'num.diff.', 'četveraky', undefined],
    // Fractional numerals
    [2, 'num.fract.', 'četvŕtina', undefined],
    // Multiplicative numerals
    [3, 'num.mult.', 'četverny', undefined],
    // Substantivized numerals
    [4, 'num.subst.', 'četverka', undefined],
    // Automatically inflecting numerals (kosť)
    [6, 'num.card.', 'šesť', undefined],
    [7, 'num.card.', 'sedm', undefined],
    [8, 'num.card.', 'osm', undefined],
    [9, 'num.card.', 'devęť', undefined],
    [10, 'num.card.', 'desęť', undefined],
  ])('%s', (id, xpos, word, irregular) => {
    const forms = conllufy(word, xpos, { id, irregular });
    const conlluString = formatTokensAsConllu(forms);
    expect(conlluString).toMatchSnapshot();
  });
});
