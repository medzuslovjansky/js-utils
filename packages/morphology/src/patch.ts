import type { XPOS } from '@interslavic/conllu';
import PATCHES from './patches.ts';

/**
 * Patch result: [lemma, xpos, addition?]
 * If addition is returned, it should override/set the paradigms for deduplication.
 */
export type PatchResult = [string, XPOS, string?];

export function patch(lemma: string, xpos: XPOS): PatchResult {
  for (const entry of PATCHES) {
    const [pWord, pXpos, outLemma, outXpos, outAddition] = entry as [
      string,
      string | null,
      string | null,
      string | null,
      string?,
    ];
    if (pWord === lemma) {
      if (!pXpos || xpos?.includes(pXpos)) {
        return [outLemma || lemma, outXpos || xpos, outAddition];
      }
    }
  }

  return [lemma, xpos, undefined];
}
