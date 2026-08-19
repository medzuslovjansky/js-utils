import type { Token } from './schema.ts';

// An empty value would print a bare `Key=`, which is not a legal MISC entry.
function formatMisc(misc?: Record<string, string>): string {
  const pairs = Object.entries(misc ?? {})
    .filter(([, value]) => value !== '')
    .map(([key, value]) => `${key}=${value}`);

  return pairs.length > 0 ? pairs.join('|') : '_';
}

function formatDeps(deps?: Array<{ head: number; deprel: string }>): string {
  if (!deps?.length) return '_';

  return [...deps]
    .sort((a, b) => a.head - b.head)
    .map((dep) => `${dep.head}:${dep.deprel}`)
    .join('|');
}

// A feature bundle spread from optional properties can carry explicit
// `undefined`s; those are absent features, not features with no value.
function formatFeats(feats?: Record<string, unknown>): string {
  const pairs = Object.entries(feats ?? {})
    .filter(([, value]) => value != null)
    .map(([key, value]) => `${key}=${value}`)
    .sort();

  return pairs.length > 0 ? pairs.join('|') : '_';
}

export function formatTokens(token: Token, id?: number): string;
export function formatTokens(tokens: Token[]): string;
export function formatTokens(tokens: Token | Token[], id?: number): string {
  if (Array.isArray(tokens)) {
    return tokens
      .map((token, index) => formatTokenAsConllu(token, index + 1))
      .join('\n');
  }
  return formatTokenAsConllu(tokens, id);
}

export const formatTokenAsConllu = (token: Token, id?: number): string => {
  const parts: string[] = [];

  parts.push(String(token.id ?? id ?? '_'));
  parts.push(token.form);
  parts.push(token.lemma ?? '_');
  parts.push(token.upos ?? 'X');
  parts.push(token.xpos ?? '_');
  // Interfaces have no index signature, so the structural cast is unavoidable.
  parts.push(formatFeats(token.feats as Record<string, unknown>));
  parts.push(token.head !== undefined ? String(token.head) : '_');
  parts.push(token.deprel ?? '_');
  parts.push(formatDeps(token.deps));
  parts.push(formatMisc(token.misc));

  return parts.join('\t');
};
