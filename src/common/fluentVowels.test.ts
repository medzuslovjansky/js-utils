import { inferFluentVowel, markFluentVowel } from './fluentVowels';

describe('fluentVowels', () => {
  describe('markFluentVowel', () => {
    it('marks the fluent vowel in the word', () => {
      expect(markFluentVowel('pes', 'psa')).toBe('p(e)s');
      expect(markFluentVowel('son', 'sna')).toBe('s(o)n');
    });

    it('returns the same word when there is no fluent vowel', () => {
      expect(markFluentVowel('mama', 'mama')).toBe('mama');
    });

    it('marks the fluent vowel when it includes a diacritic', () => {
      expect(markFluentVowel('pènj', 'pnja')).toBe('p(e)nj');
      expect(markFluentVowel('sòn', 'sna')).toBe('s(o)n');
    });
  });

  describe('inferFluentVowel', () => {
    it('infers the fluent vowel in the word', () => {
      expect(inferFluentVowel('pės')).toBe('p(e)s');
      expect(inferFluentVowel('pèsȯk')).toBe('pès(o)k');
      expect(inferFluentVowel('sȯn')).toBe('s(o)n');
      expect(inferFluentVowel('dėnj')).toBe('d(e)nj');
      expect(inferFluentVowel('orėl')).toBe('or(e)l');
    });

    it('infers the fluent vowel in complex words', () => {
      expect(inferFluentVowel('pėsȯk, kotȯk i orėl')).toBe(
        'pės(o)k, kot(o)k i or(e)l',
      );
    });

    it('does not infer incorrect fluent vowels in the word', () => {
      expect(inferFluentVowel('pėj')).toBe('pėj');
      expect(inferFluentVowel('dvėri')).toBe('dvėri');
      expect(inferFluentVowel('dȯžď')).toBe('dȯžď');
    });
  });
});
