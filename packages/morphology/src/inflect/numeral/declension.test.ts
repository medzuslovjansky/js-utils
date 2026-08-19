import { describe, test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

import {
  declineNumeral,
  inflectNumeral,
  type NumeralParadigm,
} from './declension.ts';
import { type Numeral, parsePos } from '../../partOfSpeech/index.ts';

const rawTestCases: any[] = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, 'testCases.json'), 'utf8'),
);

describe('numeral', () => {
  const numeral = rawTestCases.map(
    (t) => [t.init.word, t.init.details, t.expected] as const,
  );

  for (const [word, details, expected] of numeral) {
    test(word, () => {
      const actual = render(declineNumeral(word, numeralType(details)));

      if (actual === null) {
        assert.strictEqual(actual, expected);
      } else {
        assert.partialDeepStrictEqual(actual, expected);
      }
    });
  }
});

describe('inflectNumeral', () => {
  const featsOf = (word: string, xpos: string) =>
    inflectNumeral(word, xpos).map(
      (result) => result.feats as Record<string, string>,
    );

  test('reads a masculine gender off the ending of a cardinal', () => {
    for (const feats of featsOf('milion', 'num.card.')) {
      assert.strictEqual(feats.Gender, 'Masc');
    }
  });

  test('leaves the gender of a cardinal open when the ending does not say', () => {
    // `dva` comes from the hand-written table, which splits its columns by
    // gender in a way the ending cannot be read back from.
    const feats = featsOf('dva', 'num.card.');

    assert.ok(feats.length > 0);
    for (const f of feats) {
      assert.strictEqual(f.Gender, undefined);
    }
  });

  test('says nothing about a word tagged as something other than a numeral', () => {
    assert.deepStrictEqual(inflectNumeral('dom', 'm.'), []);
    assert.deepStrictEqual(inflectNumeral('dobro', 'adv.'), []);
  });
});

/** Every recorded case carries a `num.` tag, so the parse is always a numeral. */
function numeralType(details: string) {
  return (parsePos(details) as Numeral).type;
}

/**
 * The table these cases were recorded from printed each column as one string,
 * the two readings of a slot joined by a slash. The cells say the same thing
 * with the difference spelled out; joining them back is what the expectations
 * are still written in.
 */
function render(paradigm: NumeralParadigm | null) {
  if (!paradigm) return null;

  const slots = (cells?: Record<string, Array<Array<{ form: string }>>>) =>
    cells &&
    Object.fromEntries(
      Object.entries(cells).map(([name, columns]) => [
        name,
        columns.map((column) => column.map(({ form }) => form).join(' / ')),
      ]),
    );

  return {
    type: paradigm.type,
    ...(paradigm.columns ? { columns: paradigm.columns } : {}),
    ...(paradigm.cases ? { cases: slots(paradigm.cases) } : {}),
    ...(paradigm.casesSingular
      ? { casesSingular: slots(paradigm.casesSingular) }
      : {}),
    ...(paradigm.casesPlural
      ? { casesPlural: slots(paradigm.casesPlural) }
      : {}),
  };
}
