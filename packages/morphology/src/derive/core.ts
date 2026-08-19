/**
 * Core derivation logic.
 *
 * Provides the main derive() function and context interfaces for
 * deriving new lexical entries from inflected lemmas.
 */

import type { XPOS } from '@interslavic/conllu';
import type { Lemma } from '../schema.ts';
import type { SteenInput } from '../normalize.ts';
import type { DerivationType } from './virtual-id.ts';
import { createDerivedId } from './virtual-id.ts';

/**
 * Context for derivation - provides all information needed to derive forms.
 */
export interface DeriveContext {
  /** The resolved lemma to derive from */
  lemma: Lemma;
  /** The source entry's LID */
  lid: string;
}

/**
 * A derived input entry ready for processing.
 * Extends SteenInput with the virtual ID.
 */
export interface DerivedInput extends SteenInput {
  /** Virtual ID like "234-prap" */
  id: string;
}

/**
 * Result of a single derivation.
 */
export interface DerivationResult {
  /** The derived form (citation form) */
  isv: string;
  /** The XPOS tag for the derived form */
  xpos: XPOS;
  /** Optional addition/paradigm hints */
  addition?: string;
  /** The derivation type */
  derivationType: DerivationType;
}

export function createDerivedInput(
  result: DerivationResult,
  baseLuid: string,
): DerivedInput {
  return {
    id: createDerivedId(baseLuid, result.derivationType),
    isv: result.isv,
    partOfSpeech: result.xpos,
    addition: result.addition,
  };
}

/**
 * Filter out empty/invalid derivation results.
 */
export function filterValidResults(
  results: DerivationResult[],
): DerivationResult[] {
  return results.filter(
    (r) => r.isv && r.isv.trim() !== '' && r.isv !== '-' && r.isv !== '—',
  );
}

/**
 * Strip a paradigm string down to the citation forms worth deriving from.
 *
 * Parentheses are the tables' way of displaying the gender endings of the same
 * form, so they go; commas separate genuine variants, so they stay and
 * `normalize()` splits them into one lemma each.
 *
 * - "lěpši" → "lěpši"
 * - "lěpši, lučši" → "lěpši, lučši"
 * - "dělajųći (dělajųćá, dělajųćé)" → "dělajųći"
 * - "dělajemy (-a, -o), dělamy (-a, -o)" → "dělajemy, dělamy"
 * - "bolje dobry" → "bolje dobry" (analytical form, keep as-is)
 */

/**
 * Extract analytical superlative form from an adjective/adverb.
 * Simply prepends "naj" to the positive form.
 */
export function createAnalyticalSuperlative(positiveForm: string): string {
  return `naj${positiveForm}`;
}
