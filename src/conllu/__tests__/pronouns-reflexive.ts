import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - pronouns (reflexive)', () => {
  test.each([
    [4025, 'pron.refl.', 'sę', undefined],
    [4812, 'pron.refl.', 'sebe', '(sę, sobě/si, sobojų)'],
    [4811, 'pron.refl.', 'si', undefined],
    [337, 'pron.refl.', 'sobě', undefined],
  ])('%s', (id, xpos, word, irregular) => {
    const forms = conllufy(word, xpos, { id, irregular });
    const conlluString = formatTokensAsConllu(forms);
    expect(conlluString).toMatchSnapshot();
  });

  test('aliases produce same output as lemma', () => {
    const xpos = 'pron.refl.';
    const id = 0;
    // sę, sobě should resolve to sebe and produce the full paradigm
    expect(conllufy('sę', xpos, { id })).toEqual(
      conllufy('sebe', xpos, { id }),
    );
    expect(conllufy('sobě', xpos, { id })).toEqual(
      conllufy('sebe', xpos, { id }),
    );
    // 'si' is ambiguous (reflexive dative OR auxiliary 'byti' 2nd sg), so it won't resolve automatically
  });
});
