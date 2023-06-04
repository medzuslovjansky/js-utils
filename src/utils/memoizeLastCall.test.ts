import { memoizeLastCall } from './memoizeLastCall';

describe('memoizeLastCall', () => {
  test('calls the function with the initial argument', () => {
    const mockFn = jest.fn((x: number) => x * 2);
    const memoized = memoizeLastCall(mockFn);

    expect(memoized(2)).toBe(4);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('does not call the function again with the same argument', () => {
    const mockFn = jest.fn((x: number) => x * 2);
    const memoized = memoizeLastCall(mockFn);

    memoized(2);
    expect(memoized(2)).toBe(4);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('calls the function again with a different argument', () => {
    const mockFn = jest.fn((x: number) => x * 2);
    const memoized = memoizeLastCall(mockFn);

    memoized(2);
    expect(memoized(3)).toBe(6);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  test('calls the function again after argument changes back and forth', () => {
    let counter = 0;
    const memoized = memoizeLastCall((..._args) => ++counter);

    expect(memoized(2)).toBe(1);
    expect(memoized(3)).toBe(2);
    expect(memoized(3)).toBe(2);
    expect(memoized(2)).toBe(3);
  });

  test('calls the function again when arguments count changes', () => {
    let counter = 0;
    const memoized = memoizeLastCall((..._args) => ++counter);

    expect(memoized(2)).toBe(1);
    expect(memoized(2, undefined)).toBe(2);
  });
});
