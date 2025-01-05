import { DictionaryEncoding } from './dictionary';
import { Letter } from '../core';

describe('DictionaryEncoding', () => {
  test('it should do something useful', () => {
    expect(DictionaryEncoding.encode('pan(jevrej)sky')).toEqual(
      new Uint8Array([
        Letter.P,
        Letter.A,
        Letter.N,
        Letter.J,
        Letter.E,
        Letter.V,
        Letter.R,
        Letter.E,
        Letter.J,
        Letter.S,
        Letter.K,
        Letter.Y,
      ]),
    );
  });

  test('it should do something useful', () => {
    expect(DictionaryEncoding.encode('panje')).toEqual(
      new Uint8Array([Letter.P, Letter.A, Letter.Nj, Letter.E]),
    );
  });

  test('it should decode the encoded string', () => {
    expect(
      DictionaryEncoding.decode(
        new Uint8Array([Letter.P, Letter.A, Letter.Nj, Letter.E, Letter.None]),
      ),
    ).toEqual('panje');
  });
});
