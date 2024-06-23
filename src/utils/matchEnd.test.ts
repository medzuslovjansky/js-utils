import { matchEnd } from './matchEnd';

describe('matchEnd', () => {
  it('should return ending when the string ends with the given suffix array', () => {
    expect(matchEnd('dělati', [['e', 'ě'], 'lat', ['i', 'ı']])).toBe('ělati');
  });

  it('should return empty string when the string ends with an empty suffix array', () => {
    expect(matchEnd('', [])).toBe('');
  });

  it('should return empty string when the string does not match any suffix array', () => {
    expect(matchEnd('dělåti', [['ě', 'e'], 'lat', ['i', 'ı']])).toBe('');
  });

  it('should pick first working suffix among others', () => {
    expect(matchEnd('abcdefg', ['de', ['fg', 'g']])).toBe('defg');
    expect(matchEnd('abcdefg', ['de', ['g', 'fg']])).toBe('');
  });

  it('should optimize for single suffix array and single string', () => {
    expect(matchEnd('dělati', ['i'])).toBe('i');
    expect(matchEnd('dělati', 'ti')).toBe('ti');
  });
});
