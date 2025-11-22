import * as Features from './features';

// Re-export all feature types from features module for backward compatibility
export * as Features from './features';

// --- POS Features ---

/**
 * Adjective features.
 * Morphological features specific to adjectives.
 */
export interface AdjectiveFeatures {
  Analyt?: Features.Analyt;
  Animacy?: Features.Animacy;
  Case?: Features.Case;
  Degree?: Features.Degree;
  Gender?: Features.Gender;
  Number?: Features.Number;
  Polarity?: Features.Polarity;
  Poss?: Features.Poss;
  Uninflect?: Features.Uninflect;
  Variant?: Features.Variant;
}

/**
 * Noun features.
 * Morphological features specific to nouns.
 */
export interface NounFeatures {
  Animacy?: Features.Animacy;
  Case?: Features.Case;
  Gender?: Features.Gender;
  Number?: Features.Number;
  Uninflect?: Features.Uninflect;
  VerbForm?: Features.VerbForm;
}

/**
 * Adverb features.
 * Morphological features specific to adverbs.
 */
export interface AdverbFeatures {
  Degree?: Features.Degree;
  Polarity?: Features.Polarity;
}

/**
 * Verb features.
 * Morphological features specific to verbs.
 */
export interface VerbFeatures {
  Aspect?: Features.Aspect;
  Mood?: Features.Mood;
  Number?: Features.Number;
  Person?: Features.Person;
  Polarity?: Features.Polarity;
  Tense?: Features.Tense;
  VerbForm?: Features.VerbForm;
  Voice?: Features.Voice;
}

/**
 * Pronoun features.
 * Morphological features specific to pronouns.
 */
export interface PronounFeatures {
  Animacy?: Features.Animacy;
  Case?: Features.Case;
  Gender?: Features.Gender;
  Number?: Features.Number;
  Person?: Features.Person;
  Polarity?: Features.Polarity;
  Poss?: Features.Poss;
  PronType?: Features.PronType;
  Reflex?: Features.Reflex;
  Variant?: Features.Variant;
  'Gender[psor]'?: Features.PossessorGender;
  'Number[psor]'?: Features.PossessorNumber;
}

/**
 * Numeral features.
 * Morphological features specific to numerals.
 */
export interface NumeralFeatures {
  Case?: Features.Case;
  Gender?: Features.Gender;
  Number?: Features.Number;
  NumType?: Features.NumType;
}

/**
 * Combined features type.
 * Union of all feature types for different parts of speech.
 */
export type TokenFeatures = AdjectiveFeatures &
  NounFeatures &
  AdverbFeatures &
  VerbFeatures &
  PronounFeatures &
  NumeralFeatures & {
    Style?: Features.Style;
    Typo?: Features.Typo;
  };

/**
 * Universal Part-of-Speech (UPOS) tags as defined in Universal Dependencies v2.
 * These tags are used to annotate linguistic data and support applications in NLP,
 * including parsing, tagging, and machine translation.
 *
 * - Open classes (e.g., NOUN, VERB, ADJ) regularly accept new words and evolve.
 * - Closed classes (e.g., AUX, DET, SCONJ) are more static and rarely change.
 *
 * @see https://universaldependencies.org/u/pos/
 */
export type UPOS =
  /**
   * Adjective (open class)
   * Note: Adjectives are words that typically modify nouns and specify their properties or attributes.
   * @example `veliky` (big), `stary` (old), `devety` (ninth)
   */
  | 'ADJ'
  /**
   * Adposition (closed class)
   * Note: Pre/post/circumpositions; typically express spatial/temporal relations
   * @example `v` (in), `na` (on), `pri` (near)
   */
  | 'ADP'
  /**
   * Adverb (open class)
   * Note: Modifies verbs, adjectives, other adverbs, or clauses
   * @example `dobro` (well), `brzo` (quickly), `mnogo` (much)
   */
  | 'ADV'
  /**
   * Auxiliary (closed class)
   * Note: Function words expressing grammatical categories like tense, mood, aspect
   * @example `by` (would), `sųt` (are)
   */
  | 'AUX'
  /**
   * Coordinating conjunction (closed class)
   * Note: Links words, phrases, clauses of equal status/importance
   * @example `i` (and), `a` (but), `ili` (or)
   */
  | 'CCONJ'
  /**
   * Determiner (closed class)
   * Note: Nominal modifiers expressing reference, quantity, possession
   * @example `tȯj` (this/that), `vsaky` (every), `kaky` (which)
   */
  | 'DET'
  /**
   * Interjection (open class)
   * Note: Exclamations and other isolated words
   * @example `ah` (ah), `oj` (oh), `hej` (hey)
   */
  | 'INTJ'
  /**
   * Noun (open class)
   * Note: Words denoting concrete/abstract entities
   * @example `trava` (grass), `lěto` (summer), `nož` (knife)
   */
  | 'NOUN'
  /**
   * Numeral (closed class)
   * Note: Numbers, numerals in different formats
   * @example `jedin`, `dvadesęť`, `100`
   */
  | 'NUM'
  /**
   * Particle (closed class)
   * Note: Function words associated with another word/phrase
   * @example `li` (whether), `ne` (not), `nehaj` (let)
   */
  | 'PART'
  /**
   * Pronoun (closed class)
   * Note: Words substituting for nouns or noun phrases
   * @example `vy` (you), `sebe` (yourself), `někto` (someone), `vsečto` (everything)
   */
  | 'PRON'
  /**
   * Proper noun (open class)
   * Note: Names of individuals, companies, places, organizations
   * @example `Praga` (Prague), `Ivan` (Ivan), `Atlantida` (Atlantis)
   */
  | 'PROPN'
  /**
   * Punctuation (other)
   * Note: Non-alphabetical characters used as delimiters
   * @example `.`, `,`, `(`, `)`, `"`
   */
  | 'PUNCT'
  /**
   * Subordinating conjunction (closed class)
   * Note: Links clauses where one is subordinate to the other
   * @example `ako` (if), `kȯgda` (when), `že` (that)
   */
  | 'SCONJ'
  /**
   * Symbol (other)
   * Note: Non-linguistic symbols with special meanings
   * @example `$`, `%`, `§`, `©`
   */
  | 'SYM'
  /**
   * Verb (open class)
   * Note: Words denoting actions, processes, states
   * @example `viděti` (to see), `viděny` (seen), `vidimy` (visible)
   */
  | 'VERB'
  /**
   * Other
   * Note: Used for unclassified words and symbols
   */
  | 'X';

/**
 * Language-specific Part-of-Speech (XPOS) tag.
 * Format: matches regex /^([a-z]+\.?\/?\s*)*$/
 */
export type XPOS = string;

/**
 * Identifiable string with optional URI.
 */
export interface IdentifiableString {
  uri?: string;
  value: string;
}

/**
 * CONLL-U token structure.
 */
export interface Token {
  token: string;
  upos?: UPOS;
  xpos?: XPOS;
  lemma: IdentifiableString;
  feats?: TokenFeatures;
}
