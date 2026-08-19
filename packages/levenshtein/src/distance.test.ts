import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { distance } from './distance.ts';

describe('distance with details options', () => {
  test('returns alignment traceback between isv and ru', () => {
    const details = distance('река', 'ru', 'rěka', { details: true });
    assert.strictEqual(typeof details.distance, 'number');
    assert.strictEqual(details.distance, 0.125);
    assert.deepEqual(details.graphemesA, ['r', 'e', 'k', 'a']);
    assert.deepEqual(details.graphemesB, ['r', 'ě', 'k', 'a']);
    assert.strictEqual(details.alignment.length, 4);
    assert.strictEqual(details.alignment[0]?.op, 'equal');
    assert.strictEqual(details.alignment[1]?.op, 'substitute');
    assert.strictEqual(details.alignment[1]?.cost, 0.5);
  });

  test('handles 4-arg language comparison with details', () => {
    const details = distance('река', 'ru', 'rzeka', 'pl', { details: true });
    assert.strictEqual(typeof details.distance, 'number');
    assert.ok(details.alignment.length > 0);
  });

  test('primary form: distance(wordA, langA, wordB) defaults langB to isv', () => {
    const dRu = distance('река', 'ru', 'rěka');
    assert.strictEqual(dRu, 0.125);

    const dPl = distance('rzeka', 'pl', 'rěka');
    assert.strictEqual(dPl, 1 / 3);

    const dIsv = distance('rěka', 'isv', 'rěka');
    assert.strictEqual(dIsv, 0);

    const details = distance('река', 'ru', 'rěka', { details: true });
    assert.deepEqual(details.graphemesA, ['r', 'e', 'k', 'a']);
    assert.deepEqual(details.graphemesB, ['r', 'ě', 'k', 'a']);
    assert.strictEqual(details.distance, 0.125);
  });

  test('primary form: distance(wordA, langA, wordB, langB)', () => {
    const d = distance('rěka', 'isv', 'река', 'ru');
    assert.strictEqual(d, 0.125);

    const dDetails = distance('rěka', 'isv', 'река', 'ru', { details: true });
    assert.deepEqual(dDetails.graphemesA, ['r', 'ě', 'k', 'a']);
    assert.deepEqual(dDetails.graphemesB, ['r', 'e', 'k', 'a']);
  });

  test('details option with empty strings and deletions', () => {
    const emptyBoth = distance('', 'isv', '', { details: true });
    assert.strictEqual(emptyBoth.distance, 0);
    assert.deepEqual(emptyBoth.alignment, []);

    const emptyA = distance('', 'isv', 'slovo', { details: true });
    assert.strictEqual(emptyA.distance, 1);
    assert.strictEqual(emptyA.alignment.length, 5);
    assert.strictEqual(emptyA.alignment[0]?.op, 'insert');

    const emptyB = distance('slovo', 'isv', '', { details: true });
    assert.strictEqual(emptyB.distance, 1);
    assert.strictEqual(emptyB.alignment.length, 5);
    assert.strictEqual(emptyB.alignment[0]?.op, 'delete');

    const delDetails = distance('ab', 'isv', 'a', { details: true });
    assert.ok(delDetails.alignment.some((s) => s.op === 'delete'));

    assert.throws(
      () =>
        distance(
          'voda',
          'isv',
          'voda',
          'invalid' as unknown as import('./normalize/index.ts').NormalizeLang,
        ),
      RangeError,
    );
  });
});
