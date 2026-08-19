import { graphemes } from './graphemes.ts';
import { LANGS, normalize, type NormalizeLang } from './normalize/index.ts';
import {
  weightedLevenshtein,
  weightedLevenshteinWithAlignment,
} from './weightedLevenshtein.ts';
import type { DistanceDetails, DistanceOptions } from './types.ts';

const ALL_LANGS = ['isv', ...LANGS] as const;

function isLang(val: unknown): val is NormalizeLang {
  return (
    typeof val === 'string' && (ALL_LANGS as readonly string[]).includes(val)
  );
}

export function distance(
  wordA: string,
  langA: NormalizeLang,
  wordB: string,
  langB?: NormalizeLang,
  options?: DistanceOptions & { details?: false },
): number;
export function distance(
  wordA: string,
  langA: NormalizeLang,
  wordB: string,
  langB: NormalizeLang | undefined,
  options: DistanceOptions & { details: true },
): DistanceDetails;
export function distance(
  wordA: string,
  langA: NormalizeLang,
  wordB: string,
  options: DistanceOptions & { details: true },
): DistanceDetails;
export function distance(
  wordA: string,
  langA: NormalizeLang,
  wordB: string,
  langBOrOptions?: NormalizeLang | DistanceOptions,
  options?: DistanceOptions,
): number | DistanceDetails;
export function distance(
  wordA: string,
  langA: NormalizeLang,
  wordB: string,
  langBOrOptions: NormalizeLang | DistanceOptions = 'isv',
  options?: DistanceOptions,
): number | DistanceDetails {
  let langB: NormalizeLang;
  let opts: DistanceOptions | undefined;

  if (typeof langBOrOptions === 'object' && langBOrOptions !== null) {
    langB = 'isv';
    opts = langBOrOptions;
  } else {
    langB = langBOrOptions;
    opts = options;
  }

  if (!isLang(langA)) {
    throw new RangeError(
      `Unsupported language "${langA}"; expected one of: ${ALL_LANGS.join(', ')}`,
    );
  }
  if (!isLang(langB)) {
    throw new RangeError(
      `Unsupported language "${langB}"; expected one of: ${ALL_LANGS.join(', ')}`,
    );
  }

  const a = graphemes(normalize(wordA, langA));
  const b = graphemes(normalize(wordB, langB));
  const denom = (a.length + b.length) / 2;

  if (!opts?.details) {
    if (a.length === 0 && b.length === 0) return 0;
    if (a.length === 0 || b.length === 0) return 1;
    return weightedLevenshtein(a, b) / denom;
  }

  if (a.length === 0 && b.length === 0) {
    return {
      distance: 0,
      rawCost: 0,
      graphemesA: a,
      graphemesB: b,
      alignment: [],
    };
  }

  if (a.length === 0) {
    return {
      distance: 1,
      rawCost: b.length,
      graphemesA: a,
      graphemesB: b,
      alignment: b.map((char) => ({ b: char, op: 'insert', cost: 1 })),
    };
  }

  if (b.length === 0) {
    return {
      distance: 1,
      rawCost: a.length,
      graphemesA: a,
      graphemesB: b,
      alignment: a.map((char) => ({ a: char, op: 'delete', cost: 1 })),
    };
  }

  const { rawCost, alignment } = weightedLevenshteinWithAlignment(a, b);
  return {
    distance: rawCost / denom,
    rawCost,
    graphemesA: a,
    graphemesB: b,
    alignment,
  };
}
