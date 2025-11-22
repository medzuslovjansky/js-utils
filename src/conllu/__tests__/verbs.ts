import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - verbs', () => {
  test.each([
    [5573, 'v.tr. pf.', 'blågosloviti', undefined],
    [2035, 'v.intr. ipf.', 'blěskati', undefined],
    [36422, 'v.refl. pf.', 'bodnųti sę', '(bode)'],
    [
      593,
      'v. intr. ipf.',
      'byti',
      '(jesm, jesi, jest, jesmo, jeste, sųt; byl; bųdų)',
    ],
    [6973, 'v.pf.', 'dati råbotų', '(da)'],
    [35371, 'v.tr. pf.', 'dobyti ponovno', '(dobųde)'],
    [2971, 'v.aux. ipf.', 'hotěti', '(hoće)'],
    [7739, 'v.aux. ipf.', 'htěti', '(hće)'],
    [417, 'v.aux. ipf.', 'iměti', '(imaje)'],
    [417.5, 'v.aux. ipf.', 'imati', '(imaje)'],
    [910, 'v.aux. ipf.', 'mogti', ''],
    [14711, 'v.aux. ipf.', 'morati', ''],
    [14719, 'v.aux. ipf.', 'musěti', '(musi)'],
    [1810, 'v.aux. ipf.', 'stavati', ''],
    [1942, 'v.aux. ipf.', 'trěbovati', ''],
    [389, 'v.aux. ipf.', 'uměti', ''],
    [30731, 'v.aux. pf.', 'smogti', ''],
    [2952, 'v.aux. pf.', 'stati', '(stane)'],
  ])('%s', (id, xpos, word, irregular) => {
    const forms = conllufy(word, xpos, { id, irregular });
    const conlluString = formatTokensAsConllu(forms);
    expect(conlluString).toMatchSnapshot();
  });

  test('aliases produce same output as lemma', () => {
    const xpos = 'v. aux.';
    const id = 0;

    for (const lemma of ['bųde/bųdųt', 'sųt', 'jesm']) {
      expect(conllufy(lemma, xpos, { id })).toEqual(
        conllufy('byti', xpos, { id }),
      );
    }
  });
});
