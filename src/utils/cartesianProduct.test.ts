import { cartesianProduct } from './cartesianProduct';

describe('cartesianProduct', () => {
  test.each([
    [[], [[]]],
    [[[1], []], []],
    [[[1], [2]], [[1, 2]]],
    [
      [[1], [2, 3]],
      [
        [1, 2],
        [1, 3],
      ],
    ],
    [
      [
        [0, 1],
        [2, 3],
      ],
      [
        [0, 2],
        [1, 2],
        [0, 3],
        [1, 3],
      ],
    ],
  ])('should multiply arrays: %j', (paramArrays, expected) => {
    const actual = cartesianProduct(paramArrays);
    expect(actual).toEqual(expected);
  });
});
