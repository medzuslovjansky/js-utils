import type { AdapterResult, XPOS } from '@interslavic/conllu';
import {
  createHardcodedLookup,
  type HardcodedParadigms,
} from './utils/index.ts';
import { NUMERAL_HARDCODED_PARADIGMS } from './numeral/hardcoded.ts';
import { PRONOUN_HARDCODED_PARADIGMS } from './pronoun/hardcoded.ts';
import { VERB_HARDCODED_PARADIGMS } from './verb/hardcoded.ts';

const ALL_HARDCODED_PARADIGMS: HardcodedParadigms = {
  ...PRONOUN_HARDCODED_PARADIGMS,
  ...NUMERAL_HARDCODED_PARADIGMS,
  ...VERB_HARDCODED_PARADIGMS,
};

const hardcodedLookup = createHardcodedLookup(ALL_HARDCODED_PARADIGMS);

export function inflectHardcoded(word: string, xpos: XPOS): AdapterResult {
  return hardcodedLookup(word, xpos);
}
