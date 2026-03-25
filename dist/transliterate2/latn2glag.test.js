"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const latn2glag_1 = require("./latn2glag");
const glag2latn_1 = require("./glag2latn");
describe('Latn → Glag', () => {
    const SANITY = `\
Na vȯzvyšenosti ovca, ktora ne iměla vȯlnų, uviděla konjev. Pŕvy tęgal tęžky voz, vtory nosil veliko brěmę, tretji brzo vozil mųža.
Ovca rěkla konjam: «Boli mně sŕdce, kȯgda viđų, kako člověk vladaje konjami.»
Konji rěkli: «Slušaj, ovco, nam boli sŕdce, kȯgda vidimo ovo: mųž, gospodaŕ, bere tvojų vȯlnų, da by iměl dlja sebe teplo paĺto. A ovca jest bez vȯlny.»
Uslyšavši to, ovca izběgla v råvninų. | Oficialny noćny odjezd do Kyjeva. T́ma, i korenje revenja počęli råsteńje, a slugi pověděli krålju o veseĺju. `;
    test('sanity check (1)', () => {
        expect((0, latn2glag_1.latn2glag)(SANITY)).toMatchSnapshot();
    });
    test('sanity check (2)', () => {
        expect((0, latn2glag_1.latn2glag)(SANITY, {
            latinateMyslite: true,
            shta: false,
        })).toMatchSnapshot();
    });
    test('double check', () => {
        const glag1 = (0, latn2glag_1.latn2glag)(SANITY);
        const glag2 = (0, latn2glag_1.latn2glag)((0, glag2latn_1.glag2latn)(glag1));
        expect(glag2).toBe(glag1);
    });
});
//# sourceMappingURL=latn2glag.test.js.map