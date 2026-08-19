/**
 * Derivation from adverbs.
 *
 * Derives comparative and superlative forms from positive adverbs.
 *
 * Forms produced:
 * - advcmp (comparative adverb, synthetic): dobro → bolje
 * - advsup (superlative adverb, synthetic): dobro → najbolje
 * - advsupn (superlative adverb, analytical): dobro → najdobro
 *
 * Notes:
 * - Comparative adverbs can derive superlative
 * - Already-superlative adverbs don't derive further
 */

import { declineAdjective } from '../inflect/adjective/index.ts';
import { transliterate } from '@interslavic/translit';
import { parseXPos } from '../steen/index.ts';
import type { DeriveContext, DerivationResult } from './core.ts';
import { filterValidResults, createAnalyticalSuperlative } from './core.ts';

/**
 * Check if comparative/superlative form looks analytical.
 */
function isAnalyticalForm(form: string): boolean {
  return form.startsWith('bolje ') || form.startsWith('najbolje ');
}

/**
 * Derive all applicable forms from an adverb.
 */
export function deriveFromAdverb(ctx: DeriveContext): DerivationResult[] {
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

  if (upos !== 'ADV') {
    return [];
  }

  // Don't derive from superlatives
  if (feats.Degree === 'Sup') {
    return [];
  }

  const positiveForm = transliterate(word.lemma, 'isv-Latn-x-etymolog');

  // If this is a comparative, only derive superlative
  if (feats.Degree === 'Cmp') {
    return deriveSuperlativeFromComparative(positiveForm);
  }

  const results: DerivationResult[] = [];

  // For positive adverbs, we need to get comparison forms
  // The adverb comparison forms come from the adjective paradigm
  // We need to derive the adjective root from the adverb

  // Try to get comparative/superlative from a corresponding adjective
  // Most adverbs ending in -o come from adjectives ending in -y
  // e.g., dobro → dobry, zlo → zly
  const maybeAdjective = deriveAdjectiveFromAdverb(positiveForm);

  if (maybeAdjective) {
    const etymWord = transliterate(maybeAdjective, 'isv-Latn-x-etymolog');
    const { comparison } = declineAdjective(etymWord, '', 'adj.');

    // Derive comparative adverb (synthetic)
    if (comparison.comparative?.[1]) {
      const compAdv = comparison.comparative[1];
      if (compAdv && !isAnalyticalForm(compAdv)) {
        results.push({
          isv: compAdv,
          xpos: 'adv.comp.',
          derivationType: 'advcmp',
        });
      }
    }

    // Derive superlative adverb (synthetic)
    if (comparison.superlative?.[1]) {
      const supAdv = comparison.superlative[1];
      if (supAdv && !supAdv.startsWith('najbolje ')) {
        results.push({
          isv: supAdv,
          xpos: 'adv.sup.',
          derivationType: 'advsup',
        });
      }
    }
  }

  // Always produce analytical superlative as well
  // e.g., dobro → najdobro
  const analyticalSup = createAnalyticalSuperlative(positiveForm);
  results.push({
    isv: analyticalSup,
    xpos: 'adv.sup.',
    derivationType: 'advsupn',
  });

  return filterValidResults(results);
}

/**
 * Try to derive the adjective form from an adverb.
 * Most adverbs in -o come from adjectives in -y.
 */
function deriveAdjectiveFromAdverb(adverb: string): string | undefined {
  const norm = transliterate(adverb, 'isv-Latn-x-etymolog');
  // Common pattern: -o → -y (dobro → dobry)
  if (norm.endsWith('o')) {
    return norm.slice(0, -1) + 'y';
  }

  // Pattern: -i → -y or -i (moćni → moćny, bezpokojęći → bezpokojęći, seksi → seksi)
  if (norm.endsWith('i')) {
    return norm.endsWith('ći') || norm.endsWith('si') || norm.endsWith('śi')
      ? norm
      : norm.slice(0, -1) + 'y';
  }

  // Pattern: -ě → -y (dobrě → dobry) - alternative form
  if (norm.endsWith('ě')) {
    return norm.slice(0, -1) + 'y';
  }

  // Pattern: -e → -y or -i (doble → dobly, svěže → svěži, sekśe → sekśi)
  if (norm.endsWith('e')) {
    return norm.endsWith('śe') || norm.endsWith('se')
      ? norm.slice(0, -1) + 'i'
      : norm.slice(0, -1) + 'y';
  }

  return undefined;
}

/**
 * Derive superlative from a comparative adverb.
 *
 * @param comparativeForm - The comparative form (e.g., "bolje")
 */
function deriveSuperlativeFromComparative(
  comparativeForm: string,
): DerivationResult[] {
  const results: DerivationResult[] = [];

  // Synthetic superlative: naj + comparative
  // bolje → najbolje
  const etym = transliterate(comparativeForm, 'isv-Latn-x-etymolog');
  const syntheticSup = `naj${etym}`;
  results.push({
    isv: syntheticSup,
    xpos: 'adv.sup.',
    derivationType: 'advsup',
  });

  return filterValidResults(results);
}
