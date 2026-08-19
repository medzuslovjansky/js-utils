/** Exact-string transliteration precedent; `covers` names the pipeline step it exercises. */
export type TranslitCase = { in: string; out: string; covers: string };

/**
 * Metric invariant: d(isv, other) must satisfy the given bounds.
 * Never exact numbers — weights get tuned.
 */
export type MetricCase = {
  isv: string;
  other: string;
  max?: number;
  min?: number;
};

export type LangFixtures = {
  translit: readonly TranslitCase[];
  metric: readonly MetricCase[];
};

/** Shared bounds for metric cases: cognates stay under LOW, unrelated words above HIGH. */
export const THRESHOLDS = { LOW: 0.35, HIGH: 0.65 } as const;
