import { describe, test } from 'node:test';
import assert from 'node:assert';
import { snapshots } from '@interslavic/dev-snapshot';

import { latn2glag } from './latn2glag.ts';
import { glag2latn } from './glag2latn.ts';

const snap = snapshots(import.meta.filename);

describe('Latn → Glag', () => {
  const SANITY = `\
Na vȯzvyšenosti ovca, ktora ne iměla vȯlnų, uviděla konjev. Pŕvy tęgal tęžky voz, vtory nosil veliko brěmę, tretji brzo vozil mųža.
Ovca rěkla konjam: «Boli mně sŕdce, kȯgda viđų, kako člověk vladaje konjami.»
Konji rěkli: «Slušaj, ovco, nam boli sŕdce, kȯgda vidimo ovo: mųž, gospodaŕ, bere tvojų vȯlnų, da by iměl dlja sebe teplo paĺto. A ovca jest bez vȯlny.»
Uslyšavši to, ovca izběgla v råvninų. | Oficialny noćny odjezd do Kyjeva. T́ma, i korenje revenja počęli råsteńje, a slugi pověděli krålju o veseĺju. `;

  test('sanity check (1)', (t) => {
    snap.match(t, 'Latn → Glag sanity check (1)', latn2glag(SANITY));
  });

  test('sanity check (2)', (t) => {
    const actual = latn2glag(SANITY, {
      latinateMyslite: true,
      shta: false,
    });
    snap.match(t, 'Latn → Glag sanity check (2)', actual);
  });

  test('double check', () => {
    const glag1 = latn2glag(SANITY);
    const glag2 = latn2glag(glag2latn(glag1));
    assert.strictEqual(glag2, glag1);
  });
});
