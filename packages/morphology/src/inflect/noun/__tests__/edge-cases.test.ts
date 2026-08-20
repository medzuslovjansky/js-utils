import { test } from 'node:test';
import assert from 'node:assert';

import { declineNounSimple, inflectNoun } from '../index.ts';

test('a v-stem feminine declines the same spelled with a plain o', () => {
  const plain = declineNounSimple('ljubov', 'f.');

  assert.deepStrictEqual(plain, declineNounSimple('ljubȯv', 'f.'));
  assert.strictEqual(plain?.nom[0]?.[0].form, 'ljubȯv');
});

test('a genitive hint no declension class can produce leaves the stem alone', () => {
  assert.deepStrictEqual(
    declineNounSimple('čaj', 'm.', 'čaju'),
    declineNounSimple('čaj', 'm.'),
  );
});

test('morphology that is not a noun is refused rather than declined', () => {
  assert.throws(() => declineNounSimple('dobry', 'adj.'), /not a noun/);
});

test('a tag that is not a noun yields no forms at all', () => {
  assert.deepStrictEqual(inflectNoun('dobry', 'adj.'), []);
});

test('a substantivized adjective keeps its own gender in the accusative', () => {
  const form = (paradigm: ReturnType<typeof declineNounSimple>) =>
    paradigm?.acc[0]?.map(({ form }) => form);

  // Three genders, three accusatives: the feminine takes the yus, the neuter
  // repeats the nominative, and the masculine follows animacy — the genitive
  // for an animate, the nominative for an inanimate.
  assert.deepStrictEqual(form(declineNounSimple('prěměnna', 'f.', '(-oj)')), [
    'prěměnnų',
  ]);
  assert.deepStrictEqual(form(declineNounSimple('srědnje', 'n.', '(-ego)')), [
    'srědnje',
  ]);
  assert.deepStrictEqual(
    form(declineNounSimple('učeny', 'm.anim.', '(-ogo)')),
    ['učenogo'],
  );
  assert.deepStrictEqual(form(declineNounSimple('zloty', 'm.', '(-ogo)')), [
    'zloty',
  ]);
});

test('a subst. tag declines as an adjective without a bracketed genitive', () => {
  // The tag says only that the word is an adjective; where the dictionary spells
  // the declension out in brackets, the lemma alone has to say the same thing.
  for (const [lemma, tag, gender, bracketed] of [
    ['učeny', 'm.anim.subst.', 'm.anim.', '(-ogo)'],
    ['pųtujųći', 'm.anim.subst.', 'm.anim.', '(-ego)'],
    ['zloty', 'm.subst.', 'm.', '(-ogo)'],
    ['prěměnna', 'f.subst.', 'f.', '(-oj)'],
    ['srědnja', 'f.subst.', 'f.', '(-ej)'],
    ['srědnje', 'n.subst.', 'n.', '(-ego)'],
    ['dobro', 'n.subst.', 'n.', '(-ogo)'],
  ] as const) {
    assert.deepStrictEqual(
      declineNounSimple(lemma, tag),
      declineNounSimple(lemma, gender, bracketed),
      `${lemma} ${tag}`,
    );
  }
});
