import { describe, test } from 'node:test';
import assert from 'node:assert';

import { stripDiacritics } from './stripDiacritics.ts';

describe('stripDiacritics', () => {
  test('råbotati -> rabotati', () => {
    assert.strictEqual(stripDiacritics('råbotati'), 'rabotati');
  });

  test('sųråbotati -> surabotati', () => {
    assert.strictEqual(stripDiacritics('sųråbotati'), 'surabotati');
  });

  test('gòltnųti -> goltnuti', () => {
    assert.strictEqual(stripDiacritics('gòltnųti'), 'goltnuti');
  });

  test('Organizacija Sjedinjenyh Narodov -> ...', () => {
    assert.strictEqual(
      stripDiacritics('Organizacija Sjedinjenyh Narodov'),
      'Organizacija Sjedinjenyh Narodov',
    );
  });
});
