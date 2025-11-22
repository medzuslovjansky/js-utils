import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - pronouns (reciprocal)', () => {
  test.each([[532, 'pron.rec.', 'jedin drugogo', undefined]])(
    '%s',
    (id, xpos, word, irregular) => {
      const forms = conllufy(word, xpos, { id, irregular });
      const conlluString = formatTokensAsConllu(forms);
      expect(conlluString).toMatchSnapshot();
    },
  );
});
