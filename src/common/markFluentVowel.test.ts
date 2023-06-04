import { markFluentVowel } from './markFluentVowel';

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
