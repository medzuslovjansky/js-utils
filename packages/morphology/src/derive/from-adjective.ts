/**
 * Derivation from adjectives.
 *
 * Derives comparative, superlative, and adverb forms from positive adjectives.
 *
 * Forms produced:
 * - adjcmp (comparative adjective, synthetic): dobry → dobrějši / lěpši
 * - adjsup (superlative adjective, synthetic): dobry → najdobrějši / najlěpši
 * - adjsupn (superlative adjective, analytical): dobry → najdobry
 * - advpos (adverb positive): dobry → dobro
 * - advcmp (adverb comparative, synthetic): dobry → lěpje
 * - advsup (adverb superlative, synthetic): dobry → najlěpje
 * - advsupn (adverb superlative, analytical): dobry → najdobro
 *
 * Notes:
 * - Some adjectives like -sky only have analytical superlative (no synthetic)
 * - Comparative adjectives can derive superlative
 * - Already-superlative adjectives don't derive further
 */

import { declineAdjective } from '../inflect/adjective/index.ts';
import { transliterate } from '@interslavic/translit';
import { parseXPos } from '../steen/index.ts';
import type { DeriveContext, DerivationResult } from './core.ts';
import { filterValidResults, createAnalyticalSuperlative } from './core.ts';

/**
 * Check if comparative/superlative form looks analytical.
 * Analytical forms start with "bolje " or "naj" prefix on original word.
 */
function isAnalyticalForm(form: string, _positiveForm: string): boolean {
  // "bolje dobry" or "najbolje dobry" patterns indicate analytical
  return form.startsWith('bolje ') || form.startsWith('najbolje ');
}

/**
 * Derive all applicable forms from an adjective.
 */
export function deriveFromAdjective(ctx: DeriveContext): DerivationResult[] {
  const { lemma } = ctx;
  const word = lemma.words[0];

  if (!word?.lemma) {
    return [];
  }

  const [parsedUpos, parsedFeats] = parseXPos(word.lemma, lemma.xpos)[0] || [
    word.upos,
    {},
  ];
  const feats = { ...parsedFeats, ...word.feats };
  const upos = word.upos || parsedUpos;

  if (upos !== 'ADJ') {
    return [];
  }

  // Don't derive from participles (they're already derived from verbs)
  if (feats.VerbForm === 'Part') {
    return [];
  }

  // Don't derive comparison forms from numerals (num.ord., num.diff., etc.)
  if (feats.NumType) {
    return [];
  }

  // Don't derive comparison forms from pronouns / determiners
  if (feats.PronType) {
    return [];
  }

  // Don't derive from possessive adjectives (Ivanov, materin, etc.)
  if (feats.Poss === 'Yes') {
    return [];
  }

  // Don't derive from superlatives
  if (feats.Degree === 'Sup') {
    return [];
  }

  const xpos = lemma.xpos;

  // If this is a comparative, only derive superlative
  if (feats.Degree === 'Cmp') {
    return deriveSuperlativeFromComparative(word.lemma, xpos);
  }

  // Don't derive from relational or absolute adjectives (non-gradable, no Degree: 'Pos')
  if (feats.Degree !== 'Pos') {
    return [];
  }

  const results: DerivationResult[] = [];

  // Get the adjective paradigm
  const etymWord = transliterate(word.lemma, 'isv-Latn-x-etymolog');
  const { comparison } = declineAdjective(etymWord, '', xpos);
  const positiveForm = etymWord;

  // Derive comparative adjective (synthetic)
  if (comparison.comparative?.[0]) {
    const compAdj = comparison.comparative[0];
    if (compAdj && !isAnalyticalForm(compAdj, positiveForm)) {
      results.push({
        isv: compAdj,
        xpos: 'adj.comp.',
        derivationType: 'adjcmp',
      });
    }
  }

  // Derive superlative adjective (synthetic)
  if (comparison.superlative?.[0]) {
    const supAdj = comparison.superlative[0];
    if (supAdj && !supAdj.startsWith('najbolje ')) {
      results.push({
        isv: supAdj,
        xpos: 'adj.sup.',
        derivationType: 'adjsup',
      });
    }
  }

  // Always produce analytical superlative as well
  // e.g., dobry → najdobry, amerikansky → najamerikansky
  const analyticalSup = createAnalyticalSuperlative(positiveForm);
  results.push({
    isv: analyticalSup,
    xpos: 'adj.sup.',
    derivationType: 'adjsupn',
  });

  // Derive adverb (positive only — degrees of comparison are derived from the adverb itself)
  if (comparison.positive?.[1]) {
    const adv = comparison.positive[1];
    if (adv) {
      results.push({
        isv: adv,
        xpos: 'adv.',
        derivationType: 'advpos',
      });
    }
  }

  return filterValidResults(results);
}

/**
 * Derive superlative from a comparative adjective.
 *
 * @param comparativeForm - The comparative form (e.g., "lěpši")
 * @param _xpos - The xpos tag (unused but kept for signature consistency)
 */
function deriveSuperlativeFromComparative(
  comparativeForm: string,
  _xpos: string,
): DerivationResult[] {
  const results: DerivationResult[] = [];

  // Synthetic superlative: naj + comparative
  // lěpši → najlěpši
  const etymWord = transliterate(comparativeForm, 'isv-Latn-x-etymolog');
  const syntheticSup = `naj${etymWord}`;
  results.push({
    isv: syntheticSup,
    xpos: 'adj.sup.',
    derivationType: 'adjsup',
  });

  return filterValidResults(results);
}
