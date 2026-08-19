import type { TokenFeatures, UPOS } from '@interslavic/conllu';

/**
 * Result of parsing XPOS tag: [UPOS, features object]
 * TokenFeatures object contains morphological features as plain object: { Gender: "Masc", Number: "Sing" }
 */
export type XPosParseResult = [UPOS, TokenFeatures];

/**
 * Parse Interslavic XPOS (language-specific POS) tag to UPOS and morphological features.
 *
 * Returns an array of [UPOS, features] tuples. Usually one element, but some tags
 * like "m./f." or "v.tr. ipf./pf." expand to multiple variants.
 *
 * @param xpos - Language-specific POS tag from partOfSpeech column
 * @returns Array of [UPOS tag, features object]
 *
 * @example
 * parseXPos('test', 'm.') // => [['NOUN', { Gender: "Masc" }]]
 * parseXPos('Test', 'm.') // => [['PROPN', { Gender: "Masc" }]]
 * parseXPos('kųdėŕ', 'm./f.') // => [['NOUN', { Gender: "Masc" }], ['NOUN', { Gender: "Fem" }]]
 * parseXPos('testovati', 'v.tr. ipf./pf.') // => [['VERB', { Aspect: "Imp", VerbForm: "Inf" }], ['VERB', { Aspect: "Perf", VerbForm: "Inf" }]]
 */
