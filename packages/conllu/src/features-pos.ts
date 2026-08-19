import type * as Features from './features-atomic.ts';

/** Carried by every POS; the tags with no features of their own use it alone. */
export interface Base {
  Abbr?: Features.Abbr;
  Style?: Features.Style;
  Typo?: Features.Typo;
}

export interface Adjective {
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

export interface Noun {
  Animacy?: Features.Animacy;
  Case?: Features.Case;
  Gender?: Features.Gender;
  Number?: Features.Number;
  Uninflect?: Features.Uninflect;
  VerbForm?: Features.VerbForm;
}

export interface Adverb {
  Degree?: Features.Degree;
  Polarity?: Features.Polarity;
}

export interface Verb {
  Aspect?: Features.Aspect;
  Mood?: Features.Mood;
  Number?: Features.Number;
  Person?: Features.Person;
  Polarity?: Features.Polarity;
  Tense?: Features.Tense;
  VerbForm?: Features.VerbForm;
  Variant?: Features.Variant;
  Voice?: Features.Voice;
}

export interface Pronoun {
  Animacy?: Features.Animacy;
  Case?: Features.Case;
  Gender?: Features.Gender;
  Number?: Features.Number;
  Person?: Features.Person;
  Polarity?: Features.Polarity;
  Poss?: Features.Poss;
  PrepCase?: Features.PrepCase;
  PronType?: Features.PronType;
  Reflex?: Features.Reflex;
  Variant?: Features.Variant;
  'Gender[psor]'?: Features.PossessorGender;
  'Number[psor]'?: Features.PossessorNumber;
}

export interface Numeral {
  Case?: Features.Case;
  Gender?: Features.Gender;
  Number?: Features.Number;
  NumType?: Features.NumType;
}

export type Any = Partial<Base> &
  Partial<Adjective> &
  Partial<Noun> &
  Partial<Adverb> &
  Partial<Verb> &
  Partial<Pronoun> &
  Partial<Numeral>;
