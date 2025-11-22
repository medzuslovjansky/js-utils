import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - adverbs', () => {
  test.each([
    [6123, 'adv.', 'absolutno', undefined],
    [6123, 'adv.comp.', 'lěpje', undefined],
    [6123, 'adv.sup.', 'najlěpje', undefined],
    [16921, 'adv.', 'aktivno', undefined],
    [19603, 'adv.', 'kdekoli', undefined],
    [120, 'adv.', 'kȯgda-nebųď', undefined],
  ])('%s', (id, xpos, word, irregular) => {
    const forms = conllufy(word, xpos, { id, irregular });
    const conlluString = formatTokensAsConllu(forms);
    expect(conlluString).toMatchSnapshot();
  });
});
