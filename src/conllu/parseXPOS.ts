import { TokenFeatures, UPOS } from './schema';

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
 * parseXPos('m.') // => [['NOUN', { Gender: "Masc" }]]
 * parseXPos('m./f.') // => [['NOUN', { Gender: "Masc" }], ['NOUN', { Gender: "Fem" }]]
 * parseXPos('v.tr. ipf./pf.') // => [['VERB', { Aspect: "Imp", VerbForm: "Inf" }], ['VERB', { Aspect: "Perf", VerbForm: "Inf" }]]
 */
export function parseXPos(xpos: string): XPosParseResult[] {
  // Remove leading # (commented entries) and trim
  const clean = xpos.replace(/^#/, '').trim();

  // Nouns: m., f., n. with various modifiers
  if (/^[mfn]\./.test(clean)) {
    // Handle m./f. case (dual gender)
    if (clean.startsWith('m./f.')) {
      const results: XPosParseResult[] = [];
      const baseFeatures = parseNounModifiers(clean);

      // Masculine variant
      const mascFeatures: TokenFeatures = { ...baseFeatures, Gender: 'Masc' };
      results.push(['NOUN', mascFeatures]);

      // Feminine variant
      const femFeatures: TokenFeatures = { ...baseFeatures, Gender: 'Fem' };
      results.push(['NOUN', femFeatures]);

      return results;
    }

    const features: TokenFeatures = {};

    // Gender
    if (clean.startsWith('m.')) {
      features.Gender = 'Masc';
    } else if (clean.startsWith('f.')) {
      features.Gender = 'Fem';
    } else if (clean.startsWith('n.')) {
      features.Gender = 'Neut';
    }

    // Apply modifiers
    const modifiers = parseNounModifiers(clean);
    Object.assign(features, modifiers);

    return [['NOUN', features]];
  }

  // Verbs
  if (/^v\./.test(clean)) {
    // Handle biaspectual verbs (ipf./pf.)
    if (clean.includes('ipf./pf.')) {
      const results: XPosParseResult[] = [];
      const upos = clean.includes('aux') ? 'AUX' : 'VERB';

      // Imperfective variant
      const ipfFeatures: TokenFeatures = {
        Aspect: 'Imp',
        VerbForm: 'Inf',
      };
      results.push([upos, ipfFeatures]);

      // Perfective variant
      const pfFeatures: TokenFeatures = {
        Aspect: 'Perf',
        VerbForm: 'Inf',
      };
      results.push([upos, pfFeatures]);

      return results;
    }

    const features: TokenFeatures = {};

    // Aspect
    if (clean.includes('ipf')) {
      features.Aspect = 'Imp';
    } else if (clean.includes('pf')) {
      features.Aspect = 'Perf';
    }

    // VerbForm (dictionary form is Infinitive)
    features.VerbForm = 'Inf';

    // Auxiliary verbs
    if (clean.includes('aux')) {
      return [['AUX', features]];
    }

    return [['VERB', features]];
  }

  // Adjectives
  if (clean.startsWith('adj.')) {
    const features: TokenFeatures = {};

    // Participles (VerbForm=Part)
    if (clean.includes('prap')) {
      // Present Active Participle
      features.VerbForm = 'Part';
      features.Tense = 'Pres';
      features.Voice = 'Act';
      features.Degree = 'Pos';
      return [['ADJ', features]];
    } else if (clean.includes('prpp')) {
      // Present Passive Participle
      features.VerbForm = 'Part';
      features.Tense = 'Pres';
      features.Voice = 'Pass';
      features.Degree = 'Pos';
      return [['ADJ', features]];
    } else if (clean.includes('pfap')) {
      // Past Active Participle
      features.VerbForm = 'Part';
      features.Tense = 'Past';
      features.Voice = 'Act';
      features.Degree = 'Pos';
      return [['ADJ', features]];
    } else if (clean.includes('pfpp')) {
      // Past Passive Participle
      features.VerbForm = 'Part';
      features.Tense = 'Past';
      features.Voice = 'Pass';
      features.Degree = 'Pos';
      return [['ADJ', features]];
    }

    // Uninflectability
    if (clean.includes('indecl')) {
      features.Uninflect = 'Yes';
    }

    // Degree (for non-participle adjectives)
    if (clean.includes('comp')) {
      features.Degree = 'Cmp';
    } else if (clean.includes('sup')) {
      features.Degree = 'Sup';
    } else {
      features.Degree = 'Pos';
    }

    return [['ADJ', features]];
  }

  // Adverbs
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

  // Adpositions (prepositions)
  if (clean === 'prep.') {
    return [['ADP', {}]];
  }

  // Conjunctions
  if (clean === 'conj.') {
    return [['CCONJ', {}]];
  }

  // Interjections
  if (clean === 'intj.') {
    return [['INTJ', {}]];
  }

  // Numerals
  if (clean.startsWith('num.')) {
    // Ordinal numerals are tagged as ADJ in UD
    if (clean === 'num.ord.') {
      return [['ADJ', { NumType: 'Ord' }]];
    }
    // Substantivized numerals (e.g., "četverka" - names of numbers) are NOUN
    if (clean === 'num.subst.') {
      return [['NOUN', {}]];
    }
    // Fractional numerals (e.g., "četvŕtina" - quarter) are NOUN per UD guidelines
    if (clean === 'num.fract.') {
      return [['NOUN', { NumType: 'Frac' }]];
    }
    // Multiplicative numerals that inflect like adjectives (e.g., "četverny") are ADJ
    if (clean === 'num.mult.') {
      return [['ADJ', { NumType: 'Mult' }]];
    }
    // Differential/distributive numerals that inflect like adjectives (e.g., "četveraky") are ADJ
    if (clean === 'num.diff.') {
      return [['ADJ', { NumType: 'Dist' }]];
    }
    if (clean === 'num.card.') {
      return [['NUM', { NumType: 'Card' }]];
    }
    // Default: cardinal and collective numerals remain NUM
    return [['NUM', {}]];
  }

  // Pronouns and Determiners
  if (clean.startsWith('pron.')) {
    const features: TokenFeatures = {};

    // Personal
    if (clean === 'pron.pers.') {
      features.PronType = 'Prs';
      return [['PRON', features]];
    }

    // Reflexive
    if (clean === 'pron.refl.') {
      features.PronType = 'Prs';
      features.Reflex = 'Yes';
      return [['PRON', features]];
    }

    // Possessive
    if (clean === 'pron.poss.') {
      features.PronType = 'Prs';
      features.Poss = 'Yes';
      return [['DET', features]];
    }

    // Demonstrative
    if (clean === 'pron.dem.') {
      features.PronType = 'Dem';
      return [['DET', features]];
    }

    // Interrogative
    if (clean === 'pron.int.') {
      features.PronType = 'Int';
      return [['PRON', features]];
    }

    // Relative
    if (clean === 'pron.rel.') {
      features.PronType = 'Rel';
      return [['PRON', features]];
    }

    // Indefinite
    if (clean === 'pron.indef.') {
      features.PronType = 'Ind';
      return [['PRON', features]];
    }

    // Reciprocal
    if (clean === 'pron.rec.') {
      features.PronType = 'Rcp';
      return [['PRON', features]];
    }

    // Negative
    // Note: Negative pronouns are not explicitly in the tests but common in Slavic
    if (clean === 'pron.neg.') {
      features.PronType = 'Neg';
      return [['PRON', features]];
    }

    // Total / Universal
    // Note: Total pronouns are not explicitly in the tests but common in Slavic
    if (clean === 'pron.tot.' || clean === 'pron.univ.') {
      features.PronType = 'Tot';
      return [['DET', features]];
    }

    // Fallback for other pronouns
    return [['PRON', {}]];
  }

  // Particles
  if (clean === 'particle') {
    return [['PART', {}]];
  }

  // Special cases: phrases, prefixes, suffixes
  if (clean === 'phrase' || clean === 'prefix' || clean === 'suffix') {
    return [['X', {}]];
  }

  // Fallback for unknown tags
  return [['X', {}]];
}

/**
 * Parse noun modifiers (animacy, number, inflectability)
 * Returns a plain object of features without gender
 */
function parseNounModifiers(xpos: string): TokenFeatures {
  const features: TokenFeatures = {};

  // Animacy
  if (xpos.includes('anim')) {
    features.Animacy = 'Anim';
  }

  // Number
  if (xpos.includes('.pl.')) {
    features.Number = 'Ptan';
  } else if (xpos.includes('.sg.')) {
    features.Number = 'Sing';
  }

  // Uninflectability
  if (xpos.includes('indecl')) {
    features.Uninflect = 'Yes';
  }

  return features;
}
