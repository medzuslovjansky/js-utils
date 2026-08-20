/**
 * The MISC column, spelled out key by key.
 *
 * MISC takes any annotation with no home in the standard columns, so left
 * untyped it accumulates keys nobody declared. Naming every key it may carry
 * makes adding one a deliberate edit, next to what is already there, and makes
 * a collision with an existing key a type error.
 *
 * @see https://universaldependencies.org/format.html
 */
export type Misc = {
  // Attributes the CoNLL-U format itself defines.

  /** No whitespace between this token and the next one in the original text. */
  SpaceAfter?: 'No';

  // Attributes of this project.

  /** Steenbergen id of the dictionary entry the token was inflected from. */
  LID?: string;
  /**
   * Identifier of the entry a token belongs to: the `LID` itself for a word
   * out of the dictionary, and `<LID>-<suffix>` for one `derive` produced.
   */
  SID?: string;
  /**
   * Which rule produced a derived token. Absent on tokens that are dictionary
   * entries in their own right, however they inflect.
   */
  Derivation?: DerivationCode;
  /**
   * `Adj` on a lemma that is an adjective used as a noun. UPOS says `NOUN`,
   * as the lexicon means it to for `učeny` or `prěměnna`, so this is the only
   * place the adjectival declension is visible.
   */
  Declension?: 'Adj';
};

/**
 * What `Derivation` may say: one code per rule that turns a dictionary entry
 * into a lexeme of its own. The codes live next to the key they fill rather
 * than beside the rules that use them, so a rule added without a code is a
 * type error.
 */
export type DerivationCode =
  // Verb derivations
  | 'v_prap' // Present active participle (dělajųći)
  | 'v_prpp' // Present passive participle (dělajemy)
  | 'v_pfap' // Past active participle (sdělavši)
  | 'v_pfpp' // Past passive participle (dělany)
  | 'v_noun' // Verbal noun (dělanje)
  // Adjective derivations
  | 'adj_cmp' // Comparative adjective, synthetic (dobrějši)
  | 'adj_sup' // Superlative adjective, synthetic (najdobrějši)
  | 'adj_sup_a' // Superlative adjective, analytical (najdobry)
  | 'adj_adv' // Adverb positive (dobro)
  // Adverb derivations
  | 'adv_cmp' // Comparative adverb, synthetic (bolje)
  | 'adv_sup' // Superlative adverb, synthetic (najbolje)
  | 'adv_sup_a'; // Superlative adverb, analytical (najdobro)