export function parseXPos(lemma: string, xpos: string): XPosParseResult[] {
  const clean = xpos.replace(/^#/, '').trim();

  if (/^[mfn]\./.test(clean)) {
    if (clean.startsWith('m./f.')) {
      const results: XPosParseResult[] = [];
      const baseFeatures = parseNounModifiers(clean);

      const mascFeatures: TokenFeatures = { ...baseFeatures, Gender: 'Masc' };
      results.push(['NOUN', mascFeatures]);

      const femFeatures: TokenFeatures = { ...baseFeatures, Gender: 'Fem' };
      results.push(['NOUN', femFeatures]);

      return results;
    }

    const features: TokenFeatures = {};

    if (clean.startsWith('m.')) {
      features.Gender = 'Masc';
    } else if (clean.startsWith('f.')) {
      features.Gender = 'Fem';
    } else if (clean.startsWith('n.')) {
      features.Gender = 'Neut';
    }

    const modifiers = parseNounModifiers(clean);
    Object.assign(features, modifiers);

    const upos = startsWithUppercase(lemma) ? 'PROPN' : 'NOUN';
    return [[upos, features]];
  }

  if (/^v\./.test(clean)) {
    const features: TokenFeatures = {};

    // Participles: v.prap., v.prpp., v.pfap., v.pfpp., v.part.
    if (clean.includes('prap')) {
      features.VerbForm = 'Part';
      features.Tense = 'Pres';
      features.Voice = 'Act';
      return [['VERB', features]];
    } else if (clean.includes('prpp')) {
      features.VerbForm = 'Part';
      features.Tense = 'Pres';
      features.Voice = 'Pass';
      return [['VERB', features]];
    } else if (clean.includes('pfap')) {
      features.VerbForm = 'Part';
      features.Tense = 'Past';
      features.Voice = 'Act';
      return [['VERB', features]];
    } else if (clean.includes('pfpp')) {
      features.VerbForm = 'Part';
      features.Tense = 'Past';
      features.Voice = 'Pass';
      return [['VERB', features]];
    } else if (clean.includes('part')) {
      features.VerbForm = 'Part';
      return [['VERB', features]];
    }

    // Biaspectual verbs (ipf./pf.) return ONE result with no Aspect set
    // The curated lemmas table splits these into separate entries,
    // so disambiguation handles them (same lemma = not ambiguous)
    if (clean.includes('ipf./pf.')) {
      // Biaspectual - no Aspect set
    } else if (clean.includes('ipf')) {
      features.Aspect = 'Imp';
    } else if (clean.includes('pf')) {
      features.Aspect = 'Perf';
    }

    features.VerbForm = 'Inf';

    if (clean.includes('aux')) {
      return [['AUX', features]];
    }

    return [['VERB', features]];
  }

  if (clean.startsWith('adj.')) {
    const features: TokenFeatures = {};

    if (clean.includes('prap')) {
      features.VerbForm = 'Part';
      features.Tense = 'Pres';
      features.Voice = 'Act';
      return [['VERB', features]];
    } else if (clean.includes('prpp')) {
      features.VerbForm = 'Part';
      features.Tense = 'Pres';
      features.Voice = 'Pass';
      return [['VERB', features]];
    } else if (clean.includes('pfap')) {
      features.VerbForm = 'Part';
      features.Tense = 'Past';
      features.Voice = 'Act';
      return [['VERB', features]];
    } else if (clean.includes('pfpp')) {
      features.VerbForm = 'Part';
      features.Tense = 'Past';
      features.Voice = 'Pass';
      return [['VERB', features]];
    }

    if (clean.includes('indecl')) {
      features.Uninflect = 'Yes';
    }

    if (clean.includes('poss')) {
      features.Poss = 'Yes';
    } else if (!/[yiaoe]$/.test(lemma)) {
      features.Variant = 'Short';
    }

    if (clean.includes('comp')) {
      features.Degree = 'Cmp';
    } else if (clean.includes('sup')) {
      features.Degree = 'Sup';
    } else if (clean.includes('rel') || clean.includes('abs')) {
      // Relational / absolute adjectives have no Degree feature in UD
    } else {
      features.Degree = 'Pos';
    }

    return [['ADJ', features]];
  }

  if (clean.startsWith('adv.')) {
    const features: TokenFeatures = {};
    if (clean.includes('comp')) {
      features.Degree = 'Cmp';
    } else if (clean.includes('sup')) {
      features.Degree = 'Sup';
    } else {
      features.Degree = 'Pos';
    }
    return [['ADV', features]];
  }

  if (clean === 'prep.') {
    return [['ADP', {}]];
  }

  if (clean === 'conj.') {
    return [['CCONJ', {}]];
  }

  if (clean === 'intj.') {
    return [['INTJ', {}]];
  }

  if (clean.startsWith('num.')) {
    if (clean === 'num.ord.') {
      return [['ADJ', { NumType: 'Ord' }]];
    }
    if (clean === 'num.subst.') {
      return [['NOUN', {}]];
    }
    if (clean === 'num.fract.') {
      return [['NOUN', { NumType: 'Frac' }]];
    }
    if (clean === 'num.mult.') {
      return [['ADJ', { NumType: 'Mult' }]];
    }
    if (clean === 'num.diff.') {
      return [['ADJ', { NumType: 'Dist' }]];
    }
    if (clean === 'num.card.') {
      return [['NUM', { NumType: 'Card' }]];
    }
    if (clean === 'num.coll.') {
      return [['NUM', { NumType: 'Sets' }]];
    }
    return [['NUM', {}]];
  }

  if (clean.startsWith('pron.')) {
    const features: TokenFeatures = {};

    if (clean === 'pron.pers.') {
      features.PronType = 'Prs';
      return [['PRON', features]];
    }

    if (clean === 'pron.refl.') {
      features.PronType = 'Prs';
      features.Reflex = 'Yes';
      return [['PRON', features]];
    }

    if (clean === 'pron.poss.') {
      features.PronType = 'Prs';
      features.Poss = 'Yes';
      return [['DET', features]];
    }

    if (clean === 'pron.dem.') {
      features.PronType = 'Dem';
      return [['DET', features]];
    }

    if (clean === 'pron.int.') {
      features.PronType = 'Int';
      return [['PRON', features]];
    }

    if (clean === 'pron.rel.') {
      features.PronType = 'Rel';
      return [['PRON', features]];
    }

    if (clean === 'pron.indef.') {
      features.PronType = 'Ind';
      return [['PRON', features]];
    }

    if (clean === 'pron.rec.') {
      features.PronType = 'Rcp';
      return [['PRON', features]];
    }

    if (clean === 'pron.neg.') {
      features.PronType = 'Neg';
      return [['PRON', features]];
    }

    if (clean === 'pron.tot.' || clean === 'pron.univ.') {
      features.PronType = 'Tot';
      return [['DET', features]];
    }

    return [['PRON', {}]];
  }

  if (clean === 'particle') {
    return [['PART', {}]];
  }

  if (clean === 'phrase' || clean === 'prefix' || clean === 'suffix') {
    return [['X', {}]];
  }

  return [['X', {}]];
}

function parseNounModifiers(xpos: string): TokenFeatures {
  const features: TokenFeatures = {};

  if (xpos.includes('anim')) {
    features.Animacy = 'Anim';
  }

  if (xpos.includes('.pl.')) {
    features.Number = 'Ptan';
  } else if (xpos.includes('.sg.')) {
    features.Number = 'Sing';
  }

  if (xpos.includes('indecl')) {
    features.Uninflect = 'Yes';
  }

  return features;
}

function startsWithUppercase(str: string): boolean {
  return str[0] === str[0].toUpperCase() && str[1] === str[1].toLowerCase();
}
