import fs from 'node:fs';
import path from 'node:path';

import { expand, readFixtures, toConlluBlock, toTsvRows } from './dump.ts';

const outDir = path.resolve(process.argv[2] ?? 'out');
fs.mkdirSync(outDir, { recursive: true });

const rows = readFixtures();
const tsv: string[] = ['# lemma\tform\tfeats'];
const conllu: string[] = [];
let lemmas = 0;
let skipped = 0;

for (const row of rows) {
  const entries = expand(row);
  if (entries.length === 0) skipped++;

  for (const entry of entries) {
    lemmas++;
    tsv.push(...toTsvRows(entry));
    conllu.push(toConlluBlock(entry));
  }
}

// The whole dump is held in memory: about 40 MB at 17.8k lemmas. Switch to
// write streams if the lexicon grows an order of magnitude.
fs.writeFileSync(
  path.join(outDir, 'interslavic-forms.tsv'),
  tsv.join('\n') + '\n',
);
fs.writeFileSync(path.join(outDir, 'interslavic.conllu'), conllu.join(''));

console.log(
  `${tsv.length - 1} forms from ${lemmas} lemmas ` +
    `(${rows.length} rows, ${skipped} uninflectable) → ${outDir}`,
);
