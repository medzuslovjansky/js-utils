/**
 * Infer paradigm information from Interslavic word data.
 *
 * Extracts paradigm hints from the "addition" column in Steenbergen format.
 */

export function inferParadigms(rawAddition?: string): string[] | undefined {
  if (!rawAddition) return;

  // `(+2)` is a preposition's case government, not a paradigm — but it can sit
  // next to one that is: `podležati (podleži) (+3)`.
  const addition = rawAddition
    .replaceAll('#', '')
    .replace(/\(\+\d+\)/g, '')
    .trim();

  return addition ? [addition] : undefined;
}
