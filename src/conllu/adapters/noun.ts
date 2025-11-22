import { declensionNounSimple, prepareGender } from '../../noun';
import { establishGender } from '../../noun/establishGender';
import { removeBrackets } from '../../utils';
import { Features, Token, IdentifiableString, XPOS } from '../schema';
import { parseXPos } from '../parseXPOS';

/**
 * Convert noun paradigm to CONLLU Token array
 */
export function adaptNoun(
  word: string,
  xpos: XPOS,
  lemma: IdentifiableString,
  irregular?: string,
): Token[] {
  const variants = parseXPos(xpos);
  const tokens: Token[] = [];

  for (const [upos, baseFeats] of variants) {
    if (upos !== 'NOUN') continue;

    // Derive number restrictions from baseFeats
    const isPlural = baseFeats.Number === 'Plur' || baseFeats.Number === 'Ptan';
    const isSingular = baseFeats.Number === 'Sing';

    // Handle masculineOrFeminine gender - use the variant's gender
    const genderOverride =
      baseFeats.Gender === 'Fem'
        ? ('feminine' as const)
        : baseFeats.Gender === 'Masc'
        ? ('masculine' as const)
        : undefined;

    // Determine if this is an athematic class (m3, n2, n3, f3)
    const genderArg =
      baseFeats.Gender === 'Masc'
        ? 'masculine'
        : baseFeats.Gender === 'Fem'
        ? 'feminine'
        : baseFeats.Gender === 'Neut'
        ? 'neuter'
        : 'masculine';

    const animateArg = baseFeats.Animacy === 'Anim';
    const rawGender = prepareGender(genderArg, animateArg);

    let cleanWordForGender = removeBrackets(word, '[', ']');
    if (cleanWordForGender.includes(' '))
      cleanWordForGender = cleanWordForGender.split(' ')[0];

    const genderClass = establishGender(cleanWordForGender, rawGender);
    const isAthematicClass = ['m3', 'n2', 'n3', 'f3'].includes(genderClass);

    // Get the declension paradigm - pass word and xpos as-is, declensionNounSimple handles parsing
    const paradigm = declensionNounSimple(
      word,
      xpos,
      irregular || '',
      genderOverride,
    );

    if (!paradigm) {
      // If declension fails, return at least the base form
      tokens.push({
        token: word,
        upos: 'NOUN',
        xpos,
        lemma,
        feats: baseFeats,
      });
      continue;
    }

    // Map case names to Case enum
    const caseMap: Record<string, Features.Case> = {
      nom: 'Nom',
      acc: 'Acc',
      gen: 'Gen',
      dat: 'Dat',
      ins: 'Ins',
      loc: 'Loc',
      voc: 'Voc',
    };

    // Generate tokens for each case and number combination
    for (const [caseName, forms] of Object.entries(paradigm)) {
      if (caseName === 'voc' && !forms[0] && !forms[1]) continue; // Skip vocative if not present

      const conlluCase = caseMap[caseName];
      if (!conlluCase) continue;

      // Singular forms
      if (forms[0] !== null && !isPlural) {
        const normalizedForms = normalizeForm(forms[0]);

        // Determine athematic variants
        let athematicForm: string | null = null;
        if (isAthematicClass && normalizedForms.length > 1) {
          athematicForm = normalizedForms.reduce((a, b) =>
            a.length >= b.length ? a : b,
          );
        }

        for (const form of normalizedForms) {
          const feats = {
            ...baseFeats,
            Case: conlluCase,
            Number: 'Sing' as Features.Number,
          };

          if (form === athematicForm && normalizedForms.length > 1) {
            feats.Variant = 'Athematic' as Features.Variant;
          }

          tokens.push({
            token: form,
            upos: 'NOUN',
            xpos,
            lemma,
            feats,
          });
        }
      }

      // Plural forms
      if (forms[1] !== null && !isSingular) {
        const normalizedForms = normalizeForm(forms[1]);

        // Determine athematic variants
        let athematicForm: string | null = null;
        if (isAthematicClass && normalizedForms.length > 1) {
          athematicForm = normalizedForms.reduce((a, b) =>
            a.length >= b.length ? a : b,
          );
        }

        for (const form of normalizedForms) {
          const feats = {
            ...baseFeats,
            Case: conlluCase,
            Number: (baseFeats.Number === 'Ptan'
              ? 'Ptan'
              : 'Plur') as Features.Number,
          };

          if (form === athematicForm && normalizedForms.length > 1) {
            feats.Variant = 'Athematic' as Features.Variant;
          }

          tokens.push({
            token: form,
            upos: 'NOUN',
            xpos,
            lemma,
            feats,
          });
        }
      }
    }
  }

  return tokens;
}

/**
 * Normalize form: handle alternatives (split by /) and remove parentheses
 * Returns array of all alternative forms
 */
function normalizeForm(form: string | null): string[] {
  if (!form) return [];

  // Remove parentheses and their contents (irregular forms are handled separately via irregular parameter)
  const cleaned = form.replace(/\([^)]*\)/g, '').trim();
  if (!cleaned) return [];

  // Split by / to get all alternatives, trim each, and filter out empty strings
  const alternatives = cleaned
    .split('/')
    .map((alt) => alt.trim())
    .filter((alt) => alt.length > 0);

  return alternatives.length > 0 ? alternatives : [];
}
