export type SlavicLanguage =
  | 'ru'
  | 'be'
  | 'uk'
  | 'bg'
  | 'mk'
  | 'sr'
  | 'hr'
  | 'sl'
  | 'cs'
  | 'sk'
  | 'pl';

export interface AdjectiveDeclinatorContext {
  distinguishAnimacy: boolean;
}

export interface Word {}

const enum Animacy {
  Inanimate = 'Inan',
  Animate = 'Anim',
  Human = 'Hum',
}

const enum Case {
  Nominative = 'Nom',
  Accusative = 'Acc',
  Genitive = 'Gen',
  Dative = 'Dat',
  Instrumental = 'Ins',
  Locative = 'Loc',
  Vocative = 'Voc',
}

const enum Number {
  Singular = 'Sing',
  Dual = 'Dual',
  Plural = 'Plur',
  Collective = 'Coll',
  PluraliaTantum = 'Pltm',
}

const enum Poss {
  Possesive = 'Poss',
}

const enum Degree {
  Positive = 'Pos',
  Comparative = 'Cmp',
  Superlative = 'Sup',
}

const enum Gender {
  Masculine = 'Masc',
  Feminine = 'Fem',
  Neutral = 'Neut',
}

const enum Variant {
  Long = 'Long',
  Short = 'Short',
}

const enum Polarity {
  Positive = 'Pos',
  Negative = 'Neg',
}

const enum Tense {
  Present = 'Pres',
  Past = 'Past',
  Future = 'Fut',
}

const enum Aspect {
  Imperfective = 'Imp',
  Perfective = 'Perf',
}

const enum Voice {
  Active = 'Act',
  Passive = 'Pass',
}

const enum Mood {
  Indicative = 'Ind',
  Imperative = 'Imp',
  Conditional = 'Cond',
}

const enum VerbForm {
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
   * @example "pisanje", "viděnje
   */
  VerbalNoun = 'Vnoun',
}

const enum Person {
  First = '1',
  Second = '2',
  Third = '3',
}

export interface AdjectiveAttributes {
  readonly animacy: Animacy;
  readonly case: Case;
  readonly degree: Degree;
  readonly gender: Gender;
  readonly variant: Variant;
}

export interface Adjective extends Word {
  readonly attributes: AdjectiveAttributes;

  animacy(animacy: Animacy): Adjective;
  case(case_: Case): Adjective;
  degree(degree: Degree): Adjective;
  gender(gender: Gender): Adjective;
  variant(variant: Variant): Adjective;

  toString(): string;
}

export class AdjectiveDeclinator {
  readonly #context: AdjectiveDeclinatorContext;

  constructor(context: AdjectiveDeclinatorContext) {
    this.#context = context;
  }
}
