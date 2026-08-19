import { describe, test } from 'node:test';
import assert from 'node:assert';

import { joinTokens, splitTokens } from './split-tokens.ts';

describe('splitTokens', () => {
  describe('basic word splitting', () => {
    test('single word is unresolved (no upos)', () => {
      const result = splitTokens('hello');
      assert.equal(result.length, 1);
      assert.partialDeepStrictEqual(result[0], { form: 'hello' });
      assert.equal(result[0].upos, undefined);
      assert.equal(result[0].lemma, undefined);
    });

    test('multiple words all unresolved', () => {
      const result = splitTokens('hello world');
      assert.equal(result.length, 2);
      assert.partialDeepStrictEqual(result[0], { form: 'hello' });
      assert.partialDeepStrictEqual(result[1], { form: 'world' });
      assert.equal(result[0].upos, undefined);
      assert.equal(result[1].upos, undefined);
    });
  });

  describe('hyphen handling', () => {
    test('hyphenated word remains single token', () => {
      const result = splitTokens('e-pošta');
      assert.equal(result.length, 1);
      assert.partialDeepStrictEqual(result[0], { form: 'e-pošta' });
      assert.equal(result[0].upos, undefined);
    });

    test('multi-hyphenated word remains single token', () => {
      const result = splitTokens('multi-part-word');
      assert.equal(result.length, 1);
      assert.partialDeepStrictEqual(result[0], { form: 'multi-part-word' });
    });

    test('word with spaces around hyphen splits', () => {
      const result = splitTokens('word - word');
      assert.equal(result.length, 3);
      assert.partialDeepStrictEqual(result[0], { form: 'word' });
      assert.partialDeepStrictEqual(result[1], { form: '-', upos: 'PUNCT' });
      assert.partialDeepStrictEqual(result[2], { form: 'word' });
    });

    test('suffix keeps its leading dash', () => {
      const result = splitTokens('-ost');
      assert.equal(result.length, 1);
      assert.partialDeepStrictEqual(result[0], { form: '-ost' });
      assert.equal(result[0].upos, undefined);
    });

    test('prefix keeps its trailing dash', () => {
      const result = splitTokens('pre-');
      assert.equal(result.length, 1);
      assert.partialDeepStrictEqual(result[0], { form: 'pre-' });
      assert.equal(result[0].upos, undefined);
    });

    test('suffix after a word is its own token', () => {
      const result = splitTokens('sufiks -ost');
      assert.deepStrictEqual(
        result.map((t) => t.form),
        ['sufiks', '-ost'],
      );
    });

    test('hyphenated word in sentence', () => {
      const result = splitTokens('Look at the e-pošta!');
      assert.equal(result.length, 5);
      assert.partialDeepStrictEqual(result[0], { form: 'Look' });
      assert.partialDeepStrictEqual(result[1], { form: 'at' });
      assert.partialDeepStrictEqual(result[2], { form: 'the' });
      assert.partialDeepStrictEqual(result[3], { form: 'e-pošta' });
      assert.partialDeepStrictEqual(result[4], { form: '!', upos: 'PUNCT' });
    });
  });

  describe('punctuation handling', () => {
    for (const input of ['!', '.', ',', '?', '...']) {
      test(`punctuation "${input}" becomes PUNCT`, () => {
        const result = splitTokens(input);
        assert.equal(result.length, 1);
        assert.partialDeepStrictEqual(result[0], {
          form: input,
          lemma: input,
          upos: 'PUNCT',
        });
      });
    }

    test('word followed by punctuation', () => {
      const result = splitTokens('hello!');
      assert.equal(result.length, 2);
      assert.partialDeepStrictEqual(result[0], { form: 'hello' });
      assert.equal(result[0].upos, undefined);
      assert.partialDeepStrictEqual(result[1], { form: '!', upos: 'PUNCT' });
    });

    test('punctuation followed by word', () => {
      const result = splitTokens('!hello');
      assert.equal(result.length, 2);
      assert.partialDeepStrictEqual(result[0], { form: '!', upos: 'PUNCT' });
      assert.partialDeepStrictEqual(result[1], { form: 'hello' });
      assert.equal(result[1].upos, undefined);
    });

    test('multiple punctuation types become single PUNCT token', () => {
      const result = splitTokens('What?!');
      assert.equal(result.length, 2);
      assert.partialDeepStrictEqual(result[0], { form: 'What' });
      assert.partialDeepStrictEqual(result[1], { form: '?!', upos: 'PUNCT' });
    });

    test('sentence with multiple punctuation', () => {
      const result = splitTokens('Hello, world!');
      assert.equal(result.length, 4);
      assert.partialDeepStrictEqual(result[0], { form: 'Hello' });
      assert.partialDeepStrictEqual(result[1], { form: ',', upos: 'PUNCT' });
      assert.partialDeepStrictEqual(result[2], { form: 'world' });
      assert.partialDeepStrictEqual(result[3], { form: '!', upos: 'PUNCT' });
    });
  });

  describe('number handling', () => {
    test('a bare number becomes NUM', () => {
      const result = splitTokens('1000');
      assert.equal(result.length, 1);
      assert.partialDeepStrictEqual(result[0], {
        form: '1000',
        lemma: '1000',
        upos: 'NUM',
      });
    });

    test('digits and letters are separate tokens', () => {
      const result = splitTokens('2 ženy');
      assert.deepStrictEqual(
        result.map((t) => ({ form: t.form, upos: t.upos })),
        [
          { form: '2', upos: 'NUM' },
          { form: 'ženy', upos: undefined },
        ],
      );
    });

    test('a number glued to punctuation carries SpaceAfter=No', () => {
      const result = splitTokens('7.');
      assert.partialDeepStrictEqual(result[0], {
        form: '7',
        upos: 'NUM',
        misc: { SpaceAfter: 'No' },
      });
      assert.partialDeepStrictEqual(result[1], { form: '.', upos: 'PUNCT' });
    });
  });

  describe('edge cases', () => {
    test('empty string returns empty array', () => {
      assert.deepStrictEqual(splitTokens(''), []);
    });

    test('only whitespace returns empty array', () => {
      assert.deepStrictEqual(splitTokens('   '), []);
    });

    test('only punctuation returns single PUNCT token', () => {
      const result = splitTokens('!?.');
      assert.equal(result.length, 1);
      assert.partialDeepStrictEqual(result[0], { form: '!?.', upos: 'PUNCT' });
    });

    test('unicode characters', () => {
      const result = splitTokens('привет мир');
      assert.equal(result.length, 2);
      assert.partialDeepStrictEqual(result[0], { form: 'привет' });
      assert.partialDeepStrictEqual(result[1], { form: 'мир' });
    });

    test('unicode with punctuation', () => {
      const result = splitTokens('Привет!');
      assert.equal(result.length, 2);
      assert.partialDeepStrictEqual(result[0], { form: 'Привет' });
      assert.partialDeepStrictEqual(result[1], { form: '!', upos: 'PUNCT' });
    });
  });

  describe('real-world examples', () => {
    test('sentence with various punctuation', () => {
      const result = splitTokens('Hello, world! How are you?');
      assert.equal(result.length, 8);
      assert.deepStrictEqual(
        result.map((t) => ({ form: t.form, upos: t.upos })),
        [
          { form: 'Hello', upos: undefined },
          { form: ',', upos: 'PUNCT' },
          { form: 'world', upos: undefined },
          { form: '!', upos: 'PUNCT' },
          { form: 'How', upos: undefined },
          { form: 'are', upos: undefined },
          { form: 'you', upos: undefined },
          { form: '?', upos: 'PUNCT' },
        ],
      );
    });

    test('interslavic reflexive verb', () => {
      const result = splitTokens('viděti sę');
      assert.equal(result.length, 2);
      assert.partialDeepStrictEqual(result[0], { form: 'viděti' });
      assert.partialDeepStrictEqual(result[1], { form: 'sę' });
    });

    test('abbreviation stays as-is (dot is separate punctuation)', () => {
      const result = splitTokens('napr.');
      assert.equal(result.length, 2);
      assert.partialDeepStrictEqual(result[0], { form: 'napr' });
      assert.partialDeepStrictEqual(result[1], { form: '.', upos: 'PUNCT' });
    });

    test('phrase with dots', () => {
      const result = splitTokens('i t.d.');
      assert.equal(result.length, 5);
      assert.deepStrictEqual(
        result.map((t) => t.form),
        ['i', 't', '.', 'd', '.'],
      );
    });
  });

  describe('SpaceAfter handling', () => {
    test('word followed by punct without space has SpaceAfter=No', () => {
      const result = splitTokens('hello!');
      assert.equal(result[0].misc?.SpaceAfter, 'No');
      assert.equal(result[1].misc?.SpaceAfter, undefined); // Last token
    });

    test('space between words - no SpaceAfter', () => {
      const result = splitTokens('hello world');
      assert.equal(result[0].misc?.SpaceAfter, undefined);
      assert.equal(result[1].misc?.SpaceAfter, undefined);
    });
  });
});

describe('joinTokens', () => {
  for (const input of [
    'hello',
    'Hello, world! How are you?',
    'Look at the e-pošta!',
    'i t.d.',
    '2 ženy',
  ]) {
    test(`round-trips "${input}"`, () => {
      assert.equal(joinTokens(splitTokens(input)), input);
    });
  }

  test('no tokens, no string', () => {
    assert.equal(joinTokens([]), '');
  });

  // SpaceAfter on the last token has nothing to separate it from.
  test('a trailing SpaceAfter=No adds nothing', () => {
    assert.equal(
      joinTokens([{ form: 'a' }, { form: 'b', misc: { SpaceAfter: 'No' } }]),
      'a b',
    );
  });
});
