import { parsePos } from '../partOfSpeech/index.ts';
import type { AdapterResult, Token, XPOS } from '@interslavic/conllu';
import { etymologify } from '../etymologify.ts';
import { parseXPos } from '../steen/index.ts';
import {
  inflectAdjective,
  inflectNoun,
  inflectNumeral,
  inflectPronoun,
  inflectVerb,
} from './index.ts';
import { inflectHardcoded } from './hardcoded.ts';

function composeTokens(
  results: AdapterResult,
  lemma: string,
  xpos: XPOS,
  misc?: Record<string, string>,
): Token[] {
  return results.map((result) => ({
    form: etymologify(result.form),
    lemma,
    upos: result.upos,
    xpos,
    feats: result.feats,
    // A copy per token: one shared object would let a consumer annotating one
    // form of the paradigm annotate all the others behind its back. What the
    // adapter has to say comes first, so a caller can override it.
    misc: misc || result.misc ? { ...result.misc, ...misc } : undefined,
  }));
}

export function inflectWord(
  word: string,
  xpos: XPOS,
  lemma: string,
  irregular?: string,
  misc?: Record<string, string>,
): Token[] {
  if (!word || typeof word !== 'string' || word.includes(' ')) {
    return [];
  }

  const variants = parseXPos(word, xpos);
  const primaryUpos = variants[0]?.[0];

  const hardcoded = inflectHardcoded(word, xpos);
  if (hardcoded.length > 0) {
    return composeTokens(hardcoded, lemma, xpos, misc);
  }

  let results: AdapterResult;

  switch (primaryUpos) {
    case 'NOUN':
    case 'PROPN': {
      const posInfo = parsePos(xpos);
      if (posInfo.name === 'numeral') {
        results = inflectNumeral(word, xpos);
      } else {
        results = inflectNoun(word, xpos, irregular);
      }
      break;
    }

    case 'ADJ': {
      const posInfo = parsePos(xpos);
      if (posInfo.name === 'numeral') {
        results = inflectNumeral(word, xpos);
      } else {
        results = inflectAdjective(word, xpos);
      }
      break;
    }

    case 'PRON':
    case 'DET':
      results = inflectPronoun(word, xpos);
      break;

    case 'NUM':
      results = inflectNumeral(word, xpos);
      break;

    case 'VERB':
    case 'AUX': {
      if (
        xpos.includes('prap') ||
        xpos.includes('prpp') ||
        xpos.includes('pfap') ||
        xpos.includes('pfpp') ||
        xpos.includes('part')
      ) {
        results = inflectAdjective(word, xpos);
      } else {
        results = inflectVerb(word, xpos, irregular);
      }
      break;
    }

    default:
      results = variants.flatMap(([upos, feats]) => [
        {
          form: word,
          upos,
          feats,
        },
      ]);
  }

  return composeTokens(results, lemma, xpos, misc);
}
