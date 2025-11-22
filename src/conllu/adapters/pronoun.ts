import { declensionPronoun } from '../../pronoun/declensionPronoun';
import { parsePos } from '../../partOfSpeech';
import {
  Features,
  Token,
  IdentifiableString,
  XPOS,
  TokenFeatures,
} from '../schema';
import { parseXPos } from '../parseXPOS';
import { PRONOUN_FEATURE_OVERRIDES } from './pronounFeatures';
import { normalizeForm } from './utils';
import {
  expandSingularMasculineAccusative,
  expandPluralMasculine,
} from './animacy';

/**
 * Convert pronoun paradigm to CONLLU Token array
 */
export function adaptPronoun(
  word: string,
  xpos: XPOS,
  lemma: IdentifiableString,
): Token[] {
  const posInfo = parsePos(xpos);
  if (posInfo.name !== 'pronoun') {
    return [];
  }

  const variants = parseXPos(xpos);
  const tokens: Token[] = [];

  // Check for feature overrides for this lemma
  const lemmaOverrides = PRONOUN_FEATURE_OVERRIDES[word] || {};

  // Since we might have multiple variants (though unlikely for pronouns in this context),
  // we iterate. Usually pronouns have a single entry.
  for (const [upos, baseFeats] of variants) {
    if (upos !== 'PRON' && upos !== 'DET') continue;

    // Use simple declension interface which handles type internally
    const paradigm = declensionPronoun(word, posInfo.type);

    if (!paradigm) {
      // Fallback if no paradigm found
      tokens.push({
        token: word,
        upos,
        xpos,
        lemma,
        feats: { ...baseFeats, ...lemmaOverrides },
      });
      continue;
    }

    // For personal pronouns, determine Person, Number, and Gender from lemma
    let person: Features.Person | null = null;
    const filterNumber: 'Sing' | 'Plur' | null = null;
    const filterGender: 'Masc' | 'Fem' | 'Neut' | null = null;

    // Apply overrides to base features
    const effectiveBaseFeats = { ...baseFeats, ...lemmaOverrides };

    // If override specifies Person/Number/Gender, use them for filtering if needed
    if (lemmaOverrides.Person)
      person = lemmaOverrides.Person as Features.Person;
    // We don't strictly filter by Number/Gender from overrides unless we implement that logic,
    // but the current implementation mostly relies on the paradigm structure.
    // However, for "one" (they fem/neut), we might need special handling.

    // Case mapping
    const caseMap: Record<string, Features.Case> = {
      nom: 'Nom',
      acc: 'Acc',
      gen: 'Gen',
      dat: 'Dat',
      ins: 'Ins',
      loc: 'Loc',
    };

    // Helper to add tokens, handling alternatives (slash separated) and parentheses
    const addTokens = (formString: string | null, feats?: TokenFeatures) => {
      if (!formString) return;

      // Filter check for personal pronouns - Number
      if (filterNumber && feats?.Number && feats?.Number !== filterNumber) {
        return; // Skip this form as it doesn't match the lemma's number
      }

      // Filter check for personal pronouns - Gender (for 3rd person)
      if (filterGender && feats?.Gender && feats?.Gender !== filterGender) {
        return; // Skip this form as it doesn't match the lemma's gender
      }

      // Add Person feature if set
      if (person) {
        feats = { ...feats, Person: person };
      }

      // Merge with effective base features (overrides have priority over XPOS, but form-specific feats have highest priority)
      const finalFeats = { ...effectiveBaseFeats, ...feats };

      // We need to handle "variant1 / variant2"
      // Use normalizeForm to split and clean
      const variants = normalizeForm(formString);

      for (const variant of variants) {
        // Check for "(n)form" pattern first - bound form after preposition
        // Example: "(n)jego" -> "jego" (base) and "njego" (bound)
        if (variant.startsWith('(n)')) {
          const baseForm = variant.substring(3); // Remove "(n)"

          // Check if baseForm also has trailing short form like "jego (go)"
          const trailingShortMatch = baseForm.match(/^(.+?)\s*\((.+?)\)$/);
          let mainForm = baseForm;
          let shortForm: string | null = null;

          if (trailingShortMatch) {
            mainForm = trailingShortMatch[1].trim();
            shortForm = trailingShortMatch[2].trim();
          }

          // Add base form (without n)
          tokens.push({
            token: mainForm,
            upos,
            xpos,
            lemma,
            feats: { ...finalFeats },
          });

          // Add bound form (with n prefix)
          tokens.push({
            token: 'n' + mainForm,
            upos,
            xpos,
            lemma,
            feats: { ...finalFeats, Variant: 'Bound' },
          });

          // Add short form if present
          if (shortForm) {
            tokens.push({
              token: shortForm,
              upos,
              xpos,
              lemma,
              feats: { ...finalFeats, Variant: 'Short' },
            });
          }
          continue;
        }

        // Check for "main (short)" pattern
        // Example: "mene (mę)" -> main="mene", short="mę"
        const parenMatch = variant.match(/^(.+)\s*\((.+)\)$/);

        if (parenMatch) {
          const mainForm = parenMatch[1].trim();
          const shortForm = parenMatch[2].trim();

          // Add main form
          tokens.push({
            token: mainForm,
            upos,
            xpos,
            lemma,
            feats: { ...finalFeats },
          });

          // Add short form with Variant=Short
          tokens.push({
            token: shortForm,
            upos,
            xpos,
            lemma,
            feats: { ...finalFeats, Variant: 'Short' },
          });
        } else {
          // Plain word, just clean parentheses if any
          const clean = variant.replace(/[()]/g, '');
          if (!clean) continue;

          tokens.push({
            token: clean,
            upos,
            xpos,
            lemma,
            feats: { ...finalFeats },
          });
        }
      }
    };

    // Callback for animacy helpers - similar to addTokens but simpler as forms are already normalized/split
    // But wait, addTokens handles complex cases like (n) prefix which might occur in pronouns.
    // Animacy helpers call back with a single form string.
    // So we should route it through a simplified version of addTokens or just handle basic token addition.
    // For pronouns, "expandSingularMasculineAccusative" receives normalized forms.
    // So we just need to add them.
    // However, we should ensure we don't lose the logic for "Person" and overrides.
    const createToken = (form: string, feats: TokenFeatures) => {
      // Add Person feature if set
      if (person) {
        feats = { ...feats, Person: person };
      }
      const finalFeats = { ...effectiveBaseFeats, ...feats };

      tokens.push({
        token: form,
        upos,
        xpos,
        lemma,
        feats: finalFeats,
      });
    };

    if (paradigm.type === 'noun') {
      // Noun-like pronouns (personal, reflexive, some indefinite)

      // Special handling for indeclinable possessives (jih, jej, jego)
      // These are returned as 'noun' type by declensionPronoun but should not be declined
      if (posInfo.type === 'possessive') {
        addTokens(word);
        continue;
      }

      const hasSingularAndPlural =
        paradigm.columns?.includes('singular') &&
        paradigm.columns?.includes('plural');

      if (paradigm.cases) {
        for (const [caseName, forms] of Object.entries(paradigm.cases)) {
          const conlluCase = caseMap[caseName];
          if (!conlluCase) continue;

          // forms is string[]
          if (hasSingularAndPlural) {
            addTokens(forms[0], { Case: conlluCase, Number: 'Sing' });
            addTokens(forms[1], { Case: conlluCase, Number: 'Plur' });
          } else {
            const feat: TokenFeatures = { Case: conlluCase };

            // Use Number from overrides if available, otherwise infer from columns
            if (lemmaOverrides.Number) {
              feat.Number = lemmaOverrides.Number;
            } else if (paradigm.columns?.includes('plural')) {
              feat.Number = 'Plur';
            } else if (paradigm.columns?.includes('singular')) {
              feat.Number = 'Sing';
            }

            // Special handling for reflexive 'sebe' - usually no Number in UD for Slavic if it applies to all
            if (effectiveBaseFeats.Reflex === 'Yes') {
              delete feat.Number;
            }

            forms.forEach((form: string) => addTokens(form, feat));
          }
        }
      }
    } else if (paradigm.type === 'adjective') {
      // Adjective-like pronouns (possessive, demonstrative, etc.)

      // Pre-extract nom and gen forms for animacy comparison
      let nomMascForms: string[] = [];
      let genMascForms: string[] = [];
      if (paradigm.casesSingular) {
        // Handle potential multiple forms in nom/gen
        nomMascForms = normalizeForm(paradigm.casesSingular.nom[0]);
        genMascForms = normalizeForm(paradigm.casesSingular.gen[0]);
      }

      if (paradigm.casesSingular) {
        for (const [caseName, forms] of Object.entries(
          paradigm.casesSingular,
        )) {
          const conlluCase = caseMap[caseName];
          if (!conlluCase) continue;

          if (caseName === 'acc' && forms.length >= 1) {
            // Try to apply animacy expansion
            // forms[0] is Masc
            const accMascForms = normalizeForm(forms[0]);
            expandSingularMasculineAccusative(
              accMascForms,
              nomMascForms,
              genMascForms,
              { Number: 'Sing', Gender: 'Masc', Case: conlluCase },
              createToken,
            );

            // Add other genders
            if (forms.length >= 2) {
              addTokens(forms[1], {
                Case: conlluCase,
                Number: 'Sing',
                Gender: 'Neut',
              });
            }
            if (forms.length >= 3) {
              addTokens(forms[2], {
                Case: conlluCase,
                Number: 'Sing',
                Gender: 'Fem',
              });
            } else if (forms.length === 2) {
              // if only 2, usually [Masc/Neut, Fem] or [Masc, Fem/Neut]
              // Standard expectation:
              // length 3: [Masc, Neut, Fem]
              // length 2: [Masc, Fem/Neut] (Neut same as Fem? or Masc?)
              // Actually original code:
              /*
                    } else if (forms.length === 2) {
                        addTokens(forms[0], { ... Gender: 'Masc' });
                        addTokens(forms[0], { ... Gender: 'Neut' });
                        addTokens(forms[1], { ... Gender: 'Fem' });
                    }
                    */
              // Wait, original code for length 2 used forms[0] for Masc AND Neut.
              // So if I use expandSingularMasculineAccusative for forms[0], I handle Masc.
              // I should also add Neut using forms[0] (without animacy).

              if (forms.length === 2) {
                // Masc handled by expand...
                // Neut (same as Masc form in original logic)
                addTokens(forms[0], {
                  Case: conlluCase,
                  Number: 'Sing',
                  Gender: 'Neut',
                });
                // Fem
                addTokens(forms[1], {
                  Case: conlluCase,
                  Number: 'Sing',
                  Gender: 'Fem',
                });
              }
            }
            continue;
          }

          // [Masc, Neut, Fem] or [Masc/Neut, Fem]
          if (forms.length === 3) {
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
          } else if (forms.length === 2) {
            addTokens(forms[0], {
              Case: conlluCase,
              Number: 'Sing',
              Gender: 'Masc',
            });
            addTokens(forms[0], {
              Case: conlluCase,
              Number: 'Sing',
              Gender: 'Neut',
            });
            addTokens(forms[1], {
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
          // [Masc, Fem/Neut] usually

          // For plural, we usually add entries for all genders or combined
          // Since declensionPronoun usually returns [Masc, Fem/Neut], we map them accordingly

          const mascForm = forms[0];
          const femNeutForm = forms[1];

          // If forms are merged (second form missing or same as first),
          // we treat it as a generic plural form applicable to all genders.
          // This avoids tagging "sih" (Gen) as exclusively Masc when it covers all.
          const isMerged = !femNeutForm || mascForm === femNeutForm;

          if (isMerged) {
            addTokens(mascForm, {
              Case: conlluCase,
              Number: 'Plur',
            });
          } else {
            // Split masc form if variants exist (e.g. "si/se" -> "si" Anim, "se" Inan)
            const mascVariants = normalizeForm(mascForm);

            expandPluralMasculine(
              mascVariants,
              { Number: 'Plur', Gender: 'Masc', Case: conlluCase },
              createToken,
            );

            // For Fem/Neut, they share the form in plural usually
            addTokens(femNeutForm, {
              Case: conlluCase,
              Number: 'Plur',
              Gender: 'Neut',
            });
            addTokens(femNeutForm, {
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
