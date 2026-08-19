/**
 * One named transliteration step. A language pipeline is an ordered array of steps,
 * which makes every step enumerable, individually testable and coverable by fixtures.
 */
export type Step = {
  readonly name: string;
  readonly apply: (word: string) => string;
};

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Simultaneous multi-key replacement: one left-to-right pass, longest key wins,
 * replaced output is never rescanned (so e.g. `{ch: 'h', h: 'g'}` is safe in one map).
 */
export function mapStep(
  name: string,
  table: Readonly<Record<string, string>>,
): Step {
  const pattern = Object.keys(table)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|');
  const re = new RegExp(pattern, 'g');
  return { name, apply: (word) => word.replace(re, (match) => table[match]!) };
}

/** Contextual rule; lookahead/lookbehind welcome. */
export function regexStep(name: string, re: RegExp, replacement: string): Step {
  return { name, apply: (word) => word.replace(re, replacement) };
}
