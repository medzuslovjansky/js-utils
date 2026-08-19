import type { AdapterResult, TokenFeatures, UPOS } from '@interslavic/conllu';
// Straight at the module, not the barrel: interslavic/index.ts pulls in inflect,
// which imports this file back — a cycle CJS resolves to an empty object.
import { parseXPos } from '../../steen/parse-xpos.ts';

type Form = {
  token: string;
  feats: TokenFeatures;
};

type Paradigm = {
  forms?: Form[];
  upos: UPOS;
  feats?: TokenFeatures;
};

export type HardcodedParadigms = Record<string, Paradigm>;

/**
 * A lemma with a hand-written paradigm answers for itself and nothing else.
 * Which dictionary entry is a form of which lemma is stated in `patches.ts`,
 * not worked out here: a lookup that resolves `jemu` to `on` only while no
 * other paradigm happens to contain `jemu` changes its answer whenever a table
 * is edited, and does it silently.
 */
export function createHardcodedLookup(
  paradigms: HardcodedParadigms,
): (word: string, xpos: string) => AdapterResult {
  return (word: string, xpos: string): AdapterResult => {
    const paradigm = paradigms[word];
    if (!paradigm) {
      return [];
    }

    const variants = parseXPos(word, xpos);

    const matchingVariant = variants.find(([upos]) => upos === paradigm.upos);
    if (!matchingVariant) {
      return [];
    }

    const baseFeats = matchingVariant[1];
    const results: AdapterResult = [];

    for (const form of paradigm.forms ?? [{ token: word, feats: {} }]) {
      results.push({
        form: form.token,
        upos: paradigm.upos,
        feats: {
          ...baseFeats,
          ...paradigm.feats,
          ...form.feats,
        },
      });
    }

    return results;
  };
}
