import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - adjectives', () => {
  test.each([
    [36565, 'adj.', 'abhazsky', undefined],
    [6120, 'adj.', 'absolutny', undefined],
    [35660, 'adj.comp.', 'boljši', undefined],
    [35661, 'adj.sup.', 'najboljši', undefined],
  ])('%s', (id, xpos, word, irregular) => {
    const forms = conllufy(word, xpos, { id, irregular });
    const conlluString = formatTokensAsConllu(forms);
    expect(conlluString).toMatchSnapshot();
  });
});
