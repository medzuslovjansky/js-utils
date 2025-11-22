import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - pronouns (relative)', () => {
  test.each([
    [8172, 'pron.rel.', 'iže', undefined],
    [5694, 'pron.rel.', 'koj', undefined],
    [2643, 'pron.rel.', 'ktory', undefined],
  ])('%s', (id, xpos, word, irregular) => {
    const forms = conllufy(word, xpos, { id, irregular });
    const conlluString = formatTokensAsConllu(forms);
    expect(conlluString).toMatchSnapshot();
  });
});
