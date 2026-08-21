import { test } from 'node:test';
import assert from 'node:assert';

import { uposFeatsToXpos } from './upos-to-xpos.ts';

// The mirror image of parse-xpos.test.ts: a UD description in, one dictionary
// tag out. Whatever the features leave unsaid gets the unmarked tag.
const testCases: Array<[string | undefined, string, string]> = [
  ['NOUN', 'Gender=Masc', 'm.'],
  ['NOUN', 'Animacy=Anim|Gender=Masc', 'm.anim.'],
  ['NOUN', 'Animacy=Inan|Gender=Masc', 'm.'],
  ['NOUN', 'Gender=Fem', 'f.'],
  ['NOUN', 'Gender=Neut', 'n.'],
  ['NOUN', '_', 'm.'],
  ['NOUN', 'Gender=Fem|Number=Ptan', 'f.pl.'],
  ['NOUN', 'Gender=Neut|Number=Sing', 'n.'],
  ['PROPN', 'Gender=Fem', 'f.propn.'],
  ['ADJ', 'Degree=Pos', 'adj.'],
  ['ADJ', 'Degree=Cmp', 'adj.comp.'],
  ['ADJ', 'Degree=Sup', 'adj.sup.'],
  ['ADJ', 'Poss=Yes', 'adj.poss.'],
  ['VERB', 'Tense=Pres|VerbForm=Part|Voice=Act', 'v.prap.'],
  ['VERB', 'Tense=Pres|VerbForm=Part|Voice=Pass', 'v.prpp.'],
  ['VERB', 'Tense=Past|VerbForm=Part|Voice=Act', 'v.pfap.'],
  ['VERB', 'Tense=Past|VerbForm=Part|Voice=Pass', 'v.pfpp.'],
  ['VERB', 'VerbForm=Part', 'v.part.'],
  ['ADJ', 'Tense=Pres|VerbForm=Part|Voice=Act', 'v.prap.'],
  ['ADJ', 'Tense=Pres|VerbForm=Part|Voice=Pass', 'v.prpp.'],
  ['ADJ', 'Tense=Past|VerbForm=Part|Voice=Act', 'v.pfap.'],
  ['ADJ', 'Tense=Past|VerbForm=Part|Voice=Pass', 'v.pfpp.'],
  ['VERB', 'Aspect=Imp', 'v.tr. ipf.'],
  ['VERB', 'Aspect=Perf', 'v.tr. pf.'],
  ['VERB', 'Aspect=Imp|Reflex=Yes', 'v.refl. ipf.'],
  ['AUX', 'Aspect=Imp', 'v.aux. ipf.'],
  ['AUX', 'Aspect=Perf', 'v.aux. pf.'],
  ['ADV', 'Degree=Pos', 'adv.'],
  ['ADV', 'Degree=Cmp', 'adv.comp.'],
  ['ADV', 'Degree=Sup', 'adv.sup.'],
  ['ADP', '_', 'prep.'],
  ['CCONJ', '_', 'conj.'],
  ['SCONJ', '_', 'conj.'],
  ['DET', 'PronType=Dem', 'pron.dem.'],
  ['DET', 'Poss=Yes|PronType=Prs', 'pron.poss.'],
  ['DET', 'PronType=Tot', 'pron.univ.'],
  ['DET', 'PronType=Ind', 'pron.'],
  ['PRON', 'PronType=Prs', 'pron.pers.'],
  ['PRON', 'PronType=Prs|Reflex=Yes', 'pron.refl.'],
  ['PRON', 'PronType=Int', 'pron.int.'],
  ['PRON', 'PronType=Rel', 'pron.rel.'],
  ['PRON', 'PronType=Ind', 'pron.indef.'],
  ['PRON', 'PronType=Neg', 'pron.neg.'],
  ['PRON', 'PronType=Rcp', 'pron.rec.'],
  ['PRON', '_', 'pron.'],
  ['NUM', 'NumType=Card', 'num.card.'],
  ['NUM', 'NumType=Ord', 'num.ord.'],
  ['NUM', 'NumType=Frac', 'num.fract.'],
  ['NUM', 'NumType=Mult', 'num.mult.'],
  ['NUM', 'NumType=Dist', 'num.diff.'],
  ['NUM', '_', 'num.'],
  ['PART', '_', 'particle'],
  ['INTJ', '_', 'intj.'],
  // Nothing to say and nothing to guess from: resolveXpos() falls back on the
  // tag the ending suggested.
  ['X', '_', ''],
  [undefined, '_', ''],
];

for (const [upos, feats, expected] of testCases) {
  test(`uposFeatsToXpos(${upos}, ${feats}) is "${expected}"`, () => {
    assert.strictEqual(uposFeatsToXpos(upos, parseFeats(feats)), expected);
  });
}

test('features left out entirely are the same as none stated', () => {
  assert.strictEqual(uposFeatsToXpos('NOUN'), 'm.');
});

function parseFeats(feats: string): Record<string, string> {
  if (feats === '_') return {};

  return Object.fromEntries(
    feats.split('|').map((pair) => pair.split('=') as [string, string]),
  );
}
