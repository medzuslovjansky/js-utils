import type * as FeaturesPOS from './features-pos.ts';
import type { UPOS } from './upos.ts';

export * as Features from './features-atomic.ts';
export type { UPOS } from './upos.ts';

export interface POSFeaturesMap {
  ADJ: FeaturesPOS.Adjective;
  NOUN: FeaturesPOS.Noun;
  ADV: FeaturesPOS.Adverb;
  VERB: FeaturesPOS.Verb;
  AUX: FeaturesPOS.Verb;
  PRON: FeaturesPOS.Pronoun;
  DET: FeaturesPOS.Pronoun;
  NUM: FeaturesPOS.Numeral;
  PROPN: FeaturesPOS.Noun;
  ADP: FeaturesPOS.Base;
  CCONJ: FeaturesPOS.Base;
  INTJ: FeaturesPOS.Base;
  PART: FeaturesPOS.Base;
  PUNCT: FeaturesPOS.Base;
  SCONJ: FeaturesPOS.Base;
  SYM: FeaturesPOS.Base;
  X: FeaturesPOS.Base;
}

export type POSFeatures = {
  [K in UPOS]: POSFeaturesMap[K];
};

export type XPOS = string;

export interface Token<POS extends UPOS = UPOS> {
  id?: number;
  form: string;
  /** Lemma (dictionary form). Undefined means unresolved. */
  lemma?: string;
  upos?: POS;
  xpos?: XPOS;
  feats?: POSFeatures[POS];
  head?: number;
  deprel?: string;
  deps?: Array<{ head: number; deprel: string }>;
  misc?: Record<string, string>;
}

export type TokenFeatures = FeaturesPOS.Any;

/**
 * Minimal result from adapters - only what they actually generate.
 * Higher-level code (adaptWord/inflect) composes full Token objects.
 */
export type AdapterResult<POS extends UPOS = UPOS> = Array<{
  form: string;
  upos: POS;
  feats: POSFeatures[POS];
}>;
