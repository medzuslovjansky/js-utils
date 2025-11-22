/**
 * Normalize form: handle alternatives (split by /) and remove parentheses
 */
export function normalizeForm(form: string | null): string[] {
  if (!form) return [];

  const cleaned = form.replace(/\([^)]*\)/g, '').trim();
  if (!cleaned) return [];

  const parts = cleaned
    .split(/[/,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts;
}

/**
 * Check if a word is valid for derivation (no spaces)
 */
export function isValidDerivedWord(w: string): boolean {
  return !w.includes(' ');
}
