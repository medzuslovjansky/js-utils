import { describe, test } from 'node:test';
import assert from 'node:assert';

import type { SteenLemma } from './parse-lemma.ts';
import { parseSteenLemma } from './parse-lemma.ts';

describe('parseSteenLemma', () => {
  describe('parsed from a string', () => {
    // `annotation: undefined` is spelled out because parseSteenLemma always
    // sets the key, and assert.deepStrictEqual — unlike the bun/jest `toEqual`
    // this suite came from — does not treat an undefined value as an absent key.
    const cases: [string, SteenLemma[]][] = [
      ['běguči', [{ value: 'běguči', annotation: undefined }]],
      ['око (устар.)', [{ value: 'око', annotation: 'устар.' }]],
      ['той, що біжить', [{ value: 'той, що біжить', annotation: undefined }]],
      [
        'bring (up) on (colloq.; slang)',
        [{ value: 'bring (up) on', annotation: 'colloq.; slang' }],
      ],
      [
        'dovoditi do/k',
        [
          { value: 'dovoditi do', annotation: undefined },
          { value: 'dovoditi k', annotation: undefined },
        ],
      ],
      [
        'word a/b c/d',
        [
          { value: 'word a c', annotation: undefined },
          { value: 'word a d', annotation: undefined },
          { value: 'word b c', annotation: undefined },
          { value: 'word b d', annotation: undefined },
        ],
      ],
      [
        'foo/bar (annot)',
        [
          { value: 'foo', annotation: 'annot' },
          { value: 'bar', annotation: 'annot' },
        ],
      ],
    ];

    for (const [testString, expected] of cases) {
      test(`${JSON.stringify(testString)} should be parsed correctly`, () => {
        assert.deepStrictEqual([...parseSteenLemma(testString)], expected);
      });
    }

    test('should ignore empty annotations', () => {
      const lemmas = [...parseSteenLemma('pråzdne anotacije ()')];
      assert.deepStrictEqual(lemmas, [
        { value: 'pråzdne anotacije', annotation: undefined },
      ]);
    });

    for (const testString of [
      'zabezpamečena lěva zatvorka)',
      'zabezpamečena prava zatvorka (',
      'měšane ) zatvorky (',
    ]) {
      test(`should ignore annotations if there are unbalanced brackets: ${testString}`, () => {
        assert.deepStrictEqual(
          [...parseSteenLemma(testString)],
          [{ value: testString, annotation: undefined }],
        );
      });
    }
  });
});
