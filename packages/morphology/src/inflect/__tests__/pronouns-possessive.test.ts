import { describe, test } from 'node:test';
import assert from 'node:assert';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufy, conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - pronouns (possessive)', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
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
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - pronouns (possessive) ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }

  test('aliases produce same output as lemma', () => {
    const xpos = 'pron.poss.';

    // moj (moja, moje)
    assert.deepStrictEqual(conllufy('moja', xpos), conllufy('moj', xpos));
    assert.deepStrictEqual(conllufy('moje', xpos), conllufy('moj', xpos));

    // tvoj (tvoja, tvoje)
    assert.deepStrictEqual(conllufy('tvoja', xpos), conllufy('tvoj', xpos));
    assert.deepStrictEqual(conllufy('tvoje', xpos), conllufy('tvoj', xpos));

    // naš (naša, naše)
    assert.deepStrictEqual(conllufy('naša', xpos), conllufy('naš', xpos));
    assert.deepStrictEqual(conllufy('naše', xpos), conllufy('naš', xpos));

    // vaš (vaša, vaše)
    assert.deepStrictEqual(conllufy('vaša', xpos), conllufy('vaš', xpos));
    assert.deepStrictEqual(conllufy('vaše', xpos), conllufy('vaš', xpos));

    // svoj (svoja, svoje)
    assert.deepStrictEqual(conllufy('svoja', xpos), conllufy('svoj', xpos));
    assert.deepStrictEqual(conllufy('svoje', xpos), conllufy('svoj', xpos));
  });
});
