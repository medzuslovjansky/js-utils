import { describe, test } from 'node:test';
import assert from 'node:assert';

import type { SteenLemma } from './parse-lemma.ts';
import { splitSteenLemmas } from './split-lemmas.ts';

describe('splitSteenLemmas', () => {
  const cases: [string, string[]][] = [
    // Basic cases
    ['hello', ['hello']],
    ['hello, world', ['hello', 'world']],
    ['hello; world', ['hello', 'world']],

    // Mixed separators
    ['hello, world; foo', ['hello, world', 'foo']],
    ['hello; world, bar', ['hello', 'world, bar']],

    // With annotations
    ['hello (greeting)', ['hello (greeting)']],
    ['hello (greeting), world', ['hello (greeting)', 'world']],
    ['hello (greeting); world (noun)', ['hello (greeting)', 'world (noun)']],

    // Complex annotations
    ['сей (устар.; местоим.)', ['сей (устар.; местоим.)']],
    [
      'за (напр.: по грибы, за хлебом), по',
      ['за (напр.: по грибы, за хлебом)', 'по'],
    ],
    ['bring (up) to', ['bring (up) to']],

    // Edge cases with commas
    ['extra comma,', ['extra comma']],
    ['extra,,comma,', ['extra', 'comma']],
    ['той, що є;', ['той, що є']],

    // Unicode and special characters
    ["з'явитися", ["з'явитися"]],
    ['и; а зато (смысл2)', ['и', 'а зато (смысл2)']],

    // Empty and whitespace
    ['', []],
    ['   ', []],
    [',', []],
    [';', []],
    [',,', []],
    [';;', []],

    // Whitespace handling
    [' hello , world ', ['hello', 'world']],
    ['hello ,world, foo', ['hello', 'world', 'foo']],

    // Complex real-world examples
    [
      'toj, ktory rabi (adj.); rabotajuci',
      ['toj, ktory rabi (adj.)', 'rabotajuci'],
    ],
    ['only, ĝuste nun', ['only', 'ĝuste nun']],
    ['U-Boot', ['U-Boot']],

    // Nested parentheses and complex punctuation
    ['word (with (nested) parens)', ['word (with (nested) parens)']],
    ['first (a, b); second (c; d)', ['first (a, b)', 'second (c; d)']],

    // Multiple consecutive separators
    ['a,, b', ['a', 'b']],
  ];

  for (const [input, expected] of cases) {
    test(`should split: ${input}`, () => {
      assert.deepStrictEqual(
        splitSteenLemmas(input).map(stringifyLemma),
        expected,
      );
    });
  }

  test('never leaks its internal annotation placeholders', () => {
    // Annotations are stashed under ANNOTATION_<n> keys while the cell is
    // split; text that already looks like a key must not survive as one.
    assert.deepStrictEqual(splitSteenLemmas('ANNOTATION_1 (jedin)'), [
      { value: '', annotation: 'jedin' },
    ]);
  });

  function stringifyLemma(lemma: SteenLemma): string {
    return `${lemma.value}${lemma.annotation ? ` (${lemma.annotation})` : ''}`;
  }
});
