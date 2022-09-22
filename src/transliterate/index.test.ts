import transliterate from './index';

const source = `\
Na vȯzvyšenosti ovca, ktora ne iměla vȯlnų, uviděla konjev. Pŕvy tęgal tęžky voz, vtory nosil veliko brěmę, tretji brzo vozil mųža.
Ovca rěkla konjam: «Boli mně sŕdce, kȯgda viđų, kako člověk vladaje konjami.»
Konji rěkli: «Slušaj, ovco, nam boli sŕdce, kȯgda vidimo ovo: mųž, gospodaŕ, bere tvojų vȯlnų, da by iměl dlja sebe teplo paĺto. A ovca jest bez vȯlny.»
Uslyšavši to, ovca izběgla v råvninų. | Odjezd.`;

describe('abcd', () => {
  test.each([
    ['art-Cyrl-x-interslv'],
    ['art-Cyrl-x-interslv-etym'],
    ['art-Cyrl-x-interslv-iotated'],
    ['art-Cyrl-x-interslv-iotated-ext'],
    ['art-Cyrl-x-interslv-northern'],
    ['art-Cyrl-x-interslv-sloviant'],
    ['art-Cyrl-x-interslv-southern'],
    ['art-Glag-x-interslv'],
    ['art-Glag-x-interslv-sloviant'],
    ['art-Glag-x-interslv-southern'],
    ['art-Latn-PL-x-interslv'],
    ['art-Latn-x-interslv'],
    ['art-Latn-x-interslv-ascii'],
    ['art-Latn-x-interslv-etym'],
    ['art-Latn-x-interslv-northern'],
    ['art-Latn-x-interslv-sloviant'],
    ['art-Latn-x-interslv-southern'],
    ['art-x-interslv-fonipa'],
    ['art-x-interslv'],
  ])('transliterate(text, %j)', (bcp47) => {
    expect(transliterate(source, bcp47)).toMatchSnapshot();
  });

  test('unknown code', () => {
    expect(() => transliterate(source, 'en')).toThrowErrorMatchingSnapshot();
  });
});
