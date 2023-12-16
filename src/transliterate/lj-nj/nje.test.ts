import { njeCheck, njePosition } from './index';

describe('nje', () => {
  describe('njeCheck', () => {
    test.each([
      ['nje'],
      ['banje'],
      ['uravnja'],
      ['šeršenje'],
      ['prinajmenje'],
      ['snju'],
    ])('should return false for %j', (input) => {
      expect(njeCheck(toToken(input))).toBe(false);
    });

    test.each([['běganje'], ['dělanje'], ['delfinju']])(
      'should return true for %j',
      (input) => {
        expect(njeCheck(toToken(input))).toBe(true);
      },
    );

    test.each([[''], ['rksadhfklhdslkfasdfgasg']])(
      'should return false for various non-sense (%j)',
      (input) => {
        expect(njeCheck(toToken(input))).toBe(false);
      },
    );
  });

  describe('njePosition', () => {
    test.each([['ńje'], ['dělańje']])('for %j should return -1', (input) => {
      const token = toToken(input);
      const pos = njePosition(token);
      expect(pos).toBe(-1);
    });

    test.each([
      ['nje', 3, 'ńje'],
      ['banje', 3, 'bańje'],
      ['uravnja', 3, 'uravńja'],
      ['šeršenjem', 4, 'šeršeńjem'],
      ['běganjami', 5, 'běgańjami'],
      ['dělanje', 3, 'dělańje'],
    ])('for %j should return len-%j', (input, expected, doubleCheck) => {
      const token = toToken(input);
      const pos = njePosition(token);
      expect(pos).toBe(token.length - expected - 1);

      const softened =
        token.substring(0, pos) + 'ńj' + token.substring(pos + 2);
      expect(softened).toBe(toToken(doubleCheck));
    });
  });

  function toToken(str: string): string {
    return `%${str}%`;
  }
});
