import {
  _getDeclensionAdjectiveFlat,
  SteenAdjectiveParadigm,
} from '../adjective';
import { _getDeclensionNounFlat, SteenNounParadigm } from '../noun';
import { _getDeclensionPronounFlat, SteenPronounParadigm } from '../pronoun';
import { _getConjugationVerbFlat, SteenVerbParadigm } from '../verb';

/**
 * If you already have something like _getDeclensionAdjectiveFlat, use that.
 * Otherwise, here's a dummy placeholder that simply gathers values from
 * 'actual' in a consistent manner.
 */
export function flattenAdjectiveOutput(
  paradigm: SteenAdjectiveParadigm,
): string[] {
  // If you already have `_getDeclensionAdjectiveFlat(actual)`,
  // you can just return that result here.
  return _getDeclensionAdjectiveFlat({
    ...paradigm,
    short: undefined,
    comparison: {
      positive: [],
      comparative: [],
      superlative: [],
    },
  });
}

export function extractAdjective(lemmas: string[]): string[] {
  const [adj] = lemmas;
  const words = adj.split(' ');
  if (words.length === 1) {
    return lemmas;
  }

  let index = words.findIndex(looksLikeAdjective);
  if (index === -1) {
    index = 0;
  }

  return lemmas.map((lemma) => lemma.split(' ')[index]);
}

const LOOKS_LIKE_ADJECTIVE = /[yij]$/;

function looksLikeAdjective(word: string) {
  return LOOKS_LIKE_ADJECTIVE.test(word);
}

/**
 * Flatten the noun declension output into a single array of string forms.
 */
export function flattenNounOutput(paradigm: SteenNounParadigm): string[] {
  return _getDeclensionNounFlat(paradigm);
}

/**
 * Flatten pronoun declension output into a single array of forms.
 */
export function flattenPronounOutput(paradigm: SteenPronounParadigm): string[] {
  return _getDeclensionPronounFlat(paradigm);
}

/**
 * Flatten verb conjugation output into a single array of forms.
 */
export function flattenVerbOutput(paradigm: SteenVerbParadigm): string[] {
  return _getConjugationVerbFlat(paradigm);
}
