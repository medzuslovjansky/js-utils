import { parsePos } from '../partOfSpeech';
import { declensionPronoun } from './declensionPronoun';

export function declensionPronounSimple(lemma: string, morphology: string) {
  const pos = parsePos(morphology);
  if (pos.name !== 'pronoun')
    throw new TypeError(`${lemma} (${morphology} is not a pronoun`);

  return declensionPronoun(lemma, pos.type);
}
