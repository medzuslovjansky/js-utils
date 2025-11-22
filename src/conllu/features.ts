/**
 * Atomic morphological feature types for CONLL-U.
 * These represent individual grammatical features that can be combined
 * into feature sets for different parts of speech.
 */

/**
 * Animacy feature.
 * Describes the animacy of nouns, used to indicate whether a noun represents something animate, inanimate, specifically human, or non-human.
 *
 * @see https://universaldependencies.org/u/feat/Animacy.html
 */
export type Animacy = 'Inan' | 'Anim' | 'Hum' | 'Nhum';

/**
 * Grammatical case.
 * Represents the syntactic and semantic roles of nouns, pronouns, and adjectives.
 *
 * @see https://universaldependencies.org/u/feat/Case.html
 */
export type Case = 'Nom' | 'Acc' | 'Gen' | 'Dat' | 'Ins' | 'Loc' | 'Voc';

/**
 * Grammatical number.
 * Specifies the count of entities represented by the noun or pronoun.
 *
 * @see https://universaldependencies.org/u/feat/Number.html
 */
export type Number = 'Sing' | 'Dual' | 'Plur' | 'Ptan' | 'Coll' | 'Count';

/**
 * PronType.
 * The type of the pronoun (Prs, Dem, Int, Rel, Ind, Neg, Tot, Rcp).
 *
 * @see https://universaldependencies.org/u/feat/PronType.html
 */
export type PronType =
  | 'Prs'
  | 'Dem'
  | 'Int'
  | 'Rel'
  | 'Ind'
  | 'Neg'
  | 'Tot'
  | 'Rcp'
  | 'Art'
  | 'Emp'
  | 'Exc';

/**
 * NumType.
 * The type of the numeral (Card, Ord, Mult, Frac, Sets, Range, Dist).
 *
 * @see https://universaldependencies.org/u/feat/NumType.html
 */
export type NumType =
  | 'Card'
  | 'Ord'
  | 'Mult'
  | 'Frac'
  | 'Sets'
  | 'Range'
  | 'Dist';

/**
 * Reflex.
 * Indicates if the pronoun is reflexive.
 *
 * @see https://universaldependencies.org/u/feat/Reflex.html
 */
export type Reflex = 'Yes';

/**
 * Possessiveness.
 * Indicates possession or ownership.
 *
 * @see https://universaldependencies.org/u/feat/Poss.html
 */
export type Poss = 'Yes';

/**
 * Analytical form.
 * Indicates if a form is analytical (periphrastic) rather than synthetic.
 *
 * @see https://universaldependencies.org/u/feat/Analyt.html
 */
export type Analyt = 'Yes';

/**
 * Degree of comparison.
 * Specifies the intensity or comparison level of adjectives and adverbs.
 *
 * @see https://universaldependencies.org/u/feat/Degree.html
 */
export type Degree = 'Pos' | 'Cmp' | 'Sup';

/**
 * Grammatical gender.
 * Specifies the gender of nouns and agreeing words.
 *
 * @see https://universaldependencies.org/u/feat/Gender.html
 */
export type Gender = 'Masc' | 'Fem' | 'Neut';

/**
 * Possessor gender (Gender[psor]).
 * Specifies the gender of the possessor of a noun.
 *
 * @see https://universaldependencies.org/u/feat/Gender-psor.html
 */
export type PossessorGender = 'Masc,Neut' | 'Fem';

/**
 * Possessor number (Number[psor]).
 * Specifies the number of the possessor of a noun.
 *
 * @see https://universaldependencies.org/u/feat/Number-psor.html
 */
export type PossessorNumber = 'Sing' | 'Plur';

/**
 * Word form variant.
 * Indicates alternative forms of words, often related to length or style.
 *
 * @see https://universaldependencies.org/u/feat/Variant.html
 */
export type Variant = 'Long' | 'Short' | 'Athematic' | 'Bound';

/**
 * Polarity.
 * Indicates whether a statement or word is positive or negative.
 *
 * @see https://universaldependencies.org/u/feat/Polarity.html
 */
export type Polarity = 'Pos' | 'Neg';

/**
 * Grammatical person.
 * Specifies the relationship between the speaker and the action.
 *
 * @see https://universaldependencies.org/u/feat/Person.html
 */
export type Person = '1' | '2' | '3';

/**
 * Tense.
 * Specifies the time of the action described by the verb.
 *
 * @see https://universaldependencies.org/u/feat/Tense.html
 */
export type Tense = 'Pres' | 'Past' | 'Imp';

/**
 * Aspect.
 * Indicates the nature of the action's completion or duration.
 *
 * @see https://universaldependencies.org/u/feat/Aspect.html
 */
export type Aspect = 'Imp' | 'Iter' | 'Perf';

/**
 * Grammatical voice.
 * Describes the relationship between the action and the participants.
 *
 * @see https://universaldependencies.org/u/feat/Voice.html
 */
export type Voice = 'Act' | 'Pass';

/**
 * Grammatical mood.
 * Indicates the attitude of the speaker toward the action or state.
 *
 * @see https://universaldependencies.org/u/feat/Mood.html
 */
export type Mood = 'Ind' | 'Imp' | 'Cond';

/**
 * Verb form.
 * Specifies different verb forms and their syntactic uses.
 *
 * @see https://universaldependencies.org/u/feat/VerbForm.html
 */
export type VerbForm = 'Inf' | 'Fin' | 'Conv' | 'Part' | 'Vnoun';

/**
 * Uninflect.
 * Indicates that a word does not change form based on grammatical features.
 *
 * @see https://universaldependencies.org/u/feat/Uninflect.html
 */
export type Uninflect = 'Yes' | 'No';

/**
 * Style.
 * Indicates the style or sublanguage to which a word form belongs.
 * Useful for marking archaic/obsolete forms (e.g., Russian "оне" feminine "они",
 * Bulgarian "нему/ней"), colloquial, rare, or other stylistic variants.
 *
 * @see https://universaldependencies.org/u/feat/Style.html
 */
export type Style =
  | 'Arch'
  | 'Coll'
  | 'Expr'
  | 'Form'
  | 'Rare'
  | 'Slng'
  | 'Vrnc'
  | 'Vulg';

/**
 * Typo.
 * Indicates an erroneous or typographically unexpected word form.
 * Marks misspellings, typographical errors, and other orthographic issues.
 *
 * @see https://universaldependencies.org/u/feat/Typo.html
 */
export type Typo = 'Yes';
