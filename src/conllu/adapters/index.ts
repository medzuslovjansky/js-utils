import { parseXPos } from '../parseXPOS';
import { parsePos } from '../../partOfSpeech';
import { adaptNoun } from './noun';
import { adaptAdjective } from './adjective';
import { adaptPronoun } from './pronoun';
import { adaptNumeral } from './numeral';
import { adaptVerb } from './verb';
import { Token, IdentifiableString, XPOS } from '../schema';
import { adaptHardcoded } from './hardcoded';

export function adaptWord(
  word: string,
  xpos: XPOS,
  lemma: IdentifiableString,
  irregular?: string,
): Token[] {
  if (word.includes(' ')) {
    return [];
  }

  const variants = parseXPos(xpos || '');
  const primaryUpos = variants[0]?.[0];

  const hardcoded = adaptHardcoded(word, xpos, lemma);
  if (hardcoded.length > 0) {
    return hardcoded;
  }

  switch (primaryUpos) {
    case 'NOUN': {
      // Check if this is actually a numeral (substantivized, fractional)
      // that should be handled by adaptNumeral instead of adaptNoun
      const posInfo = parsePos(xpos || '');
      if (posInfo.name === 'numeral') {
        return adaptNumeral(word, xpos || '', lemma);
      }
      return adaptNoun(word, xpos || '', lemma, irregular);
    }

    case 'ADJ': {
      // Check if this is actually a numeral (ordinal, multiplicative, differential)
      // that should be handled by adaptNumeral instead of adaptAdjective
      const posInfo = parsePos(xpos || '');
      if (posInfo.name === 'numeral') {
        return adaptNumeral(word, xpos || '', lemma);
      }
      return adaptAdjective(word, xpos || '', lemma);
    }

    case 'PRON':
    case 'DET':
      return adaptPronoun(word, xpos || '', lemma);

    case 'NUM':
      return adaptNumeral(word, xpos || '', lemma);

    case 'VERB':
    case 'AUX':
      return adaptVerb(word, xpos || '', lemma, irregular);

    default:
      return variants.flatMap(([upos, feats]) => [
        {
          token: word,
          upos,
          xpos,
          lemma,
          feats,
        },
      ]);
  }
}
