import { describe, test } from 'node:test';
import assert from 'node:assert';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufy, conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - verbs', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
    [5573, 'v.tr. pf.', 'blågosloviti', undefined],
    [2035, 'v.intr. ipf.', 'blěskati', undefined],
    [36422, 'v.refl. pf.', 'bodnųti sę', '(bode)'],
    [
      593,
      'v. intr. ipf.',
      'byti',
      '(jesm, jesi, jest, jesmo, jeste, sųt; byl; bųdų)',
    ],
    [6973, 'v.pf.', 'dati råbotų', '(da)'],
    [35371, 'v.tr. pf.', 'dobyti ponovno', '(dobųde)'],
    [2971, 'v.aux. ipf.', 'hotěti', '(hoće)'],
    [7739, 'v.aux. ipf.', 'htěti', '(hće)'],
    [417, 'v.aux. ipf.', 'iměti', '(imaje)'],
    [417.5, 'v.aux. ipf.', 'imati', '(imaje)'],
    [910, 'v.aux. ipf.', 'mogti', ''],
    [14711, 'v.aux. ipf.', 'morati', ''],
    [14719, 'v.aux. ipf.', 'musěti', '(musi)'],
    [1810, 'v.aux. ipf.', 'stavati', ''],
    [1942, 'v.aux. ipf.', 'trěbovati', ''],
    [389, 'v.aux. ipf.', 'uměti', ''],
    [30731, 'v.aux. pf.', 'smogti', ''],
    [2952, 'v.aux. pf.', 'stati', '(stane)'],
    // Not from feat/conllu-fy: none of its cases is biaspectual, and parse-xpos
    // treats those as one result with no Aspect, because the curated
    // lemmas table already splits them and a second pass would double them.
    [11, 'v.intr. ipf./pf.', 'abdikovati', ''],
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - verbs ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }

  test('aliases produce same output as lemma', () => {
    const xpos = 'v. aux.';

    for (const lemma of ['bųde/bųdųt', 'sųt', 'jesm']) {
      assert.deepStrictEqual(conllufy(lemma, xpos), conllufy('byti', xpos));
    }
  });
});
