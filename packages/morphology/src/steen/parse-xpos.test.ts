import { test } from 'node:test';
import assert from 'node:assert';

import type { TokenFeatures } from '@interslavic/conllu';
import { parseXPos } from './parse-xpos.ts';

const testCases: Array<[string, string, string]> = [
  ['adj.', 'ADJ', 'Degree=Pos'],
  ['adj.comp.', 'ADJ', 'Degree=Cmp'],
  ['adj.sup.', 'ADJ', 'Degree=Sup'],
  ['adj.rel.', 'ADJ', '_'],
  ['adj.abs.', 'ADJ', '_'],
  ['adj.indecl.', 'ADJ', 'Degree=Pos|Uninflect=Yes'],
  ['adj.pfap.', 'VERB', 'Tense=Past|VerbForm=Part|Voice=Act'],
  ['adj.pfpp.', 'VERB', 'Tense=Past|VerbForm=Part|Voice=Pass'],
  ['adj.prap.', 'VERB', 'Tense=Pres|VerbForm=Part|Voice=Act'],
  ['adj.prpp.', 'VERB', 'Tense=Pres|VerbForm=Part|Voice=Pass'],
  ['v.pfap.', 'VERB', 'Tense=Past|VerbForm=Part|Voice=Act'],
  ['v.pfpp.', 'VERB', 'Tense=Past|VerbForm=Part|Voice=Pass'],
  ['v.prap.', 'VERB', 'Tense=Pres|VerbForm=Part|Voice=Act'],
  ['v.prpp.', 'VERB', 'Tense=Pres|VerbForm=Part|Voice=Pass'],
  ['v.part.', 'VERB', 'VerbForm=Part'],
  ['adv.', 'ADV', 'Degree=Pos'],
  ['adv.comp.', 'ADV', 'Degree=Cmp'],
  ['adv.sup.', 'ADV', 'Degree=Sup'],
  ['conj.', 'CCONJ', '_'],
  ['f.', 'NOUN', 'Gender=Fem'],
  ['f.indecl.', 'NOUN', 'Gender=Fem|Uninflect=Yes'],
  ['f.pl.', 'NOUN', 'Gender=Fem|Number=Ptan'],
  ['f.sg.', 'NOUN', 'Gender=Fem|Number=Sing'],
  ['intj.', 'INTJ', '_'],
  ['m.', 'NOUN', 'Gender=Masc'],
  ['m./f.', 'NOUN', 'Gender=Masc'], // Variant 1
  ['m./f.', 'NOUN', 'Gender=Fem'], // Variant 2
  ['m.anim.', 'NOUN', 'Animacy=Anim|Gender=Masc'],
  ['m.indecl.', 'NOUN', 'Gender=Masc|Uninflect=Yes'],
  ['m.pl.', 'NOUN', 'Gender=Masc|Number=Ptan'],
  ['m.sg.', 'NOUN', 'Gender=Masc|Number=Sing'],
  ['n.', 'NOUN', 'Gender=Neut'],
  ['n.indecl.', 'NOUN', 'Gender=Neut|Uninflect=Yes'],
  ['n.pl.', 'NOUN', 'Gender=Neut|Number=Ptan'],
  ['n.sg.', 'NOUN', 'Gender=Neut|Number=Sing'],
  ['num.', 'NUM', '_'],
  ['num.card.', 'NUM', 'NumType=Card'],
  ['num.coll.', 'NUM', 'NumType=Sets'],
  ['num.diff.', 'ADJ', 'NumType=Dist'],
  ['num.fract.', 'NOUN', 'NumType=Frac'],
  ['num.mult.', 'ADJ', 'NumType=Mult'],
  ['num.ord.', 'ADJ', 'NumType=Ord'],
  ['num.subst.', 'NOUN', '_'],
  ['particle', 'PART', '_'],
  ['phrase', 'X', '_'],
  ['prefix', 'X', '_'],
  ['prep.', 'ADP', '_'],
  ['pron.', 'PRON', '_'],
  ['pron.dem.', 'DET', 'PronType=Dem'],
  ['pron.indef.', 'PRON', 'PronType=Ind'],
  ['pron.int.', 'PRON', 'PronType=Int'],
  ['pron.neg.', 'PRON', 'PronType=Neg'],
  ['pron.pers.', 'PRON', 'PronType=Prs'],
  ['pron.poss.', 'DET', 'Poss=Yes|PronType=Prs'],
  ['pron.rec.', 'PRON', 'PronType=Rcp'],
  ['pron.refl.', 'PRON', 'PronType=Prs|Reflex=Yes'],
  ['pron.rel.', 'PRON', 'PronType=Rel'],
  ['pron.tot.', 'DET', 'PronType=Tot'],
  ['pron.univ.', 'DET', 'PronType=Tot'],
  ['suffix', 'X', '_'],
  ['v.aux. ipf.', 'AUX', 'Aspect=Imp|VerbForm=Inf'],
  ['v.aux. pf.', 'AUX', 'Aspect=Perf|VerbForm=Inf'],
  ['v.intr. ipf.', 'VERB', 'Aspect=Imp|VerbForm=Inf'],
  ['v.intr. pf.', 'VERB', 'Aspect=Perf|VerbForm=Inf'],
  ['v.ipf.', 'VERB', 'Aspect=Imp|VerbForm=Inf'],
  ['v.pf.', 'VERB', 'Aspect=Perf|VerbForm=Inf'],
  ['v.refl. ipf.', 'VERB', 'Aspect=Imp|VerbForm=Inf'],
  ['v.refl. pf.', 'VERB', 'Aspect=Perf|VerbForm=Inf'],
  ['v.tr. ipf.', 'VERB', 'Aspect=Imp|VerbForm=Inf'],
  ['v.tr. pf.', 'VERB', 'Aspect=Perf|VerbForm=Inf'],
];

