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
  // repeats the nominative, and the masculine follows animacy (the genitive
  // for an animate, the nominative for an inanimate).
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
  // The tag says only that the word is an adjective, so where the dictionary
  // would spell the declension out in brackets, the lemma alone has to yield it.
  for (const [lemma, tag, gender, bracketed] of [
    ['učeny', 'm.anim.subst.', 'm.anim.', '(-ogo)'],
    ['pųtujųći', 'm.anim.subst.', 'm.anim.', '(-ego)'],
    ['zloty', 'm.subst.', 'm.', '(-ogo)'],
    ['prěměnna', 'f.subst.', 'f.', '(-oj)'],
    ['srědnja', 'f.subst.', 'f.', '(-ej)'],
    ['srědnje', 'n.subst.', 'n.', '(-ego)'],
    ['dobro', 'n.subst.', 'n.', '(-ogo)'],
    ['drobne', 'm.pl.subst.', 'm.pl.', '(-yh)'],
    ['srědnji', 'm.anim.pl.subst.', 'm.anim.pl.', '(-ih)'],
  ] as const) {
    assert.deepStrictEqual(
      declineNounSimple(lemma, tag),
      declineNounSimple(lemma, gender, bracketed),
      `${lemma} ${tag}`,
    );
  }
});

test('a substantivized adjective says so in MISC, an ordinary noun does not', () => {
  // UPOS is NOUN, as the lexicon means the entry to be, so MISC is the only
  // place left to record that the forms come from the adjective tables.
  const misc = (results: ReturnType<typeof inflectNoun>) => [
    ...new Set(results.map((result) => JSON.stringify(result.misc))),
  ];

  assert.deepStrictEqual(misc(inflectNoun('učeny', 'm.anim.', 'učenogo')), [
    '{"Declension":"Adj"}',
  ]);
  assert.deepStrictEqual(misc(inflectNoun('prěměnna', 'f.subst.')), [
    '{"Declension":"Adj"}',
  ]);
  assert.deepStrictEqual(misc(inflectNoun('dom', 'm.')), [undefined]);
  // The bracketed plural says the same thing the singular one does.
  assert.deepStrictEqual(misc(inflectNoun('drobne', 'm.pl.', '(-yh)')), [
    '{"Declension":"Adj"}',
  ]);
});

test('a subst. tag on a word that cannot be an adjective is ignored', () => {
  // A lemma ending in a consonant, or in a vowel no adjective ends in, is no
  // adjective whatever the tag says. Guessing a genitive from it would give
  // `*doogo`, so the rest of the tag is honoured and the `subst.` is dropped.
  for (const [lemma, tag, gender] of [
    ['dom', 'm.subst.', 'm.'],
    ['gospodar', 'm.anim.subst.', 'm.anim.'],
    ['noć', 'f.subst.', 'f.'],
    ['usta', 'n.pl.subst.', 'n.pl.'],
  ] as const) {
    assert.deepStrictEqual(
      declineNounSimple(lemma, tag),
      declineNounSimple(lemma, gender),
      `${lemma} ${tag}`,
    );
    assert.deepStrictEqual(
      [...new Set(inflectNoun(lemma, tag).map((result) => result.misc))],
      [undefined],
      `${lemma} ${tag}`,
    );
  }
});
