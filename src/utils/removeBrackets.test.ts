import { removeBrackets } from './removeBrackets';

describe('removeBrackets', () => {
  test.each([
    ['euro [€]', '[', ']', 'euro'],
    ['adagio (muzyka)', '(', ')', 'adagio'],
  ])('(%j, %j, %j) === %j', (input, l, r, expected) => {
    expect(removeBrackets(input, l, r)).toBe(expected);
  });
});
