import { IdentifiableString, Token, XPOS } from './schema';
import { adaptWord } from './adapters';
import { normalize } from './normalize';

export interface WordDetails {
  id?: number;
  irregular?: string;
}

export function conllufy(
  word: string,
  xpos: XPOS,
  details?: WordDetails,
): Token[] {
  const normalized = normalize(word, xpos);
  const canonicalWord = normalized.word;
  const effectiveXpos = normalized.xpos;

  const lemma: IdentifiableString = {
    uri: details?.id != null ? `steen:${details.id}` : undefined,
    value: canonicalWord,
  };

  return adaptWord(canonicalWord, effectiveXpos, lemma, details?.irregular);
}
