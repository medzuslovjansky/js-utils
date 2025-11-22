import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - pronouns (possessive)', () => {
  test.each([
    [920, 'pron.poss.', 'moj', undefined], // 1st person singular
    [2231, 'pron.poss.', 'tvoj', undefined], // 2nd person singular
    [512, 'pron.poss.', 'jego', undefined], // 3rd person masculine/neuter singular (short)
    [6256, 'pron.poss.', 'jegov', undefined], // 3rd person masculine/neuter singular (long)
    [2195, 'pron.poss.', 'jej', undefined], // 3rd person feminine singular (short)
    [6257, 'pron.poss.', 'jejin', undefined], // 3rd person feminine singular (long)
    [1993, 'pron.poss.', 'naš', undefined], // 1st person plural
    [1631, 'pron.poss.', 'vaš', undefined], // 2nd person plural
    [2601, 'pron.poss.', 'jih', undefined], // 3rd person plural (short)
    [6258, 'pron.poss.', 'jihny', undefined], // 3rd person plural (long)
    [1099, 'pron.poss.', 'svoj', undefined], // reflexive possessive
    [190, 'pron.poss.', 'čij-nebųď', undefined], // indefinite possessive
  ])('%s', (id, xpos, word, irregular) => {
    const forms = conllufy(word, xpos, { id, irregular });
    const conlluString = formatTokensAsConllu(forms);
    expect(conlluString).toMatchSnapshot();
  });

  test('aliases produce same output as lemma', () => {
    const xpos = 'pron.poss.';
    const id = 0;

    // moj (moja, moje)
    expect(conllufy('moja', xpos, { id })).toEqual(
      conllufy('moj', xpos, { id }),
    );
    expect(conllufy('moje', xpos, { id })).toEqual(
      conllufy('moj', xpos, { id }),
    );

    // tvoj (tvoja, tvoje)
    expect(conllufy('tvoja', xpos, { id })).toEqual(
      conllufy('tvoj', xpos, { id }),
    );
    expect(conllufy('tvoje', xpos, { id })).toEqual(
      conllufy('tvoj', xpos, { id }),
    );

    // naš (naša, naše)
    expect(conllufy('naša', xpos, { id })).toEqual(
      conllufy('naš', xpos, { id }),
    );
    expect(conllufy('naše', xpos, { id })).toEqual(
      conllufy('naš', xpos, { id }),
    );

    // vaš (vaša, vaše)
    expect(conllufy('vaša', xpos, { id })).toEqual(
      conllufy('vaš', xpos, { id }),
    );
    expect(conllufy('vaše', xpos, { id })).toEqual(
      conllufy('vaš', xpos, { id }),
    );

    // svoj (svoja, svoje)
    expect(conllufy('svoja', xpos, { id })).toEqual(
      conllufy('svoj', xpos, { id }),
    );
    expect(conllufy('svoje', xpos, { id })).toEqual(
      conllufy('svoj', xpos, { id }),
    );
  });
});
