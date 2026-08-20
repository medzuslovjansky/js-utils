/**
 * The MISC column, spelled out key by key.
 *
 * MISC is where an annotation goes when it has no home in the standard
 * columns, which makes it the one column that grows a key nobody remembers
 * adding. Listing every key it may carry turns that growth into a deliberate
 * edit: a new one has to be declared here, next to what is already there, and
 * a name that collides with an existing key is a type error rather than a
 * silent second meaning.
 *
 * @see https://universaldependencies.org/format.html
 */
export type Misc = {
  // Attributes the CoNLL-U format itself defines.

  /** No whitespace between this token and the next one in the original text. */
  SpaceAfter?: 'No';
  /** This token opens a paragraph that begins mid-sentence. */
  NewPar?: 'Yes';
  /** ISO 639 code, when this token is not in the file's main language. */
  Lang?: string;
  /** FORM written in another script. */
  Translit?: string;
  /** LEMMA written in another script. */
  LTranslit?: string;
  /** Approximate translation of the form or the lemma, hyphen-joined. */
  Gloss?: string;

  // Attributes of this project.

  /** Steenbergen id of the dictionary entry the token was inflected from. */
  LID?: string;
  /**
   * Identifier of the entry a token belongs to: the `LID` itself for a word
   * out of the dictionary, and `<LID>-<suffix>` for one `derive` produced.
   */
  SID?: string;
  /**
   * Which rule produced a derived token, as a `DerivationCode` such as
   * `v_prap` or `adj_adv`. Absent on tokens that are dictionary entries in
   * their own right, however they inflect.
   */
  Derivation?: string;
  /**
   * `Adj` on a lemma that is an adjective used as a noun. UPOS says `NOUN`,
   * which is what the lexicon means by `učeny` or `prěměnna`, so this is the
   * only place the adjectival declension is still visible.
   */
  Declension?: 'Adj';
};
