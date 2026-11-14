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
});
