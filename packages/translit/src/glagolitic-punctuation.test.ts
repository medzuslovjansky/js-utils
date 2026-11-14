import { describe, test } from 'node:test';
import assert from 'node:assert';

import { transliterate } from './transliterate.ts';

describe('Glagolitic punctuation', () => {
  const LATN = 'Slovo, slovo. Slovo? Slovo! Slovo: slovo; (slovo) "slovo"...';

  test('Latin marks become Glagolitic when the target is Glagolitic', () => {
    const out = transliterate(LATN, 'isv-Glag-x-etymolog');
    for (const mark of '·։;··⸬⁘⁖჻⸪···') assert.ok(out.includes(mark), mark);
    assert.ok(!/[,.?!:()"]/.test(out), out);
  });

  test('Glagolitic marks become Latin ones when the source is Glagolitic', () => {
    const out = transliterate(
      'ⱄⰾⱁⰲⱁ· ⱄⰾⱁⰲⱁ։ ⱄⰾⱁⰲⱁ; ⱄⰾⱁⰲⱁ·· ⱄⰾⱁⰲⱁ⸬ ⱄⰾⱁⰲⱁ⁘ ⁖ⱄⰾⱁⰲⱁ჻ ⸪ⱄⰾⱁⰲⱁ⸪···',
      'isv-Latn',
    );
    assert.strictEqual(
      out,
      'slovo, slovo. slovo? slovo! slovo: slovo; (slovo) "slovo"...',
    );
  });

  test('Glag → Glag round-trips the marks', () => {
    const glag = transliterate(LATN, 'isv-Glag-x-etymolog');
    assert.strictEqual(transliterate(glag, 'isv-Glag-x-etymolog'), glag);
  });

  test('Latin → Latin and Latin → Cyrillic leave marks alone', () => {
    assert.strictEqual(
      transliterate('slovo, slovo.', 'isv-Latn'),
      'slovo, slovo.',
    );
    assert.strictEqual(
      transliterate('slovo, slovo.', 'isv-Cyrl'),
      'слово, слово.',
    );
  });

  test('`;` is a question mark only after a Glagolitic word', () => {
    assert.strictEqual(transliterate('ⱄⰾⱁⰲⱁ;', 'isv-Latn'), 'slovo?');
    assert.strictEqual(
      transliterate('ⱄⰾⱁⰲⱁ ; ⱄⰾⱁⰲⱁ', 'isv-Latn'),
      'slovo ? slovo',
    );
    assert.strictEqual(transliterate('ⱄⰾⱁⰲⱁ 1; 2;', 'isv-Latn'), 'slovo 1; 2;');
    assert.strictEqual(
      transliterate('ⱄⰾⱁⰲⱁ;; ⱄⰾⱁⰲⱁ ;', 'isv-Latn'),
      'slovo?? slovo ?',
    );
  });

  test('a decimal point or comma inside a number stays', () => {
    assert.strictEqual(
      transliterate('Pi 3.14, 2,5. 2, 5. Da.', 'isv-Glag-x-etymolog'),
      'Ⱂⰻ 3.14· 2,5։ 2· 5։ Ⰴⰰ։',
    );
  });

  test("| is the Glagolitic ⁞, but not Discord's ||", () => {
    assert.strictEqual(
      transliterate('slovo | slovo', 'isv-Glag-x-etymolog'),
      'ⱄⰾⱁⰲⱁ ⁞ ⱄⰾⱁⰲⱁ',
    );
    assert.strictEqual(
      transliterate('ⱄⰾⱁⰲⱁ ⁞ ⱄⰾⱁⰲⱁ', 'isv-Latn'),
      'slovo | slovo',
    );
    assert.strictEqual(
      transliterate('||slovo||', 'isv-Glag-x-etymolog'),
      '||ⱄⰾⱁⰲⱁ||',
    );
  });
});
