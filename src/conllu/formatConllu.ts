import { Token } from './schema';

/**
 * Format a token as a CONLLU line
 * Format: token	lemma	upos	xpos	features
 * Where features are pipe-separated key=value pairs
 */
export function formatTokenAsConllu(token: Token): string {
  const parts: string[] = [];

  // Token (word form)
  parts.push(token.token);

  // Lemma (value only, not URI)
  parts.push(token.lemma.value);

  // UPOS
  parts.push(token.upos || '_');

  // XPOS
  parts.push(token.xpos || '_');

  // TokenFeatures (pipe-separated key=value pairs)
  if (token.feats && Object.keys(token.feats).length > 0) {
    const featPairs = Object.entries(token.feats)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${value}`)
      .sort(); // Sort for consistent output
    parts.push(featPairs.join('|'));
  } else {
    parts.push('_');
  }

  return parts.join('\t');
}

/**
 * Format multiple tokens as CONLLU lines (one per line)
 */
export function formatTokensAsConllu(tokens: Token[]): string {
  return tokens.map(formatTokenAsConllu).join('\n');
}
