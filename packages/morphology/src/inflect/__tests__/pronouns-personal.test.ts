import { describe, test } from 'node:test';
import assert from 'node:assert';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufy, conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - pronouns (personal)', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
    [1602, 'pron.pers.', 'ja', '(mene/mę, mně/mi, mnojų)'], // 1st person singular
    [675, 'pron.pers.', 'ty', '(tebe/tę, tobě/ti, tobojų)'], // 2nd person singular
    [2150, 'pron.pers.', 'on', '(jego, jemu, njim)'], // 3rd person masculine singular
    [792, 'pron.pers.', 'ona', '(jų, jej, njejų)'], // 3rd person feminine singular
    [2821, 'pron.pers.', 'ono', '(jego, jemu, njim)'], // 3rd person neuter singular
    [2722, 'pron.pers.', 'my', '(nas, nam, nami)'], // 1st person plural
    [1629, 'pron.pers.', 'vy', '(vas, vam, vami)'], // 2nd person plural
    [73, 'pron.pers.', 'oni', '(jih, jim, njimi)'], // 3rd person masculine plural
    [35621, 'pron.pers.', 'one', undefined], // 3rd person feminine/neuter plural
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - pronouns (personal) ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }

  test('aliases produce same output as lemma', () => {
    const xpos = 'pron.pers.';
    assert.deepStrictEqual(conllufy('mene', xpos), conllufy('ja', xpos));
    assert.deepStrictEqual(conllufy('tebe', xpos), conllufy('ty', xpos));
    assert.deepStrictEqual(conllufy('nas', xpos), conllufy('my', xpos));
    assert.deepStrictEqual(conllufy('vas', xpos), conllufy('vy', xpos));
  });
});
