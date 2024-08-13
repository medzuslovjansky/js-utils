import { ALL_CONSONANTS } from '../substitutions';

const HARD_R = new RegExp(`([${ALL_CONSONANTS}])r([${ALL_CONSONANTS}])`, 'g');
const SOFT_R = new RegExp(`([${ALL_CONSONANTS}])ŕ([${ALL_CONSONANTS}])`, 'g');

export function syllabicR(word: string) {
  return word.replace(HARD_R, '$1R$2').replace(SOFT_R, '$1Ŕ$2');
}
