import { conjugationVerb } from '../verb/conjugationVerb';
import { parseXPos } from '../conllu/parseXPOS';
import { DerivedLemma } from './types';

export function deriveFromVerb(
  lemma: string,
  xpos: string,
  irregular?: string,
): DerivedLemma[] {
  const derived: DerivedLemma[] = [];
  if (!xpos) return derived;

  const variants = parseXPos(xpos);

  for (const [upos] of variants) {
    if (upos !== 'VERB' && upos !== 'AUX') continue;

    // First try with empty present tense stem (regular verbs)
    let paradigm = conjugationVerb(lemma, irregular ?? '', xpos);

    // For irregular verbs, try to extract present tense stem from paradigm
    // and re-call conjugationVerb with it to get more accurate forms
    if (paradigm && paradigm.present && paradigm.present[0]) {
      const firstPersonSingular = extractBaseForm(paradigm.present[0]);
      if (firstPersonSingular) {
        // conjugationVerb processes rawPts to extract the stem, so we can pass
        // the first person singular form directly - it will extract the stem from it
        // This helps with irregular verbs that have different present tense stems
        const irregularParadigm = conjugationVerb(
          lemma,
          firstPersonSingular,
          xpos,
        );
        if (irregularParadigm) {
          paradigm = irregularParadigm;
        }
      }
    }

    if (!paradigm) continue;

    // 1. Gerund -> Verbal Noun: dělati -> dělanje
    if (paradigm.gerund) {
      derived.push({
        lemma: paradigm.gerund,
        xpos: 'n.', // verbal nouns are neuter singular
        derivation: 'verb:vnoun',
      });
    }

    // 2. Present Active Participle -> Adjective: dělati -> dělajųći
    if (paradigm.prap) {
      const base = extractBaseForm(paradigm.prap);
      if (base) {
        derived.push({
          lemma: base,
          xpos: 'adj. prap.',
          derivation: 'verb:prap',
        });
      }
    }

    // 3. Present Passive Participle -> Adjective: dělati -> dělajemy
    if (paradigm.prpp && paradigm.prpp !== '—') {
      const base = extractBaseForm(paradigm.prpp);
      if (base) {
        derived.push({
          lemma: base,
          xpos: 'adj. prpp.',
          derivation: 'verb:prpp',
        });
      }
    }

    // 4. Past Passive Participle -> Adjective: dělati -> dělany
    // Note: Past Active Participle (L-participle) is handled in conllu/adapters/verb.ts
    // and remains as VERB tokens, not derived as adjectives
    if (paradigm.pfpp) {
      const base = extractBaseForm(paradigm.pfpp);
      if (base) {
        derived.push({
          lemma: base,
          xpos: 'adj. pfpp.',
          derivation: 'verb:pfpp',
        });
      }
    }
  }

  return derived;
}

function extractBaseForm(text: string): string | undefined {
  // Text is like "dělajući (dělajuća, dělajuće)" or "dělany (dělaná, dělané)"
  // We want "dělajući" or "dělany"
  const match = text.match(/^([^\s(]+)/);
  return match ? match[1] : undefined;
}
