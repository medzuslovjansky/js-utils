import { soften } from './soften';

describe('soften function', () => {
  test('softens the last consonant by default', () => {
    expect(soften('dnes')).toBe('dneś');
    expect(soften('gaz')).toBe('gaź');
    expect(soften('lad')).toBe('laď');
  });

  test('softens the specified consonant at given index', () => {
    expect(soften('lad', 0)).toBe('ľad');
    expect(soften('selsky', 2)).toBe('seľsky');
    expect(soften('měd', 2)).toBe('měď');
  });

  test('handles negative indices', () => {
    expect(soften('dnes', -1)).toBe('dneś');
    expect(soften('test', -2)).toBe('teśt');
  });

  test('handles all softenable consonants', () => {
    expect(soften('D')).toBe('Ď');
    expect(soften('L')).toBe('Ľ');
    expect(soften('N')).toBe('Ń');
    expect(soften('R')).toBe('Ŕ');
    expect(soften('S')).toBe('Ś');
    expect(soften('T')).toBe('Ť');
    expect(soften('Z')).toBe('Ź');
    expect(soften('d')).toBe('ď');
    expect(soften('l')).toBe('ľ');
    expect(soften('n')).toBe('ń');
    expect(soften('r')).toBe('ŕ');
    expect(soften('s')).toBe('ś');
    expect(soften('t')).toBe('ť');
    expect(soften('z')).toBe('ź');
  });

  test('does not change non-softenable consonants and vowels', () => {
    expect(soften('baba')).toBe('baba');
    expect(soften('mama')).toBe('mama');
    expect(soften('papa')).toBe('papa');
  });

  test('handles empty strings', () => {
    expect(soften('')).toBe('');
    expect(soften('', 0)).toBe('');
  });

  test('handles out of range index', () => {
    expect(soften('test', 4)).toBe('test');
    expect(soften('test', -5)).toBe('test');
  });
});
