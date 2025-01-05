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
export const enum UPOS {
  /**
   * Adjective (open class)
   * Note: Adjectives are words that typically modify nouns and specify their properties or attributes.
   * @example `veliky` (big), `stary` (old), `devety` (ninth)
   */
  Adjective = 'ADJ',

  /**
   * Adposition (closed class)
   * Note: Pre/post/circumpositions; typically express spatial/temporal relations
   * @example `v` (in), `na` (on), `pri` (near)
   */
  Adposition = 'ADP',

  /**
   * Adverb (open class)
   * Note: Modifies verbs, adjectives, other adverbs, or clauses
   * @example `dobro` (well), `brzo` (quickly), `mnogo` (much)
   */
  Adverb = 'ADV',

  /**
   * Auxiliary (closed class)
   * Note: Function words expressing grammatical categories like tense, mood, aspect
   * @example `by` (would), `sųt` (are),
   */
  Auxiliary = 'AUX',

  /**
   * Coordinating conjunction (closed class)
   * Note: Links words, phrases, clauses of equal status/importance
   * @example `i` (and), `a` (but), `ili` (or)
   */
  CoordinatingConjunction = 'CCONJ',

  /**
   * Determiner (closed class)
   * Note: Nominal modifiers expressing reference, quantity, possession
   * @example `tȯj` (this/that), `vsaky` (every), `kaky` (which)
   */
  Determiner = 'DET',

  /**
   * Interjection (open class)
   * Note: Exclamations and other isolated words
   * @example `ah` (ah), `oj` (oh), `hej` (hey)
   */
  Interjection = 'INTJ',

  /**
   * Noun (open class)
   * Note: Words denoting concrete/abstract entities
   * @example `trava` (grass), `lěto` (summer), `nož` (knife)
   */
  Noun = 'NOUN',

  /**
   * Numeral (closed class)
   * Note: Numbers, numerals in different formats
   * @example jedin, dvadesęť, 100
   */
  Numeral = 'NUM',

  /**
   * Particle (closed class)
   * Note: Function words associated with another word/phrase
   * @example `li` (whether), `ne` (not), `nehaj` (let)
   */
  Particle = 'PART',

  /**
   * Pronoun (closed class)
   * Note: Words substituting for nouns or noun phrases
   * @example `vy` (you), `sebe` (yourself), `někto` (someone), `vsečto` (everything)
   */
  Pronoun = 'PRON',

  /**
   * Proper noun (open class)
   * Note: Names of individuals, companies, places, organizations
   * @example `Praga` (Prague), `Ivan` (Ivan), `Atlantida` (Atlantis)
   */
  ProperNoun = 'PROPN',

  /**
   * Punctuation (other)
   * Note: Non-alphabetical characters used as delimiters
   * @example . , ( ) "
   */
  Punctuation = 'PUNCT',

  /**
   * Subordinating conjunction (closed class)
   * Note: Links clauses where one is subordinate to the other
   * @example `ako` (if), `kȯgda` (when), `že` (that)
   */
  SubordinatingConjunction = 'SCONJ',

  /**
   * Symbol (other)
   * Note: Non-linguistic symbols with special meanings
   * @example $, %, §, ©
   */
  Symbol = 'SYM',

  /**
   * Verb (open class)
   * Note: Words denoting actions, processes, states
   * @example viděti (to see), viděny (seen), vidimy (visible)
   */
  Verb = 'VERB',

  /**
   * Other
   * Note: Used for unclassified words and symbols
   */
  Other = 'X',
}
