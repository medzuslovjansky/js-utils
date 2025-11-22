import { parseXPos } from './parseXPOS';
import { TokenFeatures } from './schema';

describe('parseXPos', () => {
  const check = (xpos: string, expectedUpos: string, expectedFeats: string) => {
    const result = parseXPos(xpos);

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

    if (!match) {
      const actual = result
        .map(([u, f]) => `${u} ${formatFeats(f)}`)
        .join('\n');
      throw new Error(
        `Expected ${expectedUpos} ${expectedFeats} to be found in:\n${actual}`,
      );
    }
  };

  test.each([
    ['adj.', 'ADJ', 'Degree=Pos'],
    ['adj.comp.', 'ADJ', 'Degree=Cmp'],
    ['adj.sup.', 'ADJ', 'Degree=Sup'],
    ['adj.indecl.', 'ADJ', 'Degree=Pos|Uninflect=Yes'],
    ['adj.pfap.', 'ADJ', 'Degree=Pos|Tense=Past|VerbForm=Part|Voice=Act'],
    ['adj.pfpp.', 'ADJ', 'Degree=Pos|Tense=Past|VerbForm=Part|Voice=Pass'],
    ['adj.prap.', 'ADJ', 'Degree=Pos|Tense=Pres|VerbForm=Part|Voice=Act'],
    ['adj.prpp.', 'ADJ', 'Degree=Pos|Tense=Pres|VerbForm=Part|Voice=Pass'],
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
    ['num.ord.', 'ADJ', 'NumType=Ord'],
    ['particle', 'PART', '_'],
    ['phrase', 'X', '_'],
    ['prefix', 'X', '_'],
    ['prep.', 'ADP', '_'],
    ['pron.dem.', 'DET', 'PronType=Dem'],
    ['pron.indef.', 'PRON', 'PronType=Ind'],
    ['pron.int.', 'PRON', 'PronType=Int'],
    ['pron.pers.', 'PRON', 'PronType=Prs'],
    ['pron.poss.', 'DET', 'Poss=Yes|PronType=Prs'],
    ['pron.rec.', 'PRON', 'PronType=Rcp'],
    ['pron.refl.', 'PRON', 'PronType=Prs|Reflex=Yes'],
    ['pron.rel.', 'PRON', 'PronType=Rel'],
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
  ])('parseXPos(%s) includes %s %s', (xpos, expectedUpos, expectedFeats) => {
    check(xpos, expectedUpos, expectedFeats);
  });
});
