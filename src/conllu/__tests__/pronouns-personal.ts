import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - pronouns (personal)', () => {
  test.each([
    [1602, 'pron.pers.', 'ja', '(mene/mę, mně/mi, mnojų)'], // 1st person singular
    [675, 'pron.pers.', 'ty', '(tebe/tę, tobě/ti, tobojų)'], // 2nd person singular
    [2150, 'pron.pers.', 'on', '(jego, jemu, njim)'], // 3rd person masculine singular
    [792, 'pron.pers.', 'ona', '(jų, jej, njejų)'], // 3rd person feminine singular
    [2821, 'pron.pers.', 'ono', '(jego, jemu, njim)'], // 3rd person neuter singular
    [2722, 'pron.pers.', 'my', '(nas, nam, nami)'], // 1st person plural
    [1629, 'pron.pers.', 'vy', '(vas, vam, vami)'], // 2nd person plural
    [73, 'pron.pers.', 'oni', '(jih, jim, njimi)'], // 3rd person masculine plural
    [35621, 'pron.pers.', 'one', undefined], // 3rd person feminine/neuter plural
  ])('%s', (id, xpos, word, irregular) => {
    const forms = conllufy(word, xpos, { id, irregular });
    const conlluString = formatTokensAsConllu(forms);
    expect(conlluString).toMatchSnapshot();
  });

  test('aliases produce same output as lemma', () => {
    const xpos = 'pron.pers.';
    const id = 0;
    expect(conllufy('mene', xpos, { id })).toEqual(
      conllufy('ja', xpos, { id }),
    );
    expect(conllufy('tebe', xpos, { id })).toEqual(
      conllufy('ty', xpos, { id }),
    );
    expect(conllufy('nas', xpos, { id })).toEqual(conllufy('my', xpos, { id }));
    expect(conllufy('vas', xpos, { id })).toEqual(conllufy('vy', xpos, { id }));
  });
});
