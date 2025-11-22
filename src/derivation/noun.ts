import { DerivedLemma } from './types';

/**
 * Derives new lemmas from a noun.
 */
export function deriveFromNoun(lemma: string, xpos: string): DerivedLemma[] {
  const derived: DerivedLemma[] = [];

  // 1. Feminitive: m.anim. -ik -> f. -ica
  // e.g. radnik -> radnica
  if (xpos.includes('m.') && xpos.includes('anim.')) {
    if (lemma.endsWith('ik')) {
      const stem = lemma.slice(0, -2); // remove 'ik'
      const femLemma = stem + 'ica';

      derived.push({
        lemma: femLemma,
        xpos: 'f.', // Basic XPOS for the derived noun
        derivation: 'sfx:ica',
      });
    }

    // Amerikanec - Amerikanka
    if (lemma.endsWith('ėc')) {
      const stem = lemma.slice(0, -2); // remove 'ėc'
      const femLemma = stem + 'ka';

      derived.push({
        lemma: femLemma,
        xpos: 'f.', // Basic XPOS for the derived noun
        derivation: 'sfx:ka',
      });
    }
  }

  return derived;
}
