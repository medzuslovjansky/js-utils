import { formatTokenAsConllu } from '@interslavic/conllu';
import type { Token, XPOS } from '@interslavic/conllu';

import { etymologify } from '../etymologify.ts';
import { patch } from '../patch.ts';
import { inflectWord } from '../inflect/inflect-word.ts';

/**
 * Replays the entry point of the abandoned `feat/conllu-fy` branch on top of the
 * current pipeline, so its 138 snapshots stay usable as a regression net.
 *
 * The branch had a single `conllufy(word, xpos, { id, irregular })`; here the
 * same three steps are spelled out, since normalize.ts drives them from a full
 * Steenbergen record rather than from a bare word.
 */
export function conllufy(
  word: string,
  xpos: XPOS,
  irregular?: string,
): Token[] {
  const [lemma, effectiveXpos] = patch(etymologify(word).trim(), xpos);
  return inflectWord(lemma, effectiveXpos, lemma, irregular);
}

/**
 * The branch's `formatTokensAsConllu` — FORM, LEMMA, UPOS, XPOS, FEATS and
 * nothing else. Dropping ID and the columns that are always `_` is what makes
 * a paradigm diff readable. It lived in `@interslavic/conllu` as
 * `formatTokensAsConlluLegacy` until it turned out this was its only caller.
 */
export function conllufyToString(
  word: string,
  xpos: XPOS,
  irregular?: string,
): string {
  return conllufy(word, xpos, irregular)
    .map((token) =>
      formatTokenAsConllu(token).split('\t').slice(1, 6).join('\t'),
    )
    .join('\n');
}
