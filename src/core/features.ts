/**
 * Enum for animacy.
 * Describes the animacy of nouns, used to indicate whether a noun represents something animate, inanimate, or specifically human.
 * @example Animacy.Animate
 */
export const enum Animacy {
  /** Inanimate objects, concepts, or things. */
  Inanimate = 'Inan',
  /** Living beings or entities with motion. */
  Animate = 'Anim',
  /** Human beings specifically. */
  Human = 'Hum',
}

/**
 * Enum for grammatical cases.
 * Represents the syntactic and semantic roles of nouns, pronouns, and adjectives.
 * @example Case.Nominative
 */
export const enum Case {
  /** Subject of the sentence. */
  Nominative = 'Nom',
  /** Direct object of a verb. */
  Accusative = 'Acc',
  /** Indicates possession or relation. */
  Genitive = 'Gen',
  /** Indirect object of a verb. */
  Dative = 'Dat',
  /** Instrument or means of action. */
  Instrumental = 'Ins',
  /** Location or position. */
  Locative = 'Loc',
  /** Used for direct address. */
  Vocative = 'Voc',
}

/**
 * Enum for grammatical number.
 * Specifies the count of entities represented by the noun or pronoun.
 * @example Number.Plural
 */
export const enum Number {
  /** Single entity. */
  Singular = 'Sing',
  /** Exactly two entities. */
  Dual = 'Dual',
  /** More than one entity. */
  Plural = 'Plur',
  /** Collective group as a single entity. */
  Collective = 'Coll',
  /** Nouns that appear only in plural form. */
  PluraliaTantum = 'Pltm',
}

/**
 * Enum for possessiveness.
 * Indicates possession or ownership.
 * @example Poss.Possesive
 */
export const enum Poss {
  /** Indicates possession. */
  Possesive = 'Poss',
}

/**
 * Enum for degrees of comparison.
 * Specifies the intensity or comparison level of adjectives and adverbs.
 * @example Degree.Superlative
 */
export const enum Degree {
  /** Basic form without comparison. */
  Positive = 'Pos',
  /** Comparison between two entities. */
  Comparative = 'Cmp',
  /** Highest degree of comparison. */
  Superlative = 'Sup',
}

/**
 * Enum for grammatical gender.
 * Specifies the gender of nouns and agreeing words.
 * @example Gender.Neutral
 */
export const enum Gender {
  /** Masculine gender. */
  Masculine = 'Masc',
  /** Feminine gender. */
  Feminine = 'Fem',
  /** Neutral gender. */
  Neutral = 'Neut',
}

/**
 * Enum for word form variants.
 * Indicates alternative forms of words, often related to length or style.
 * @example Variant.Short
 */
export const enum Variant {
  /** Long form of the word. */
  Long = 'Long',
  /** Short or reduced form of the word. */
  Short = 'Short',
}

/**
 * Enum for polarity.
 * Indicates whether a statement or word is positive or negative.
 * @example Polarity.Negative
 */
export const enum Polarity {
  /** Affirmative or positive polarity. */
  Positive = 'Pos',
  /** Negative polarity. */
  Negative = 'Neg',
}

/**
 * Enum for grammatical person.
 * Specifies the relationship between the speaker and the action.
 * @example Person.Second
 */
export const enum Person {
  /** First person (the speaker). */
  First = '1',
  /** Second person (the addressee). */
  Second = '2',
  /** Third person (someone else). */
  Third = '3',
}

/**
 * Enum for tense.
 * Specifies the time of the action described by the verb.
 * @example Tense.Future
 */
export const enum Tense {
  /** Action occurring in the present. */
  Present = 'Pres',
  /** Action that occurred in the past. */
  Past = 'Past',
  /** Actions happening during some past moment, may continue or not. */
  Imperfect = 'Imp',
}

/**
 * Enum for aspect.
 * Indicates the nature of the action’s completion or duration.
 * @example Aspect.Perfective
 */
export const enum Aspect {
  /** Ongoing or habitual action. */
  Imperfective = 'Imp',
  /** Iterative or habitual action. */
  Iterative = 'Iter',
  /** Completed action. */
  Perfective = 'Perf',
}

/**
 * Enum for grammatical voice.
 * Describes the relationship between the action and the participants.
 * @example Voice.Passive
 */
export const enum Voice {
  /** The subject performs the action. */
  Active = 'Act',
  /** The subject receives the action. */
  Passive = 'Pass',
}

/**
 * Enum for grammatical mood.
 * Indicates the attitude of the speaker toward the action or state.
 * @example Mood.Conditional
 */
export const enum Mood {
  /** Statement of fact. */
  Indicative = 'Ind',
  /** Command or request. */
  Imperative = 'Imp',
  /** Hypothetical or conditional action. */
  Conditional = 'Cond',
}

/**
 * Enum for verb forms.
 * Specifies different verb forms and their syntactic uses.
 */
export const enum VerbForm {
  /**
   * Infinitive
   * @example "pisati", "napisati"
   */
  Infinitive = 'Inf',
  /**
   * Finite verb form
   * @example "piše", "pisahų"
   */
  Finite = 'Fin',
  /**
   * Transgressive
   * @example "pišući", "vidęći"
   */
  Converb = 'Conv',
  /**
   * Participle
   * @example "pisal", "pišuća", "pisany", "pisavši"
   */
  Participle = 'Part',
  /**
   * Verbal noun
   * @example "pisanje", "vidėnje"
   */
  VerbalNoun = 'Vnoun',
}

/**
 * Enum for words that are indeclinable.
 * Indicates that a word does not change form based on grammatical features.
 */
export const enum Uninflect {
  Yes = 'Yes',
  No = 'No',
}
