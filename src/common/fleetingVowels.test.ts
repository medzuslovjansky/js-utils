import { inferFleetingVowel, markFleetingVowel } from './fleetingVowels';

describe('fleetingVowels', () => {
  describe('markFleetingVowel', () => {
    it('marks the fleeting vowel in the word', () => {
      expect(markFleetingVowel('pes', 'psa')).toBe('p(e)s');
      expect(markFleetingVowel('son', 'sna')).toBe('s(o)n');
    });

    it('returns the same word when there is no fleeting vowel', () => {
      expect(markFleetingVowel('mama', 'mama')).toBe('mama');
    });

    it('marks the fleeting vowel when it includes a diacritic', () => {
      expect(markFleetingVowel('pènj', 'pnja')).toBe('p(e)nj');
      expect(markFleetingVowel('sòn', 'sna')).toBe('s(o)n');
    });
  });

  describe('inferFleetingVowel', () => {
    it('infers the fleeting vowel in the word', () => {
      expect(inferFleetingVowel('pės')).toBe('p(e)s');
      expect(inferFleetingVowel('pèsȯk')).toBe('pès(o)k');
      expect(inferFleetingVowel('sȯn')).toBe('s(o)n');
      expect(inferFleetingVowel('dėnj')).toBe('d(e)nj');
      expect(inferFleetingVowel('orėl')).toBe('or(e)l');
    });

    it('infers the fleeting vowel in complex words', () => {
      expect(inferFleetingVowel('pėsȯk, kotȯk i orėl')).toBe(
        'pės(o)k, kot(o)k i or(e)l',
      );
    });

    it('does not infer incorrect fleeting vowels in the word', () => {
      expect(inferFleetingVowel('pėj')).toBe('pėj');
      expect(inferFleetingVowel('dvėri')).toBe('dvėri');
      expect(inferFleetingVowel('dȯžď')).toBe('dȯžď');
    });
  });
});
