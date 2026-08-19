import { describe, test } from 'node:test';
import assert from 'node:assert';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufy, conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - pronouns (indefinite)', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
    [19602, 'pron.indef.', 'čtokoli', undefined],
    [14502, 'pron.indef.', 'čto-libo', undefined],
    [1786, 'pron.indef.', 'čto-nebųď', undefined],
    [307, 'pron.indef.', 'inočto', undefined],
    [155, 'pron.indef.', 'inokto', undefined],
    [1454, 'pron.indef.', 'kaky', undefined],
    [19605, 'pron.indef.', 'kakykoli', undefined],
    [14631, 'pron.indef.', 'kaky-libo', undefined],
    [2711, 'pron.indef.', 'kaky-nebųď', undefined],
    [21315, 'pron.indef.', 'kojkoli', undefined],
    [5695, 'pron.indef.', 'koj-nebųď', undefined],
    [21322, 'pron.indef.', 'ktokoli', undefined],
    [322, 'pron.indef.', 'kto-nebųď', undefined],
    [19614, 'pron.indef.', 'ktorykoli', undefined],
    [14670, 'pron.indef.', 'ktory-libo', undefined],
    [2954, 'pron.indef.', 'ktory-nebųď', undefined],
    [19882, 'pron.indef.', 'něčto', undefined],
    [5696, 'pron.indef.', 'někoj', undefined],
    [4082, 'pron.indef.', 'někto', undefined],
    [19913, 'pron.indef.', 'ničto', undefined],
    [3344, 'pron.indef.', 'nijedin', '(nijedna, nijedno)'],
    [4, 'pron.indef.', 'nikto', undefined],
    [35113, 'pron.indef.', 'poněkoj', undefined],
    [35112, 'pron.indef.', 'poněktory', undefined],
    [1676, 'pron.indef.', 'vėś', '(vśa, vśe)'],
    [3098, 'pron.indef.', 'vse', undefined],
    [1675, 'pron.indef.', 'vsečto', undefined],
    [1823, 'pron.indef.', 'vsekto', undefined],
    [23790, 'pron.indef.', 'vsi', undefined],
    [14327, 'pron.indef.', 'žadėn', '(žadna, žadno)'],
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - pronouns (indefinite) ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }

  test('aliases produce same output as lemma', () => {
    const xpos = 'pron.indef.';

    // nijedin (nijedna, nijedno)
    assert.deepStrictEqual(
      conllufy('nijedna', xpos),
      conllufy('nijedin', xpos),
    );
    assert.deepStrictEqual(
      conllufy('nijedno', xpos),
      conllufy('nijedin', xpos),
    );

    // vėś (vśa, vśe)
    assert.deepStrictEqual(conllufy('vśa', xpos), conllufy('vėś', xpos));
    assert.deepStrictEqual(conllufy('vśe', xpos), conllufy('vėś', xpos));

    // žadėn (žadna, žadno)
    assert.deepStrictEqual(conllufy('žadna', xpos), conllufy('žadėn', xpos));
    assert.deepStrictEqual(conllufy('žadno', xpos), conllufy('žadėn', xpos));
  });
});
