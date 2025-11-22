import { DerivedLemma } from './types';
import { deriveFromAdjective } from './adjective';
import { deriveFromNoun } from './noun';
import { deriveFromVerb } from './verb';

export * from './types';

export function derive(
  lemma: string,
  xpos: string,
  irregular?: string,
): DerivedLemma[] {
  const derived: DerivedLemma[] = [];

  derived.push(...deriveFromAdjective(lemma, xpos));
  derived.push(...deriveFromNoun(lemma, xpos));
  derived.push(...deriveFromVerb(lemma, xpos, irregular));

  return derived;
}
