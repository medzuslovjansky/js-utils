import { describe, test } from 'node:test';
import assert from 'node:assert';

import type { DerivationType } from './virtual-id.ts';
import {
  DERIVATION_TYPES,
  createDerivedId,
  isDerivedId,
  parseVirtualId,
} from './virtual-id.ts';

describe('parseVirtualId', () => {
  test('234 -> plain lemma reference', () => {
    assert.deepStrictEqual(parseVirtualId('234'), { baseLuid: '234' });
  });

  test('234-prap -> derived entry', () => {
    assert.deepStrictEqual(parseVirtualId('234-prap'), {
      baseLuid: '234',
      derivationType: 'prap',
    });
  });

  test('unknown suffix stays part of the ID', () => {
    assert.deepStrictEqual(parseVirtualId('compound-word'), {
      baseLuid: 'compound-word',
    });
  });

  test('every derivation type round-trips through createDerivedId', () => {
    for (const type of DERIVATION_TYPES) {
      assert.deepStrictEqual(
        parseVirtualId(createDerivedId('234', type as DerivationType)),
        { baseLuid: '234', derivationType: type },
      );
    }
  });
});

describe('isDerivedId', () => {
  test('234-vnoun -> true', () => {
    assert.strictEqual(isDerivedId('234-vnoun'), true);
  });

  test('234 -> false', () => {
    assert.strictEqual(isDerivedId('234'), false);
  });

  test('compound-word -> false', () => {
    assert.strictEqual(isDerivedId('compound-word'), false);
  });
});
