import test from 'node:test';
import assert from 'node:assert/strict';
import { FIXTURES } from '../fixtures/index.ts';
import { normalize, type NormalizeLang } from '../normalize/index.ts';

for (const [lang, fixtures] of Object.entries(FIXTURES)) {
  for (const c of fixtures.translit) {
    test(`normalize ${lang}: ${c.in} → ${c.out} [${c.covers}]`, () => {
      assert.equal(normalize(c.in, lang as NormalizeLang), c.out);
    });
  }
}

test('normalize: composes combining diacritics (NFC)', () => {
  assert.equal(normalize('škola', 'hr'), 'škola');
});

test('normalize: lowercases input', () => {
  assert.equal(normalize('KONJ', 'isv'), 'konj');
  assert.equal(normalize('Вода', 'ru'), 'voda');
});

test('normalize: trims and collapses whitespace', () => {
  assert.equal(normalize('  dva   slova ', 'isv'), 'dva slova');
});

test('normalize: unknown language throws RangeError', () => {
  assert.throws(() => normalize('slovo', 'xx' as NormalizeLang), RangeError);
});
