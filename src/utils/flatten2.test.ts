import { flatten2 } from './flatten2';

test.each([
  [[], []],
  [[1], [1]],
  [[[], 2, []], [2]],
  [
    [[1], 2, [3]],
    [1, 2, 3],
  ],
  [
    [[1], [2, 3]],
    [1, 2, 3],
  ],
  [
    [
      [1, []],
      [2, [3]],
    ],
    [1, [], 2, [3]],
  ],
])('flatten2(%j) should return %j', (arg, expected) => {
  const actual = flatten2(arg);
  expect(actual).toEqual(expected);
});
