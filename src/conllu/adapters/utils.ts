/**
 * Normalize form: handle alternatives (split by / or ,) and remove parentheses
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
