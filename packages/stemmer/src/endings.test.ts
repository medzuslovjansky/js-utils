import assert from 'node:assert';
import { describe, test } from 'node:test';

import { ENDINGS } from './endings.ts';
import { stem } from './stemmer.ts';

describe('the ending table', () => {
  /**
   * The table is one string parsed at load time, so a stray character in it is
   * not a syntax error anywhere — it is a rule that quietly cuts the wrong
   * number of letters off every word that reaches it.
   */
  test('is letters and one digit per entry', () => {
    const entries = ENDINGS.trim().split(/\s+/);
    assert.ok(entries.length > 1000, `only ${entries.length} rules`);

    for (const entry of entries) {
      assert.match(entry, /^[a-z0-9]*[0-9]$/, `${entry} is not a rule`);
    }
  });

  test('has a rule for the empty context, so every word gets an answer', () => {
    const contexts = ENDINGS.trim()
      .split(/\s+/)
      .map((entry) => entry.slice(0, -1));

    assert.ok(contexts.includes(''), 'nothing catches an unknown ending');
  });

  /**
   * The contexts are learnt from folded words, so a rule whose context could
   * never be produced by `fold` is a rule that will never fire.
   */
  test('holds each context once', () => {
    const contexts = ENDINGS.trim()
      .split(/\s+/)
      .map((entry) => entry.slice(0, -1));

    assert.strictEqual(new Set(contexts).size, contexts.length);
  });
});

describe('the cut', () => {
  test('never leaves less than three letters', () => {
    // `-omu` is learnt from adjectives, `domu` is a noun four letters long
    assert.strictEqual(stem('domu'), 'dom');
    assert.strictEqual(stem('mlådomu'), stem('mlådy'));
  });

  test('leaves a word with no room for an ending alone', () => {
    assert.strictEqual(stem('do'), 'do');
    assert.strictEqual(stem('i'), 'i');
  });
});
