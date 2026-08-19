/**
 * Every tunable number of the metric lives in this file. Change values here —
 * the logic never needs to be touched. Starting values are placeholders.
 */
export const WEIGHTS = {
  /** Same grapheme. */
  identical: 0,
  /** Same letter ± diacritic: c↔č, s↔š, z↔ž, e↔ě. */
  diacriticFold: 0.5,
  /** Vowel reduction: o↔u, i↔y, e↔i, i↔ě. */
  vowelReduction: 0.5,
  /** Voiced↔voiceless: b↔p, d↔t, v↔f, z↔s, g↔k, ž↔š. */
  voicing: 0.5,
  /** Spirantization g↔h (cs/sk/uk) — slightly cheaper than the other bins. */
  ghSpirantization: 0.3,
  /** Any other substitution. */
  substitute: 1,
  /** Insertion or deletion of one grapheme. */
  indel: 1,
} as const;

export type WeightName = keyof typeof WEIGHTS;

/**
 * Phonetic proximity pairs (Pareto bins, not a full matrix). Pairs are explicit and
 * NOT transitively closed: e↔i and i↔y do not imply e↔y — keep the bins honest.
 */
export const PHONETIC_PAIRS: ReadonlyArray<
  readonly [string, string, WeightName]
> = [
  ['c', 'č', 'diacriticFold'],
  ['s', 'š', 'diacriticFold'],
  ['z', 'ž', 'diacriticFold'],
  ['e', 'ě', 'diacriticFold'],
  ['o', 'u', 'vowelReduction'],
  ['i', 'y', 'vowelReduction'],
  ['e', 'i', 'vowelReduction'],
  ['i', 'ě', 'vowelReduction'],
  ['b', 'p', 'voicing'],
  ['d', 't', 'voicing'],
  ['v', 'f', 'voicing'],
  ['z', 's', 'voicing'],
  ['g', 'k', 'voicing'],
  ['ž', 'š', 'voicing'],
  ['g', 'h', 'ghSpirantization'],
];
