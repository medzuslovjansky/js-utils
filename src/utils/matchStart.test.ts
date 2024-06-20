import { matchStart } from './matchStart';

describe('matchStart', () => {
  it('should return beginning when the string starts with the given prefix array', () => {
    expect(matchStart('dělati', ['d', ['e', 'ě'], 'l'])).toBe('děl');
  });

  it('should return empty string when the string starts with an empty prefix array', () => {
    expect(matchStart('', [])).toBe('');
  });

  it('should return empty string when the string does not match any prefix array', () => {
    expect(matchStart('dělåti', [['ě', 'e'], 'lat', ['i', 'ı']])).toBe('');
  });

  it('should pick first working prefix among others', () => {
    expect(
      matchStart('abcdefg', [
        ['ab', 'a'],
        ['b', 'cd'],
      ]),
    ).toBe('abcd');

    expect(
      matchStart('abcdefg', [
        ['a', 'ab'],
        ['b', 'cd'],
      ]),
    ).toBe('ab');
  });

  it('should optimize for single prefix array and single string', () => {
    expect(matchStart('dělati', ['dě'])).toBe('dě');
    expect(matchStart('dělati', 'děl')).toBe('děl');
  });
});
