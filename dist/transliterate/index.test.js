"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const index_1 = tslib_1.__importDefault(require("./index"));
const latin = `\
Na vȯzvyšenosti ovca, ktora ne iměla vȯlnų, uviděla konjev. Pŕvy tęgal tęžky voz, vtory nosil veliko brěmę, tretji brzo vozil mųža.
Ovca rěkla konjam: «Boli mně sŕdce, kȯgda viđų, kako člověk vladaje konjami.»
Konji rěkli: «Slušaj, ovco, nam boli sŕdce, kȯgda vidimo ovo: mųž, gospodaŕ, bere tvojų vȯlnų, da by iměl dlja sebe teplo paĺto. A ovca jest bez vȯlny.»
Uslyšavši to, ovca izběgla v råvninų. | Odjezd. T́ma, i korenje revenja počęli råsteńje, a slugi pověděli krålju o veseĺju.`;
const cyrillic = `\
На возвышености овца, ктора не имѣла вълнѫ, увидѣла коњев. Прьвы тѧгал тѧжкы воз, вторы носил велико брємѧ, третји брзо возил мѫжа.
Овца рѣкла коням: «Боли мнє срьдце, къгда виџу, како чловѣк владаје коньами.»
Конји рѣкли: «Слушай, овцо, нам боли срьдце, къгда видимо ово: мѫж, господарь, бере твоѭ вълнѫ, да бы имѣл дља себе тепло пальто. А овца ѥсть без вълны.»
Услышавши то, овца избѣгла в рӑвнинѹ. | Одјезд. Тьма, и корење ревења почѧли рӑстеньје, а слуги повєдѣли крӑљу о весельју.`;
describe('transliterate to', () => {
    describe.each([
        ['isv-Cyrl'],
        ['isv-Cyrl-x-etymolog'],
        ['isv-Cyrl-x-iotated'],
        ['isv-Cyrl-x-iotated-ext'],
        ['isv-Cyrl-x-northern'],
        ['isv-Cyrl-x-sloviant'],
        ['isv-Cyrl-x-southern'],
        ['isv-Glag'],
        ['isv-Glag-x-etymolog'],
        ['isv-Glag-x-sloviant'],
        ['isv-Glag-x-southern'],
        ['isv-Glag-x-northern'],
        ['isv-Latn'],
        ['isv-Latn-PL'],
        ['isv-Latn-x-ascii'],
        ['isv-Latn-x-etymolog'],
        ['isv-Latn-x-northern'],
        ['isv-Latn-x-sloviant'],
        ['isv-Latn-x-southern'],
        ['isv-x-fonipa'],
        ['isv'],
    ])('%j', (bcp47) => {
        test('a latin text', () => {
            expect((0, index_1.default)(latin, bcp47)).toMatchSnapshot();
        });
        test('a cyrillic text', () => {
            expect((0, index_1.default)(cyrillic, bcp47)).toMatchSnapshot();
        });
    });
    test.each([['isv-Latn'], ['isv-Cyrl'], ['isv-Glag']])('should work equally from Latin and Cyrillic scripts to %j', (bcp47) => {
        const latn = (0, index_1.default)(latin, bcp47);
        const cyrl = (0, index_1.default)(cyrillic, bcp47);
        expect(latn).toEqual(cyrl);
    });
    test.failing('double transliteration should work equally from Latin and Cyrillic scripts', () => {
        const latn2cyrl = (0, index_1.default)(latin, 'isv-Cyrl');
        const cyrl2latn = (0, index_1.default)(cyrillic, 'isv-Latn');
        expect((0, index_1.default)(latn2cyrl, 'isv-Latn')).toEqual(cyrl2latn);
        expect((0, index_1.default)(cyrl2latn, 'isv-Cyrl')).toEqual(latn2cyrl);
    });
    test('unknown code', () => {
        expect(() => (0, index_1.default)('', 'en')).toThrowErrorMatchingSnapshot();
    });
});
//# sourceMappingURL=index.test.js.map