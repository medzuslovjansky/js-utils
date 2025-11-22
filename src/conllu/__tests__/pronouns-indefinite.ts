import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - pronouns (indefinite)', () => {
  test.each([
    [19602, 'pron.indef.', 'čtokoli', undefined],
    [14502, 'pron.indef.', 'čto-libo', undefined],
    [1786, 'pron.indef.', 'čto-nebųď', undefined],
    [307, 'pron.indef.', 'inočto', undefined],
    [155, 'pron.indef.', 'inokto', undefined],
    [1454, 'pron.indef.', 'kaky', undefined],
    [19605, 'pron.indef.', 'kakykoli', undefined],
    [14631, 'pron.indef.', 'kaky-libo', undefined],
    [2711, 'pron.indef.', 'kaky-nebųď', undefined],
    [21315, 'pron.indef.', 'kojkoli', undefined],
    [5695, 'pron.indef.', 'koj-nebųď', undefined],
    [21322, 'pron.indef.', 'ktokoli', undefined],
    [322, 'pron.indef.', 'kto-nebųď', undefined],
    [19614, 'pron.indef.', 'ktorykoli', undefined],
    [14670, 'pron.indef.', 'ktory-libo', undefined],
    [2954, 'pron.indef.', 'ktory-nebųď', undefined],
    [19882, 'pron.indef.', 'něčto', undefined],
    [5696, 'pron.indef.', 'někoj', undefined],
    [4082, 'pron.indef.', 'někto', undefined],
    [19913, 'pron.indef.', 'ničto', undefined],
    [3344, 'pron.indef.', 'nijedin', '(nijedna, nijedno)'],
    [4, 'pron.indef.', 'nikto', undefined],
    [35113, 'pron.indef.', 'poněkoj', undefined],
    [35112, 'pron.indef.', 'poněktory', undefined],
    [1676, 'pron.indef.', 'vėś', '(vśa, vśe)'],
    [3098, 'pron.indef.', 'vse', undefined],
    [1675, 'pron.indef.', 'vsečto', undefined],
    [1823, 'pron.indef.', 'vsekto', undefined],
    [23790, 'pron.indef.', 'vsi', undefined],
    [14327, 'pron.indef.', 'žadėn', '(žadna, žadno)'],
  ])('%s', (id, xpos, word, irregular) => {
    const forms = conllufy(word, xpos, { id, irregular });
    const conlluString = formatTokensAsConllu(forms);
    expect(conlluString).toMatchSnapshot();
  });

  test('aliases produce same output as lemma', () => {
    const xpos = 'pron.indef.';
    const id = 0;

    // nijedin (nijedna, nijedno)
    expect(conllufy('nijedna', xpos, { id })).toEqual(
      conllufy('nijedin', xpos, { id }),
    );
    expect(conllufy('nijedno', xpos, { id })).toEqual(
      conllufy('nijedin', xpos, { id }),
    );

    // vėś (vśa, vśe)
    expect(conllufy('vśa', xpos, { id })).toEqual(
      conllufy('vėś', xpos, { id }),
    );
    expect(conllufy('vśe', xpos, { id })).toEqual(
      conllufy('vėś', xpos, { id }),
    );

    // žadėn (žadna, žadno)
    expect(conllufy('žadna', xpos, { id })).toEqual(
      conllufy('žadėn', xpos, { id }),
    );
    expect(conllufy('žadno', xpos, { id })).toEqual(
      conllufy('žadėn', xpos, { id }),
    );
  });
});
