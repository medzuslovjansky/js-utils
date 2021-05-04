export type PartOfSpeech =
  | Adjective
  | Adverb
  | Conjunction
  | Interjection
  | Noun
  | Numeral
  | Particle
  | Phrase
  | Preposition
  | Prefix
  | Pronoun
  | Suffix
  | Verb;

export type Adjective = {
  name: 'adjective';
  // positive: boolean;
  // comparative: boolean;
  // superlative: boolean;
};

export type Adverb = {
  name: 'adverb';
  // positive: boolean;
  // comparative: boolean;
  // superlative: boolean;
};

export type Conjunction = {
  name: 'conjunction';
};

export type Interjection = {
  name: 'interjection';
};

export type Noun = {
  name: 'noun';
  masculine: boolean;
  animate: boolean;
  feminine: boolean;
  neuter: boolean;
  singular: boolean;
  plural: boolean;
  indeclinable: boolean;
};

export type Numeral = {
  name: 'numeral';
  cardinal: boolean;
  collective: boolean;
  differential: boolean;
  fractional: boolean;
  multiplicative: boolean;
  ordinal: boolean;
  substantivized: boolean;
};

export type Particle = {
  name: 'particle';
};

export type Phrase = {
  name: 'phrase';
};

export type Prefix = {
  name: 'prefix';
};

export type Preposition = {
  name: 'preposition';
};

export type Pronoun = {
  name: 'pronoun';
  demonstrative: boolean;
  indefinite: boolean;
  interrogative: boolean;
  personal: boolean;
  possessive: boolean;
  reciprocal: boolean;
  reflexive: boolean;
  relative: boolean;
};

export type Suffix = {
  name: 'suffix';
};

export type Verb = {
  name: 'verb';
  auxiliary: boolean;
  imperfective: boolean;
  intransitive: boolean;
  perfective: boolean;
  reflexive: boolean;
  transitive: boolean;
};
