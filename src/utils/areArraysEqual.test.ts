import { areArraysEqual } from './areArraysEqual';

describe('areArraysEqual', () => {
  test('returns true for identical arrays', () => {
    expect(areArraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  test('returns true for identical arrays with mixed types', () => {
    expect(areArraysEqual([1, '2', 3], [1, '2', 3])).toBe(true);
  });

  test('returns false when last element is different', () => {
    expect(areArraysEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  test('returns false when second array is shorter', () => {
    expect(areArraysEqual([1, 2, 3], [1, 2])).toBe(false);
  });

  test('returns false when first array is shorter', () => {
    expect(areArraysEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  test('returns false when elements are of different types', () => {
    expect(areArraysEqual([1, 2, 3], ['1', '2', '3'])).toBe(false);
  });
});
