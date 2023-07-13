import { transliterate } from './index';

const latin = `\
Na vȯzvyšenosti ovca, ktora ne iměla vȯlnų, uviděla konjev. Pŕvy tęgal tęžky voz, vtory nosil veliko brěmę, tretji brzo vozil mųža.
Ovca rěkla konjam: «Boli mně sŕdce, kȯgda viđų, kako člověk vladaje konjami.»
Konji rěkli: «Slušaj, ovco, nam boli sŕdce, kȯgda vidimo ovo: mųž, gospodaŕ, bere tvojų vȯlnų, da by iměl dlja sebe teplo paĺto. A ovca jest bez vȯlny.»
Uslyšavši to, ovca izběgla v råvninų. | Odjezd. T́ma.`;

const cyrillic = `\
На возвышености овца, ктора не имѣла вълнѫ, увидѣла коњев. Прьвы тѧгал тѧжкы воз, вторы носил велико брємѧ, третји брзо возил мѫжа.
Овца рѣкла коням: «Боли мнє срьдце, къгда виџу, како чловѣк владаје коньами.»
Конји рѣкли: «Слушай, овцо, нам боли срьдце, къгда видимо ово: мѫж, господарь, бере твоѭ вълнѫ, да бы имѣл дља себе тепло пальто. А овца ѥсть без вълны.»
Услышавши то, овца избѣгла в рӑвнинѹ. | Одјезд. Тьма.`;

describe('transliterate to', () => {
  describe.each([
    ['art-Cyrl-x-interslv'],
    ['art-Cyrl-x-interslv-etym'],
    ['art-Cyrl-x-interslv-iotated'],
    ['art-Cyrl-x-interslv-iotated-ext'],
    ['art-Cyrl-x-interslv-northern'],
    ['art-Cyrl-x-interslv-sloviant'],
    ['art-Cyrl-x-interslv-southern'],
    ['art-Glag-x-interslv'],
    ['art-Glag-x-interslv-etym'],
    ['art-Glag-x-interslv-sloviant'],
    ['art-Glag-x-interslv-southern'],
    ['art-Glag-x-interslv-northern'],
    ['art-Latn-PL-x-interslv'],
    ['art-Latn-x-interslv'],
    ['art-Latn-x-interslv-ascii'],
    ['art-Latn-x-interslv-etym'],
    ['art-Latn-x-interslv-northern'],
    ['art-Latn-x-interslv-sloviant'],
    ['art-Latn-x-interslv-southern'],
    ['art-x-interslv-fonipa'],
    ['art-x-interslv'],
  ] as const)('%j', (bcp47) => {
    test('a latin text', () => {
      expect(transliterate(latin, bcp47)).toMatchSnapshot();
    });

    test('a cyrillic text', () => {
      expect(transliterate(cyrillic, bcp47)).toMatchSnapshot();
    });
  });

  test.each([
    ['art-Latn-x-interslv'],
    ['art-Cyrl-x-interslv'],
    ['art-Glag-x-interslv'],
  ] as const)(
    'should work equally from Latin and Cyrillic scripts to %j',
    (bcp47) => {
      const latn = transliterate(latin, bcp47);
      const cyrl = transliterate(cyrillic, bcp47);

      expect(latn).toEqual(cyrl);
    },
  );

  test('unknown code', () => {
    expect(() => transliterate('', 'en' as any)).toThrowErrorMatchingSnapshot();
  });
});
