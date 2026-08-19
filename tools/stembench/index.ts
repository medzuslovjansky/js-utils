import { ENDINGS } from '../../packages/stemmer/src/endings.ts';
import { stemmerFor } from '../../packages/stemmer/src/stemmer.ts';

import { collisions, paradigms, score, splits } from './bench.ts';
import { learn, serialize } from './learn.ts';

const args = new Set(process.argv.slice(2));
const floor = Number(
  process.argv.find((a) => a.startsWith('--fail-under='))?.slice(14) ?? 0,
);

const data = paradigms();
const result = score(data);
const pct = (n: number) => (100 * n).toFixed(2).padStart(6) + '%';

console.log(
  `lemmas ${data.size}  forms ${result.forms}  stems ${result.stems}`,
);
console.log(
  `recall     ${pct(result.recall)}   forms of a word reachable from one of them`,
);
console.log(
  `precision  ${pct(result.precision)}   hits on a stem that are the word you meant`,
);
console.log(`F1         ${pct(result.f1)}`);

if (args.has('--splits')) {
  console.log('\nworst-split paradigms');
  for (const row of splits(data)) {
    console.log(
      `  ${row.share.toFixed(2)}  ${row.lemma.padEnd(20)} ${row.stems.join(' ')}`,
    );
  }
}

if (args.has('--collisions')) {
  console.log('\nbiggest stem collisions');
  for (const row of collisions(data)) {
    console.log(
      `  ${row.stem.padEnd(12)} ${row.lemmas.length}  ${row.lemmas.slice(0, 8).join(' ')}`,
    );
  }
}

// The table is learnt from the same lexicon it is scored on, so the headline
// number cannot tell a rule that generalizes from a word that was memorized.
// This can: learn on half the lemmas, score the other half.
if (args.has('--holdout')) {
  const entries = [...data];
  const train = new Map(entries.filter((_, i) => i % 2 === 0));
  const test = new Map(entries.filter((_, i) => i % 2 === 1));

  const seen = score(test, stemmerFor(ENDINGS));
  const unseen = score(test, stemmerFor(serialize(learn(train))));

  console.log('\nheld-out half of the lexicon');
  console.log(`  table that saw it      F1 ${pct(seen.f1)}`);
  console.log(`  table that did not     F1 ${pct(unseen.f1)}`);
  console.log(
    `  memorized             ${pct(seen.f1 - unseen.f1)} of the score`,
  );
}

if (floor && 100 * result.f1 < floor) {
  console.error(`\nF1 ${pct(result.f1)} is below the floor of ${floor}%`);
  process.exit(1);
}
