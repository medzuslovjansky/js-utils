import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - pronouns (interrogative)', () => {
  test.each([
    [19670, 'pron.int.', 'čto', undefined],
    [3019, 'pron.int.', 'kto', undefined],
    [143, 'pron.int.', 'kogo', undefined],
    [5693, 'pron.int.', 'koj', undefined],
    [4189, 'pron.int.', 'ktory', undefined],
  ])('%s', (id, xpos, word, irregular) => {
    const forms = conllufy(word, xpos, { id, irregular });
    const conlluString = formatTokensAsConllu(forms);
    expect(conlluString).toMatchSnapshot();
  });
});