for (const [xpos, expectedUpos, expectedFeats] of testCases) {
  test(`parseXPos(${xpos}) includes ${expectedUpos} ${expectedFeats}`, () => {
    check(xpos, expectedUpos, expectedFeats);
  });
}

test('parseXPos("Test", "m.") gives PROPN', () => {
  const result = parseXPos('Test', 'm.');
  assert.deepStrictEqual(result, [['PROPN', { Gender: 'Masc' }]]);
});

test('parseXPos("rad", "adj.") gives ADJ with Variant=Short', () => {
  const result = parseXPos('rad', 'adj.');
  assert.deepStrictEqual(result, [
    ['ADJ', { Degree: 'Pos', Variant: 'Short' }],
  ]);
});

test('parseXPos("Ivanov", "adj.poss.") gives ADJ with Poss=Yes (no Short)', () => {
  const result = parseXPos('Ivanov', 'adj.poss.');
  assert.deepStrictEqual(result, [['ADJ', { Degree: 'Pos', Poss: 'Yes' }]]);
});

test('biaspectual verbs give one result with no Aspect', () => {
  // Deliberate: the curated lemmas table already splits ipf./pf. into separate
  // entries, so emitting both aspects here would double every one of them.
  const result = parseXPos('abdikovati', 'v.intr. ipf./pf.');
  assert.deepStrictEqual(result, [['VERB', { VerbForm: 'Inf' }]]);
});

for (const xpos of ['', 'nezname']) {
  test(`parseXPos with an unknown xpos ${JSON.stringify(xpos)} gives X`, () => {
    assert.deepStrictEqual(parseXPos('cto', xpos), [['X', {}]]);
  });
}

function check(
  xpos: string,
  expectedUpos: string,
  expectedFeats: string,
  lemma = 'testovy',
) {
  const result = parseXPos(lemma, xpos);

  // Helper to format features for comparison
  const formatFeats = (feats: TokenFeatures) => {
    if (!feats || Object.keys(feats).length === 0) return '_';
    return Object.entries(feats)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .sort()
      .join('|');
  };

  // Check if ANY of the variants matches the expectation
  const match = result.find(
    ([upos, feats]) =>
      upos === expectedUpos && formatFeats(feats) === expectedFeats,
  );

  const actual = result.map(([u, f]) => `${u} ${formatFeats(f)}`).join('\n');
  assert.ok(
    match,
    `Expected ${expectedUpos} ${expectedFeats} to be found in:\n${actual}`,
  );
}
