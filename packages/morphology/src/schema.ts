import type {
  Misc,
  Token,
  TokenFeatures,
  UPOS,
  XPOS,
} from '@interslavic/conllu';

/**
 * Word represents a single word in a lemma.
 * Each word can have its own inflections (if inflectable).
 */
export interface Word {
  /** Word form */
  form: string;
  /** Lemma (dictionary form). Undefined means unresolved. */
  lemma?: string;
  /** Universal POS tag. Undefined means unresolved. */
  upos?: UPOS;
  /** Morphological features */
  feats?: TokenFeatures;
  /** Inflected forms. forms[0] is the citation form with full features. */
  inflections?: Token[];
  /** Miscellaneous info (SID, SpaceAfter, etc.) */
  misc?: Misc;
}

export interface Lemma {
  xpos: XPOS;
  paradigms?: string[];
  /** Words in this lemma. Each can have inflections. */
  words: Word[];
  annotation?: string;
  misc?: Misc;
}
