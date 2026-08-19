/**
 * Steenbergen lemma splitting.
 *
 * Splits a cell value containing multiple lemmas separated by commas or semicolons.
 * Handles annotations in parentheses correctly.
 */

import { parseSteenLemma, type SteenLemma } from './parse-lemma.ts';

export function splitSteenLemmas(str: string): SteenLemma[] {
  const annotations = str.includes('(')
    ? new AnnotationHelper()
    : AnnotationHelper.noop;

  const lemmaString = annotations.stash(str.trim());
  const lemmas =
    lemmaString.length > 0
      ? lemmaString
          .split(lemmaString.includes(';') ? ';' : ',')
          .filter(Boolean)
          .flatMap((value) => [
            ...parseSteenLemma(annotations.unstash(value.trim())),
          ])
      : [];

  return lemmas;
}

class AnnotationHelper {
  #map = new Map<string, string>();

  stash(str: string): string {
    let index = 0;
    return str.replaceAll(/\((\(*(?:[^()]*|\([^)]*\))*\)*)\)/g, (_0, match) => {
      const key = `ANNOTATION_${index++}`;
      this.#map.set(key, `(${match})`);
      return key;
    });
  }

  unstash(str: string): string {
    return str.replaceAll(/(ANNOTATION_\d+)/g, (_0: unknown, match: string) => {
      return this.#map.get(match) ?? '';
    });
  }

  static noop = {
    stash: (str: string) => str,
    unstash: (str: string) => str,
  };
}
