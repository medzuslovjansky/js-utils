import { describe, it } from 'node:test';
import assert from 'node:assert';

import { inferFleetingVowel, markFleetingVowel } from './fleetingVowels.ts';

describe('fleetingVowels', () => {
  describe('markFleetingVowel', () => {
    it('marks the fleeting vowel in the word', () => {
      assert.strictEqual(markFleetingVowel('pes', 'psa'), 'p(e)s');
      assert.strictEqual(markFleetingVowel('son', 'sna'), 's(o)n');
    });

    it('returns the same word when there is no fleeting vowel', () => {
      assert.strictEqual(markFleetingVowel('mama', 'mama'), 'mama');
    });

    it('only ever marks a yer, whatever the addition drops', () => {
      // A malformed addition must not turn an ordinary vowel into "(u)".
      assert.strictEqual(markFleetingVowel('råzum', 'råzma'), 'råzum');
    });

    it('marks the fleeting vowel when it includes a diacritic', () => {
      assert.strictEqual(markFleetingVowel('pènj', 'pnja'), 'p(e)nj');
      assert.strictEqual(markFleetingVowel('sòn', 'sna'), 's(o)n');
    });
  });

  describe('inferFleetingVowel', () => {
    it('infers the fleeting vowel in the word', () => {
      assert.strictEqual(inferFleetingVowel('pės'), 'p(e)s');
      assert.strictEqual(inferFleetingVowel('pèsȯk'), 'pès(o)k');
      assert.strictEqual(inferFleetingVowel('sȯn'), 's(o)n');
      assert.strictEqual(inferFleetingVowel('dėnj'), 'd(e)nj');
      assert.strictEqual(inferFleetingVowel('orėl'), 'or(e)l');
    });

    it('infers the fleeting vowel in complex words', () => {
      assert.strictEqual(
        inferFleetingVowel('pėsȯk, kotȯk i orėl'),
        'pės(o)k, kot(o)k i or(e)l',
      );
      assert.strictEqual(
        inferFleetingVowel('pės-afrikanec'),
        'p(e)s-afrikań(e)c',
      );
      assert.strictEqual(
        inferFleetingVowel('afrikanec-pės'),
        'afrikań(e)c-p(e)s',
      );
    });

    it('does not infer incorrect fleeting vowels in the word', () => {
      assert.strictEqual(inferFleetingVowel('pėj'), 'pėj');
      assert.strictEqual(inferFleetingVowel('dvėri'), 'dvėri');
      assert.strictEqual(inferFleetingVowel('dȯžď'), 'dȯžď');
      assert.strictEqual(inferFleetingVowel('linėnj'), 'linėnj');
    });
  });
});
