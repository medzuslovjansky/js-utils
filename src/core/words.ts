import { UPOS } from './upos';
import type {
  AdjectiveFeatures,
  AdverbFeatures,
  NounFeatures,
  VerbFeatures,
} from './upos-features';

export interface Word {
  upos: UPOS;
  form: string;
  toString(): string;
}

export interface Noun extends Word, NounFeatures {
  upos: UPOS.Noun;
}

export interface Adjective extends Word, AdjectiveFeatures {
  upos: UPOS.Adjective;
}

export interface Adverb extends Word, AdverbFeatures {
  upos: UPOS.Adverb;
}

export interface Verb extends Word, VerbFeatures {
  upos: UPOS.Verb;
}

export type WordFeatures<T extends Word> = T extends Noun
  ? NounFeatures
  : T extends Adjective
  ? AdjectiveFeatures
  : T extends Adverb
  ? AdverbFeatures
  : T extends Verb
  ? VerbFeatures
  : never;
