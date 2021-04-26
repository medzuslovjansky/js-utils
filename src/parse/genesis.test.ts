import parseGenesis from './genesis';

describe('parseGenesis', () => {
  it.each([
    ['Arabic', 'A'],
    ['Deutsch', 'D'],
    ['English', 'E'],
    ['French', 'F'],
    ['German', 'G'],
    ['International', 'I'],
    ['Artificial', 'M'],
    ['Netherlands', 'N'],
    ['Oriental', 'O'],
    ['Slavic', 'S'],
    ['Turkic', 'T'],
  ])('should return %j for %j', (expected, input) => {
    expect(parseGenesis(input.toLowerCase())).toBe(expected);
    expect(parseGenesis(input.toUpperCase())).toBe(expected);
  });

  it.each([[null], ['Ar'], ['unknown']])(
    'should throw given an unknown value: %j',
    (input: any) => {
      expect(() => parseGenesis(input)).toThrowErrorMatchingSnapshot();
    },
  );
});
