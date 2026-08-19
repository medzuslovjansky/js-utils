import type { XPOS } from '@interslavic/conllu';
import { transliterate } from '@interslavic/translit';

const RULES: [RegExp, XPOS][] = [
  // Participles
  [/(ųći|ući|ęći|eći)$/i, 'v.prap.'],
  [/(vši|ši)$/i, 'v.pfap.'],
  [/(emy|imy|omy)$/i, 'v.prpp.'],
  // Verbal nouns
  [/(ńje|nje|tje|ťje)$/i, 'n.'],
  // Agent nouns
  [/(telj|teľ|teĺ|[aäeęj]nin)$/i, 'm.anim.'],
  // Abstract / non-a feminine nouns
  [
    /(os[tť]\u0301?|ost́|ost|[ae]znj|[oae]sť|[oae]st́|bov|vov|kȯv|rȯv|kov|rov)$/i,
    'f.',
  ],
  // Verbs (infinitive)
  [/(ti|ťi|či|ći)$/i, 'v.tr. ipf.'],
  // Adjectives
  [/(y|ji)$/i, 'adj.'],
  // Feminine nouns
  [/a$/i, 'f.'],
  // Neuter nouns
  [/(o|e|ę)$/i, 'n.'],
];

export function guessXpos(form: string): XPOS {
  const trimmed = form.trim();
  if (!trimmed) return 'm.';
  const normalized = transliterate(
    trimmed,
    'isv-Latn-x-etymolog',
  ).toLowerCase();
  for (const [pattern, xpos] of RULES) {
    if (pattern.test(normalized)) return xpos;
  }
  return 'm.';
}
