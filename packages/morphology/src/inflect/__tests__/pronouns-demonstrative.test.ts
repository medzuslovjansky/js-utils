import { describe, test } from 'node:test';
import assert from 'node:assert';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufy, conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - pronouns (demonstrative)', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
    [2893, 'pron.dem.', 'tȯj', '(ta, to)'],
    [20212, 'pron.dem.', 'tȯjže', '(taže, tože)'],
    [19600, 'pron.dem.', 'onoj', '(ona, ono)'],
    [10387, 'pron.dem.', 'ov', '(ova, ovo)'],
    [1347, 'pron.dem.', 'sėj', '(śa, se)'],
    [2263, 'pron.dem.', 'tamtȯj', '(tamta, tamto)'],
    [1534, 'pron.dem.', 'tutȯj', '(tuta, tuto)'],
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - pronouns (demonstrative) ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }

  test('aliases produce same output as lemma', () => {
    const xpos = 'pron.dem.';

    // tȯj (ta, to)
    assert.deepStrictEqual(conllufy('ta', xpos), conllufy('tȯj', xpos));
    assert.deepStrictEqual(conllufy('to', xpos), conllufy('tȯj', xpos));

    // ov (ova, ovo)
    assert.deepStrictEqual(conllufy('ova', xpos), conllufy('ov', xpos));
    assert.deepStrictEqual(conllufy('ovo', xpos), conllufy('ov', xpos));

    // onoj (ona, ono)
    // 'ona'/'ono' here are Demonstrative (DET), so they shouldn't resolve to Personal (PRON) 'ona'/'ono'
    assert.deepStrictEqual(conllufy('ona', xpos), conllufy('onoj', xpos));
    assert.deepStrictEqual(conllufy('ono', xpos), conllufy('onoj', xpos));

    // sėj (śa, se)
    assert.deepStrictEqual(conllufy('śa', xpos), conllufy('sėj', xpos));
    assert.deepStrictEqual(conllufy('se', xpos), conllufy('sėj', xpos));

    // tamtȯj (tamta, tamto)
    assert.deepStrictEqual(conllufy('tamta', xpos), conllufy('tamtȯj', xpos));
    assert.deepStrictEqual(conllufy('tamto', xpos), conllufy('tamtȯj', xpos));

    // tutȯj (tuta, tuto)
    assert.deepStrictEqual(conllufy('tuta', xpos), conllufy('tutȯj', xpos));
    assert.deepStrictEqual(conllufy('tuto', xpos), conllufy('tutȯj', xpos));
  });
});
