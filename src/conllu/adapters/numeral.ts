import { declensionNumeral } from '../../numeral/declensionNumeral';
import { parsePos } from '../../partOfSpeech';
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
 * Convert numeral paradigm to CONLLU Token array
 */
export function adaptNumeral(
  word: string,
  xpos: XPOS,
  lemma: IdentifiableString,
): Token[] {
  const variants = parseXPos(xpos);
  const tokens: Token[] = [];

  for (const [upos, baseFeats] of variants) {
    if (upos !== 'NUM' && upos !== 'ADJ' && upos !== 'NOUN') continue;

    const posInfo = parsePos(xpos);
    if (posInfo.name !== 'numeral') continue;

    // declensionNumeral takes "numeralType" which is mapped from posInfo.type
    const paradigm = declensionNumeral(word, posInfo.type);

    if (!paradigm) {
      // Fallback if no paradigm found
      tokens.push({
        token: word,
        upos,
        xpos,
        lemma,
        feats: baseFeats,
      });
      continue;
    }

    // Case mapping
    const caseMap: Record<string, Features.Case> = {
      nom: 'Nom',
      acc: 'Acc',
      gen: 'Gen',
      dat: 'Dat',
      ins: 'Ins',
      loc: 'Loc',
    };

    // Helper to add tokens
    const addTokens = (formString: string | null, feats: TokenFeatures) => {
      if (!formString) return;

      const variants = formString
        .split('/')
        .map((s) => s.trim())
        .filter(Boolean);

      for (const variant of variants) {
        // Clean up parentheses if any
        const cleanVariant = variant.replace(/[()]/g, '').trim();
        if (!cleanVariant) continue;

        tokens.push({
          token: cleanVariant,
          upos,
          xpos,
          lemma,
          feats: { ...baseFeats, ...feats },
        });
      }
    };

    // Callback for animacy helpers
    const createToken = (form: string, feats: TokenFeatures) => {
      tokens.push({
        token: form,
        upos,
        xpos,
        lemma,
        feats: { ...baseFeats, ...feats },
      });
    };

    if (paradigm.type === 'noun') {
      // Noun-like numerals (e.g. "sto", "tysęć")
      // cases: { nom: [...], ... }

      const hasSingularAndPlural =
        paradigm.columns?.includes('singular') &&
        paradigm.columns?.includes('plural');
      const isPluralOnly =
        paradigm.columns?.length === 1 && paradigm.columns[0] === 'plural';

      // Determine gender
      let gender: Features.Gender | undefined;

      // Logic replicated from declensionNumeral to avoid modifying it
      if (posInfo.type === 'fractional' || posInfo.type === 'substantivized') {
        gender = 'Fem';
      } else if (posInfo.type === 'cardinal') {
        const latinWord = transliterate(word, 'isv-Latn');
        if (latinWord === 'nula') {
          gender = 'Fem';
        } else if (latinWord === 'sto' || latinWord.endsWith('sto')) {
          gender = 'Neut';
        } else if (latinWord.match(/[tm]$/)) {
          gender = 'Fem';
        } else if (latinWord.match(/[nd]$/)) {
          gender = 'Masc';
        }
      }

      if (paradigm.cases) {
        for (const [caseName, forms] of Object.entries(paradigm.cases)) {
          const conlluCase = caseMap[caseName];
          if (!conlluCase) continue;

          if (hasSingularAndPlural) {
            addTokens(forms[0], {
              Case: conlluCase,
              Number: 'Sing',
              ...(gender ? { Gender: gender } : {}),
            });
            addTokens(forms[1], {
              Case: conlluCase,
              Number: 'Plur',
              ...(gender ? { Gender: gender } : {}),
            });
          } else {
            const feat: TokenFeatures = { Case: conlluCase };
            if (gender) feat.Gender = gender;

            // Infer Number
            if (isPluralOnly) {
              feat.Number = 'Plur';
            } else if (paradigm.columns?.includes('singular')) {
              feat.Number = 'Sing';
            }

            // For basic cardinals like "dva", "tri", they are plural grammatically but
            // usually tagged just as NumType=Card.
            // "tri" -> plural columns.

            forms.forEach((form: string) => addTokens(form, feat));
          }
        }
      }
    } else if (paradigm.type === 'adjective') {
      // Adjective-like numerals (e.g. ordinals, "jedin")

      // Pre-extract nom and gen forms for animacy comparison if available
      let nomMascForms: string[] = [];
      let genMascForms: string[] = [];
      if (paradigm.casesSingular) {
        nomMascForms = normalizeForm(paradigm.casesSingular.nom[0]);
        genMascForms = normalizeForm(paradigm.casesSingular.gen[0]);
      }

      if (paradigm.casesSingular) {
        for (const [caseName, forms] of Object.entries(
          paradigm.casesSingular,
        )) {
          const conlluCase = caseMap[caseName];
          if (!conlluCase) continue;

          if (caseName === 'acc') {
            // Masculine accusative: distinguish animacy
            const accMascForms = normalizeForm(forms[0]);
            expandSingularMasculineAccusative(
              accMascForms,
              nomMascForms,
              genMascForms,
              { Number: 'Sing', Gender: 'Masc', Case: conlluCase },
              createToken,
            );
            // Neut/Fem
            addTokens(forms[1], {
              Case: conlluCase,
              Number: 'Sing',
              Gender: 'Neut',
            });
            addTokens(forms[2], {
              Case: conlluCase,
              Number: 'Sing',
              Gender: 'Fem',
            });
          } else {
            // nom, gen, loc, dat, ins
            addTokens(forms[0], {
              Case: conlluCase,
              Number: 'Sing',
              Gender: 'Masc',
            });
            addTokens(forms[1], {
              Case: conlluCase,
              Number: 'Sing',
              Gender: 'Neut',
            });
            addTokens(forms[2], {
              Case: conlluCase,
              Number: 'Sing',
              Gender: 'Fem',
            });
          }
        }
      }

      if (paradigm.casesPlural) {
        for (const [caseName, forms] of Object.entries(paradigm.casesPlural)) {
          const conlluCase = caseMap[caseName];
          if (!conlluCase) continue;

          // Normalize forms to check for identity
          const mascForms = normalizeForm(forms[0]);
          const neutFemForms = normalizeForm(forms[1]);

          // Check if all genders have the same form
          const allFormsSame =
            mascForms.length === 1 &&
            neutFemForms.length === 1 &&
            mascForms[0] === neutFemForms[0];

          if (
            allFormsSame &&
            (caseName === 'gen' ||
              caseName === 'loc' ||
              caseName === 'dat' ||
              caseName === 'ins')
          ) {
            // All genders identical for gen/loc/dat/ins - collapse without Gender
            addTokens(forms[0], { Case: conlluCase, Number: 'Plur' });
          } else if (caseName === 'nom' || caseName === 'acc') {
            // For nom/acc, handle Masc separately (may have Anim/Inan distinction)
            expandPluralMasculine(
              mascForms,
              { Number: 'Plur', Gender: 'Masc', Case: conlluCase },
              createToken,
            );

            // Always generate distinct tokens for Neut and Fem
            if (neutFemForms.length === 1) {
              addTokens(forms[1], {
                Case: conlluCase,
                Number: 'Plur',
                Gender: 'Neut',
              });
              addTokens(forms[1], {
                Case: conlluCase,
                Number: 'Plur',
                Gender: 'Fem',
              });
            } else {
              addTokens(forms[1], {
                Case: conlluCase,
                Number: 'Plur',
                Gender: 'Neut',
              });
              addTokens(forms[1], {
                Case: conlluCase,
                Number: 'Plur',
                Gender: 'Fem',
              });
            }
          } else {
            // gen/loc/dat/ins with different forms - keep Gender
            addTokens(forms[0], {
              Case: conlluCase,
              Number: 'Plur',
              Gender: 'Masc',
            });
            addTokens(forms[1], {
              Case: conlluCase,
              Number: 'Plur',
              Gender: 'Neut',
            });
            addTokens(forms[1], {
              Case: conlluCase,
              Number: 'Plur',
              Gender: 'Fem',
            });
          }
        }
      }
    }
  }

  return tokens;
}
