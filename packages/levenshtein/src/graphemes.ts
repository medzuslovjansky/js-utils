/** Digraphs treated as a single grapheme during segmentation. */
export const DIGRAPHS = ['dž'] as const;

/**
 * Split a normalized word into graphemes: longest digraph match first,
 * otherwise one Unicode code point.
 */
export function graphemes(word: string): string[] {
  const result: string[] = [];
  let i = 0;
  while (i < word.length) {
    const digraph = DIGRAPHS.find((d) => word.startsWith(d, i));
    if (digraph === undefined) {
      const char = String.fromCodePoint(word.codePointAt(i)!);
      result.push(char);
      i += char.length;
    } else {
      result.push(digraph);
      i += digraph.length;
    }
  }
  return result;
}
