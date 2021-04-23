import parseVoteStatus from './voteStatus';

describe('parseVoteStatus', () => {
  it.each([
    ['Common', 1],
    ['Regional', 2],
    ['Individual', 3],
    ['Archaic', 4],
    ['Artificial', 5],
    ['Questionable', 9],
    ['Deprecated', 99],
  ])('should return %j for %j', (expected, input) => {
    expect(parseVoteStatus(input)).toBe(expected);
    expect(parseVoteStatus(`${input}`)).toBe(expected);
  });

  it.each([[null], [100], ['A']])(
    'should throw given an unknown value: %j',
    (input: any) => {
      expect(() => parseVoteStatus(input)).toThrowErrorMatchingSnapshot();
      expect(() => parseVoteStatus(`${input}`)).toThrowError();
    },
  );
});
