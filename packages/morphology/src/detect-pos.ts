import type { UPOS, XPOS } from '@interslavic/conllu';
import { transliterate } from '@interslavic/translit';
import { parseXPos } from './steen/index.ts';

export interface PosDetection {
  xpos: XPOS;
  upos: UPOS;
  label: string;
  reason: string;
}

interface Rule {
  pattern: RegExp;
  xpos: XPOS;
  label: string;
  reason: string;
}

const DETECTION_RULES: Rule[] = [
  // Participles (present active, past active, present passive)
  {
    pattern: /(ųći|ući|ęći|eći|vši|ši|emy|imy|omy)$/i,
    xpos: 'v.part.',
    label: 'Verb (participle)',
    reason: 'participle ending',
  },
  // Verbal nouns
  {
    pattern: /(ńje|nje|tje|ťje)$/i,
    xpos: 'n.',
    label: 'Verbal Noun (neuter)',
    reason: 'verbal noun suffix -nje/-tje',
  },
  // Agent nouns (-telj, -anin)
  {
    pattern: /(telj|teľ|teĺ|[aäeęj]nin)$/i,
    xpos: 'm.anim.',
    label: 'Noun (masculine animate)',
    reason: 'agent suffix -telj/-anin',
  },
  // Abstract & non-a feminine nouns (-ost/-osť, -eznj/-aznj, -ov in crkȯv/brȯv/ljubov)
  {
    pattern:
      /(os[tť]\u0301?|ost́|ost|[ae]znj|[oae]sť|[oae]st́|bov|vov|kȯv|rȯv|kov|rov)$/i,
    xpos: 'f.',
    label: 'Noun (feminine)',
    reason: 'abstract suffix -ost/-osť',
  },
  // Verbs (infinitive)
  {
    pattern: /(ti|ťi|či|ći)$/i,
    xpos: 'v.tr. ipf.',
    label: 'Verb (imperfective)',
    reason: 'infinitive ending',
  },
  // Adjectives
  {
    pattern: /(y|ji)$/i,
    xpos: 'adj.',
    label: 'Adjective',
    reason: 'adjectival ending',
  },
  // Basic feminine nouns
  {
    pattern: /a$/i,
    xpos: 'f.',
    label: 'Noun (feminine)',
    reason: 'ending -a',
  },
  // Basic neuter nouns
  {
    pattern: /(o|e|ę)$/i,
    xpos: 'n.',
    label: 'Noun (neuter)',
    reason: 'ending -o/-e/-ę',
  },
];

export function detectPos(form: string): PosDetection {
  const trimmed = form.trim();
  if (!trimmed) {
    return {
      xpos: 'm.',
      upos: 'NOUN',
      label: 'Noun (masculine)',
      reason: 'fallback',
    };
  }

  // Canonicalize to etymological Latin so rules match Cyrillic, Glagolitic, and ASCII alike
  const etym = transliterate(trimmed, 'isv-Latn-x-etymolog').toLowerCase();

  for (const rule of DETECTION_RULES) {
    if (rule.pattern.test(etym)) {
      const parsed = parseXPos(trimmed, rule.xpos);
      const upos =
        parsed[0]?.[0] ?? (rule.xpos.startsWith('adj') ? 'ADJ' : 'NOUN');
      return {
        xpos: rule.xpos,
        upos,
        label: rule.label,
        reason: rule.reason,
      };
    }
  }

  return {
    xpos: 'm.',
    upos: 'NOUN',
    label: 'Noun (masculine)',
    reason: 'consonant ending fallback',
  };
}
