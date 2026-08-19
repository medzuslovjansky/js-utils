import assert from 'node:assert';
import { describe, test } from 'node:test';

import { FlavorisationBCP47, transliterate } from '@interslavic/translit';

import { fold } from './fold.ts';

describe('fold', () => {
  test('every script reaches the same key', () => {
    const key = fold('slovjansky');

    assert.strictEqual(fold('Словјанскы'), key);
    assert.strictEqual(fold('Ⱄⰾⱁⰲⱝⱀⱄⰽⱐⰹ'), key);
    assert.strictEqual(fold('SLOVJANSKY'), key);
  });

  /**
   * Not orthographies anyone writes documentation in, or spellings that lose
   * information folding cannot put back:
   *
   * - `isv-x-fonipa` is a pronunciation, not a spelling.
   * - the northern and Polish flavorisations resolve `ě` to `je`/`ie` and `å`
   *   to `o`. A query typed that way cannot reach a document spelt `pěsȯk`,
   *   because `e` and `je` are also a real contrast — `ěsti` against `jesti`.
   *   Indexing `ě` under both keys would fix it; a blanket `je` → `e` would
   *   not.
   * - the iotated Cyrillic and etymological Glagolitic write `ť`+`ju` and `ė`
   *   in ways `transliterate()` does not read back.
   */
  const NOT_GUARANTEED = new Set([
    'isv-x-fonipa',
    'isv-Latn-x-ascii',
    'isv-Latn-x-northern',
    'isv-Latn-PL',
    'isv-Glag-x-northern',
    'isv-Cyrl-x-northern',
    'isv-Cyrl-x-iotated',
    'isv-Cyrl-x-iotated-ext',
    'isv-Glag-x-etymolog',
  ]);

  // The point of the package: whatever orthography a document or a query was
  // written in, it has to land on the same key. Generated rather than typed
  // out, so a new flavorisation in translit shows up here as a failure instead
  // of silently halving recall.
  test('every flavorisation reaches the same key', () => {
    const spellings = Object.entries(FlavorisationBCP47).filter(
      ([, code]) => !NOT_GUARANTEED.has(code),
    );
    assert.ok(spellings.length > 8, 'the guarantee should not shrink silently');

    for (const word of [
      'medžuslovjansky',
      'råzumjeti',
      'gųsly',
      'pěsȯk',
      'sȯlnce',
      'kosťju',
    ]) {
      const key = fold(word);

      for (const [name, code] of spellings) {
        const written = transliterate(word, code);
        assert.strictEqual(
          fold(written),
          key,
          `${name} spells ${word} as ${written}, which folds elsewhere`,
        );
      }
    }
  });

  test('the etymological letters fold to their bare form', () => {
    assert.strictEqual(fold('råzum'), 'razum');
    assert.strictEqual(fold('vȯzduh'), 'vozduh');
    assert.strictEqual(fold('pěsȯk'), 'pesok');
    assert.strictEqual(fold('žėnsky'), 'zenski');
    assert.strictEqual(fold('gųsly'), 'gusli');
  });

  test('punctuation and spacing are not part of a key', () => {
    assert.strictEqual(fold('«dom»'), 'dom');
    assert.strictEqual(fold('iz-nad'), 'iznad');
    assert.strictEqual(fold(''), '');
  });

  test('digits survive, so version numbers stay searchable', () => {
    assert.strictEqual(fold('utf-8'), 'utf8');
  });

  test('the soft sign carries no sound and no key', () => {
    assert.strictEqual(fold('kosťь'), 'kost');
    assert.strictEqual(fold('кость'), 'kost');
  });
});
