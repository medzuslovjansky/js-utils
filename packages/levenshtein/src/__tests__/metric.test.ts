import test from 'node:test';
import assert from 'node:assert/strict';
import { FIXTURES } from '../fixtures/index.ts';
import { THRESHOLDS } from '../fixtures/types.ts';
import { distance } from '../distance.ts';
import { LANGS, type SupportedLang } from '../normalize/index.ts';

for (const lang of LANGS) {
  for (const c of FIXTURES[lang].metric) {
    test(`metric ${lang}: d(${c.other}, ${c.isv})`, () => {
      const d = distance(c.other, lang, c.isv);
      if (c.max !== undefined) {
        assert.ok(d <= c.max, `d=${d} exceeds max=${c.max}`);
      }
      if (c.min !== undefined) {
        assert.ok(d >= c.min, `d=${d} is below min=${c.min}`);
      }
    });
  }

  test(`metric ${lang}: cognates rank below unrelated words`, () => {
    const cases = FIXTURES[lang].metric;
    const cognates = cases.filter(
      (c) => c.max !== undefined && c.max <= THRESHOLDS.LOW,
    );
    const unrelated = cases.filter((c) => c.min !== undefined);
    for (const cognate of cognates) {
      for (const stranger of unrelated) {
        const dCognate = distance(cognate.other, lang, cognate.isv);
        const dStranger = distance(stranger.other, lang, stranger.isv);
        assert.ok(
          dCognate < dStranger,
          `d(${cognate.other}, ${cognate.isv})=${dCognate} should be < d(${stranger.other}, ${stranger.isv})=${dStranger}`,
        );
      }
    }
  });

  test(`metric ${lang}: empty-string edge cases`, () => {
    assert.equal(distance('', lang, ''), 0);
    assert.equal(distance('slovo', lang, ''), 1);
    assert.equal(distance('', lang, 'slovo'), 1);
  });
}

test('metric: unknown language throws RangeError', () => {
  assert.throws(
    () => distance('voda', 'xx' as SupportedLang, 'voda'),
    RangeError,
  );
});

test('metric: distance is never negative', () => {
  assert.ok(distance('a', 'ru', 'b') >= 0);
});

test('metric: symmetric between two national languages', () => {
  const d1 = distance('река', 'ru', 'rzeka', 'pl');
  const d2 = distance('rzeka', 'pl', 'река', 'ru');
  assert.equal(d1, d2);
  assert.ok(d1 < 0.25);
});
