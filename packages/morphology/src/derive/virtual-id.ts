/**
 * Short canonical derivation identifiers for CoNLL-U misc.Derivation.
 */
export type DerivationCode =
  // Verb derivations
  | 'v_prap' // Present active participle (dělajųći)
  | 'v_prpp' // Present passive participle (dělajemy)
  | 'v_pfap' // Past active participle (sdělavši)
  | 'v_pfpp' // Past passive participle (dělany)
  | 'v_noun' // Verbal noun (dělanje)
  // Adjective derivations
  | 'adj_cmp' // Comparative adjective, synthetic (dobrějši)
  | 'adj_sup' // Superlative adjective, synthetic (najdobrějši)
  | 'adj_sup_a' // Superlative adjective, analytical (najdobry)
  | 'adj_adv' // Adverb positive (dobro)
  // Adverb derivations
  | 'adv_cmp' // Comparative adverb, synthetic (bolje)
  | 'adv_sup' // Superlative adverb, synthetic (najbolje)
  | 'adv_sup_a' // Superlative adverb, analytical (najdobro)
  // General word formation
  | string;

export type DerivationType =
  | 'prap'
  | 'prpp'
  | 'pfap'
  | 'pfpp'
  | 'vnoun'
  | 'adjcmp'
  | 'adjsup'
  | 'adjsupn'
  | 'advpos'
  | 'advcmp'
  | 'advsup'
  | 'advsupn';

export const DERIVATION_MAP: Record<
  string,
  { code: DerivationCode; sidSuffix: string }
> = {
  prap: { code: 'v_prap', sidSuffix: 'prap' },
  prpp: { code: 'v_prpp', sidSuffix: 'prpp' },
  pfap: { code: 'v_pfap', sidSuffix: 'pfap' },
  pfpp: { code: 'v_pfpp', sidSuffix: 'pfpp' },
  vnoun: { code: 'v_noun', sidSuffix: 'vnoun' },
  adjcmp: { code: 'adj_cmp', sidSuffix: 'adjcmp' },
  adjsup: { code: 'adj_sup', sidSuffix: 'adjsup' },
  adjsupn: { code: 'adj_sup_a', sidSuffix: 'adjsupn' },
  advpos: { code: 'adj_adv', sidSuffix: 'advpos' },
  advcmp: { code: 'adv_cmp', sidSuffix: 'advcmp' },
  advsup: { code: 'adv_sup', sidSuffix: 'advsup' },
  advsupn: { code: 'adv_sup_a', sidSuffix: 'advsupn' },
};

export const DERIVATION_TYPES = new Set<string>(Object.keys(DERIVATION_MAP));

export interface ParsedVirtualId {
  baseLuid: string;
  derivationType?: DerivationType;
}

export function createDerivedId(
  baseLuid: string,
  derivationType: DerivationType,
): string {
  return `${baseLuid}-${derivationType}`;
}

export function parseVirtualId(id: string): ParsedVirtualId {
  const lastDash = id.lastIndexOf('-');
  if (lastDash === -1) return { baseLuid: id };

  const potentialType = id.slice(lastDash + 1);
  if (DERIVATION_TYPES.has(potentialType)) {
    return {
      baseLuid: id.slice(0, lastDash),
      derivationType: potentialType as DerivationType,
    };
  }

  return { baseLuid: id };
}

export function isDerivedId(id: string): boolean {
  return parseVirtualId(id).derivationType !== undefined;
}
