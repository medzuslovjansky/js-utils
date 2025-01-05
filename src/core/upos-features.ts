import {
  Animacy,
  Aspect,
  Case,
  Degree,
  Gender,
  Mood,
  Number,
  Person,
  Polarity,
  Poss,
  Tense,
  Uninflect,
  Variant,
  VerbForm,
  Voice,
} from './features';

export interface AdjectiveFeatures {
  animacy?: Animacy;
  case?: Case;
  degree?: Degree;
  gender?: Gender;
  number?: Number;
  polarity?: Polarity;
  poss?: Poss;
  uninflect?: Uninflect;
  variant?: Variant;
}

export interface NounFeatures {
  animacy?: Animacy;
  case?: Case;
  gender?: Gender;
  number?: Number;
  uninflect?: Uninflect;
  verbForm?: VerbForm.VerbalNoun;
}

export interface AdverbFeatures {
  degree?: Degree;
  polarity?: Polarity;
}

export interface VerbFeatures {
  aspect?: Aspect;
  mood?: Mood;
  number?: Number;
  person?: Person;
  polarity?: Polarity;
  tense?: Tense;
  verbForm?: VerbForm;
  voice?: Voice;
}
