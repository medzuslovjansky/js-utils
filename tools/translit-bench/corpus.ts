import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

/**
 * Two workloads, because they stress different things and a win on one is not
 * a win on the other.
 *
 * `prose` is running text: short words, heavy repetition, the shape a caller
 * actually passes in. A per-word cache does very well here and tells you
 * nothing about the rules.
 *
 * `lexicon` is every distinct form in the dictionary, each appearing once. No
 * repetition to exploit, long inflected words, every rule in the engine
 * reached. This is where the rules themselves are measured.
 */

const PARAGRAPH = `\
Na vȯzvyšenosti ovca, ktora ne iměla vȯlnų, uviděla konjev. Pŕvy tęgal tęžky voz,
vtory nosil veliko brěmę, tretji brzo vozil mųža. Ovca rěkla konjam: Boli mně
sŕdce, kȯgda viđų, kako člověk vladaje konjami. Konji rěkli: Slušaj, ovco, nam
boli sŕdce, kȯgda vidimo ovo: mųž, gospodaŕ, bere tvojų vȯlnų, da by iměl dlja
sebe teplo paĺto. A ovca jest bez vȯlny. Uslyšavši to, ovca izběgla v råvninų.
Odjezd. T́ma, i korenje revenja počęli råsteńje, a slugi pověděli krålju o
veseĺju. Vsi ljudi rodįt sę svobodni i råvni v svojem dostojinstvu i pravah.
Oni sųt obdarjeni råzumom i sȯvěstjų i imajų postupati jedin k drugomu v duhu
bratstva.`;

function build(): { prose: string; lexicon: string } {
  const dump = zlib
    .gunzipSync(
      fs.readFileSync(
        path.join(import.meta.dirname, '../dump/__fixtures__/paradigms.tsv.gz'),
      ),
    )
    .toString('utf8');

  const forms = [
    ...new Set(
      dump
        .split('\n')
        .slice(1)
        .map((line) => line.split('\t')[2])
        .filter(Boolean),
    ),
  ];

  // both workloads sized to the same order of magnitude so the numbers compare
  const prose = Array.from({ length: 170 }, () => PARAGRAPH).join('\n');

  // a slice, not the whole dictionary: the point is words that never repeat,
  // and 25 000 of them make that point as well as 195 000 while keeping a
  // full sweep — every candidate, every runtime, every tag — under ten minutes
  const lines: string[] = [];
  for (let i = 0; i + 12 <= 11_000; i += 12) {
    lines.push(forms.slice(i, i + 12).join(' '));
  }
  const lexicon = lines.join('\n');

  return { prose, lexicon };
}

/**
 * The corpora are written out as a plain data module rather than read at run
 * time: the same bundle has to run in a browser, where there is no disk.
 */
const { prose, lexicon } = build();
fs.mkdirSync(path.join(import.meta.dirname, 'out'), { recursive: true });
fs.writeFileSync(
  path.join(import.meta.dirname, 'out/corpora.js'),
  `export const prose = ${JSON.stringify(prose)};\n` +
    `export const lexicon = ${JSON.stringify(lexicon)};\n`,
);
console.log(
  `prose ${(prose.length / 1024) | 0} KB, lexicon ${(lexicon.length / 1024) | 0} KB`,
);
