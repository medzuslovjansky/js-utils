/**
 * Steenbergen lemma parsing.
 *
 * Parses lemmas in Jan van Steenbergen's format where:
 * - Lemmas can have annotations in parentheses: "word (annotation)"
 * - Variants can be expressed with slashes: "do/k" → "do", "k"
 */

const trim = (str: string): string => str.trim();

/**
 * A parsed lemma from Steenbergen format.
 * NOT the same as schema.ts Lemma (which represents a full dictionary entry).
 */
export interface SteenLemma {
  value: string;
  annotation?: string;
}

export function* parseSteenLemma(rawStr: string): Generator<SteenLemma> {
  const str = trim(rawStr);
  const leftN = str.lastIndexOf('(');
  const rightN = str.lastIndexOf(')');

  let value: string;
  let annotation: string | undefined;

  if (rightN < leftN || (leftN === -1 && rightN !== -1)) {
    value = str;
  } else if (rightN === str.length - 1) {
    value = str.slice(0, leftN).trimEnd();
    const annotationContent = str.slice(leftN + 1, rightN).trim();
    annotation = annotationContent || undefined;
  } else {
    value = str;
    annotation = undefined;
  }

  // Normalize spaced slashes: "будзе / будуць" → "будзе/будуць"
  const normalized = value.replace(/\s*\/\s*/g, '/');
  const parts = normalized.split(/\s+/);
  for (const expandedValue of expandVariants(parts)) {
    yield { value: expandedValue, annotation };
  }
}

function* expandVariants(parts: string[]): Generator<string> {
  const [head, ...tail] = parts;
  const options = head.includes('/')
    ? head
        .split('/')
        .map((s) => s.trim())
        .filter(Boolean)
    : [head];

  if (tail.length === 0) {
    yield* options;
    return;
  }

  for (const option of options) {
    for (const tailVariant of expandVariants(tail)) {
      yield `${option} ${tailVariant}`;
    }
  }
}
