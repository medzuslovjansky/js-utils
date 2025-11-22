import { declensionAdjective } from '../../adjective';
import {
  Features,
  Token,
  IdentifiableString,
  XPOS,
  TokenFeatures,
} from '../schema';
import { parseXPos } from '../parseXPOS';
import transliterate from '../../transliterate';
import { normalizeForm } from './utils';
import {
  expandSingularMasculineAccusative,
  expandPluralMasculine,
} from './animacy';

/**
 * Convert adjective paradigm to CONLLU Token array
 */
export function adaptAdjective(
  word: string,
  xpos: XPOS,
  lemma: IdentifiableString,
  itemFeats?: TokenFeatures,
): Token[] {
  const variants = parseXPos(xpos);
  const tokens: Token[] = [];

  for (const [upos, baseFeats] of variants) {
    if (upos !== 'ADJ') continue;

    // Merge item.feats with baseFeats (item.feats take precedence)
    const mergedFeats = { ...baseFeats, ...itemFeats };

    // Normalize word using transliterate to handle various orthographies and characters
    // e.g. blěskaĵųćí -> blěskajųći
    const declensionWord = transliterate(word, 'isv-Latn-x-etymolog');

    const paradigm = declensionAdjective(declensionWord, '', xpos);

    if (!paradigm) {
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
    };

    // Helper to add token
    const addToken = (form: string, feats: TokenFeatures) => {
      const normalizedForms = normalizeForm(form);
      for (const cleanForm of normalizedForms) {
        tokens.push({
          token: cleanForm,
          upos: 'ADJ',
          xpos,
          lemma,
          feats: { ...mergedFeats, ...feats },
        });
      }
    };

    // Callback for animacy helpers
    const createToken = (form: string, feats: TokenFeatures) => {
      tokens.push({
        token: form,
        upos: 'ADJ',
        xpos,
        lemma,
        feats: { ...mergedFeats, ...feats },
      });
    };

    // Short form
    if (paradigm.short) {
      addToken(paradigm.short, {
        Number: 'Sing',
        Gender: 'Masc',
        Case: 'Nom',
        Variant: 'Short',
      });
    }

    // Singular
    if (paradigm.singular && paradigm.singular.nom && paradigm.singular.gen) {
      // Pre-extract nom and gen forms for animacy comparison
      const nomMascForms = normalizeForm(paradigm.singular.nom[0]);
      const genMascForms = normalizeForm(paradigm.singular.gen[0]);

      for (const [caseName, forms] of Object.entries(paradigm.singular)) {
        const conlluCase = caseMap[caseName];
        if (!conlluCase) continue;

        if (caseName === 'nom') {
          addToken(forms[0], {
            Number: 'Sing',
            Gender: 'Masc',
            Case: conlluCase,
          });
          addToken(forms[1], {
            Number: 'Sing',
            Gender: 'Neut',
            Case: conlluCase,
          });
          addToken(forms[2], {
            Number: 'Sing',
            Gender: 'Fem',
            Case: conlluCase,
          });
        } else if (caseName === 'acc') {
          // Masculine accusative: distinguish animacy
          const accMascForms = normalizeForm(forms[0]);
          expandSingularMasculineAccusative(
            accMascForms,
            nomMascForms,
            genMascForms,
            { Number: 'Sing', Gender: 'Masc', Case: conlluCase },
            createToken,
          );

          // Neut/Fem accusative
          addToken(forms[1], {
            Number: 'Sing',
            Gender: 'Neut',
            Case: conlluCase,
          });
          addToken(forms[2], {
            Number: 'Sing',
            Gender: 'Fem',
            Case: conlluCase,
          });
        } else {
          // gen, loc, dat, ins
          addToken(forms[0], {
            Number: 'Sing',
            Gender: 'Masc',
            Case: conlluCase,
          });
          addToken(forms[0], {
            Number: 'Sing',
            Gender: 'Neut',
            Case: conlluCase,
          });
          addToken(forms[1], {
            Number: 'Sing',
            Gender: 'Fem',
            Case: conlluCase,
          });
        }
      }
    }

    // Plural
    if (paradigm.plural) {
      for (const [caseName, forms] of Object.entries(paradigm.plural)) {
        const conlluCase = caseMap[caseName];
        if (!conlluCase) continue;

        if (caseName === 'nom' || caseName === 'acc') {
          // Masc: forms[0] (can be split for Anim/Inan)
          const mascForms = normalizeForm(forms[0]);
          expandPluralMasculine(
            mascForms,
            { Number: 'Plur', Gender: 'Masc', Case: conlluCase },
            createToken,
          );

          // Neut/Fem: forms[1]
          // Always generate distinct tokens for Neut and Fem, even if they share the form
          const neutFemForms = normalizeForm(forms[1]);
          for (const form of neutFemForms) {
            createToken(form, {
              Number: 'Plur',
              Gender: 'Neut',
              Case: conlluCase,
            });
            createToken(form, {
              Number: 'Plur',
              Gender: 'Fem',
              Case: conlluCase,
            });
          }
        } else {
          // gen, loc, dat, ins - forms[0] applies to all genders
          // If all genders have the same form, collapse into one token without Gender
          const normalizedForm = normalizeForm(forms[0]);
          if (normalizedForm.length === 1) {
            // Single form for all genders - omit Gender feature
            createToken(normalizedForm[0], {
              Number: 'Plur',
              Case: conlluCase,
            });
          } else {
            // Multiple variants - keep Gender (though this is rare for gen/loc/dat/ins)
            for (const form of normalizedForm) {
              createToken(form, {
                Number: 'Plur',
                Case: conlluCase,
              });
            }
          }
        }
      }
    }
  }

  return tokens;
}
