import { describe, test } from 'node:test';
import assert from 'node:assert';
import { snapshots } from '@interslavic/dev-snapshot';

import type { XPOS } from '@interslavic/conllu';
import { conllufy, conllufyToString } from '../../__utils__/conllufy.ts';

const snap = snapshots(import.meta.filename);

describe('conllufy - pronouns (reflexive)', () => {
  const cases: [number, XPOS, string, string | undefined][] = [
    [4025, 'pron.refl.', 'sę', undefined],
    [4812, 'pron.refl.', 'sebe', '(sę, sobě/si, sobojų)'],
    [4811, 'pron.refl.', 'si', undefined],
    [337, 'pron.refl.', 'sobě', undefined],
  ];

  for (const [id, xpos, word, irregular] of cases) {
    test(String(id), (t) => {
      snap.match(
        t,
        `conllufy - pronouns (reflexive) ${id}`,
        conllufyToString(word, xpos, irregular),
      );
    });
  }

  test('aliases produce same output as lemma', () => {
    const xpos = 'pron.refl.';
    // sę, sobě should resolve to sebe and produce the full paradigm
    assert.deepStrictEqual(conllufy('sę', xpos), conllufy('sebe', xpos));
    assert.deepStrictEqual(conllufy('sobě', xpos), conllufy('sebe', xpos));
    // 'si' is ambiguous (reflexive dative OR auxiliary 'byti' 2nd sg), so it won't resolve automatically
  });
});
