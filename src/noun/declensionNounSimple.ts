import { parsePos } from '../partOfSpeech';
import { declensionNoun } from './declensionNoun';

export function declensionNounSimple(
  lemma: string,
  morphology: string,
  extra = '',
  genderOverride?: 'masculine' | 'feminine',
) {
  const pos = parsePos(morphology);
  if (pos.name !== 'noun') throw new Error('not a noun');

  let gender = pos.gender;
  if (gender === 'masculineOrFeminine') {
    gender = genderOverride ?? gender;
  }

  return declensionNoun(
    lemma,
    extra,
    gender,
    pos.animate,
    pos.plural,
    pos.singular,
    pos.indeclinable,
  );
}
