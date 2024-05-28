import { parsePos } from '../../partOfSpeech';
import type { Word } from '../types';
import { getRegularForms } from './regular';

export function forms(
  lemma: string,
  additional: string,
  partOfSpeech: string,
): Word[] {
  const pos = parsePos(partOfSpeech);
  if (pos.name !== 'verb') {
    throw new Error(`Expected a verb, but got: ${partOfSpeech}`);
  }

  let result: Word[] = [];
  // TODO: Add auxiliary forms
  if (!pos.auxiliary) {
    if (pos.perfective) {
      result = result.concat(
        getRegularForms(lemma, additional, { aspect: 'Perf' }),
      );
    }

    if (pos.imperfective) {
      result = result.concat(
        getRegularForms(lemma, additional, { aspect: 'Imp' }),
      );
    }
  }

  return result;
}
