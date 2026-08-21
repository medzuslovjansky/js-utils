/**
 * The reverse of `parseXPos()`: a UPOS tag and its features back into a
 * Steenbergen part-of-speech string. `inflect()` needs it when the caller
 * describes a word in UD terms and the declension algorithms want `m.anim.`.
 */

export function uposFeatsToXpos(
  upos?: string,
  feats?: Record<string, string>,
): string {
  switch (upos) {
    case 'NOUN':
    case 'PROPN': {
      const g = feats?.Gender;
      let base = 'm.';
      if (g === 'Masc') base = feats?.Animacy === 'Anim' ? 'm.anim.' : 'm.';
      else if (g === 'Fem') base = 'f.';
      else if (g === 'Neut') base = 'n.';

      if (feats?.Number === 'Ptan') base = base.replace('.', '.pl.');
      return upos === 'PROPN' ? `${base}propn.` : base;
    }
    case 'ADJ': {
      let base = 'adj.';
      if (feats?.Degree === 'Cmp') base = 'adj.comp.';
      else if (feats?.Degree === 'Sup') base = 'adj.sup.';
      else if (feats?.Poss === 'Yes') base = 'adj.poss.';
      else if (feats?.VerbForm === 'Part') {
        // Participle fallback under ADJ
        if (feats?.Tense === 'Pres' && feats?.Voice === 'Act') base = 'v.prap.';
        else if (feats?.Tense === 'Pres' && feats?.Voice === 'Pass')
          base = 'v.prpp.';
        else if (feats?.Tense === 'Past' && feats?.Voice === 'Act')
          base = 'v.pfap.';
        else if (feats?.Tense === 'Past' && feats?.Voice === 'Pass')
          base = 'v.pfpp.';
      }
      return base;
    }
    case 'VERB':
    case 'AUX': {
      if (feats?.VerbForm === 'Part') {
        if (feats?.Tense === 'Pres' && feats?.Voice === 'Act') return 'v.prap.';
        if (feats?.Tense === 'Pres' && feats?.Voice === 'Pass')
          return 'v.prpp.';
        if (feats?.Tense === 'Past' && feats?.Voice === 'Act') return 'v.pfap.';
        if (feats?.Tense === 'Past' && feats?.Voice === 'Pass')
          return 'v.pfpp.';
        return 'v.part.';
      }
      const aspect = feats?.Aspect === 'Perf' ? 'pf.' : 'ipf.';
      const isAux = upos === 'AUX';
      if (isAux) return `v.aux. ${aspect}`;
      if (feats?.Reflex === 'Yes') return `v.refl. ${aspect}`;
      // Default to transitive
      return `v.tr. ${aspect}`;
    }
    case 'ADV': {
      if (feats?.Degree === 'Cmp') return 'adv.comp.';
      if (feats?.Degree === 'Sup') return 'adv.sup.';
      return 'adv.';
    }
    case 'ADP':
      return 'prep.';
    case 'CCONJ':
    case 'SCONJ':
      return 'conj.';
    case 'DET': {
      if (feats?.PronType === 'Dem') return 'pron.dem.';
      if (feats?.Poss === 'Yes') return 'pron.poss.';
      if (feats?.PronType === 'Tot') return 'pron.univ.';
      return 'pron.';
    }
    case 'PRON': {
      if (feats?.PronType === 'Prs') {
        if (feats?.Reflex === 'Yes') return 'pron.refl.';
        return 'pron.pers.';
      }
      if (feats?.PronType === 'Int') return 'pron.int.';
      if (feats?.PronType === 'Rel') return 'pron.rel.';
      if (feats?.PronType === 'Ind') return 'pron.indef.';
      if (feats?.PronType === 'Neg') return 'pron.neg.';
      if (feats?.PronType === 'Rcp') return 'pron.rec.';
      return 'pron.';
    }
    case 'NUM': {
      if (feats?.NumType === 'Card') return 'num.card.';
      if (feats?.NumType === 'Ord') return 'num.ord.';
      if (feats?.NumType === 'Frac') return 'num.fract.';
      if (feats?.NumType === 'Mult') return 'num.mult.';
      if (feats?.NumType === 'Dist') return 'num.diff.';
      return 'num.';
    }
    case 'PART':
      return 'particle';
    case 'INTJ':
      return 'intj.';
    case 'X':
    default:
      return '';
  }
}
