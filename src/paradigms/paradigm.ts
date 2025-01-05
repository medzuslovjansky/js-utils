import { Adjective, Adverb, Noun, Verb, Word, WordFeatures } from '../core';

export interface Paradigm<T extends Word> {
  stem(word: T): string;
  list(predicate?: Partial<WordFeatures<T>>): T[];
}

export type NounParadigm = Paradigm<Noun>;
export type AdjectiveParadigm = Paradigm<Adjective>;
export type AdverbParadigm = Paradigm<Adverb>;
export type VerbParadigm = Paradigm<Verb>;
