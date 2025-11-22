import { TokenFeatures } from '../schema';

export type CreateTokenCallback = (
  form: string,
  features: TokenFeatures,
) => void;

/**
 * Expands singular masculine accusative forms handling animacy distinction.
 * Checks if the accusative form matches the genitive (Animate) or nominative (Inanimate) form.
 */
export function expandSingularMasculineAccusative(
  accForms: string[],
  nomForms: string[],
  genForms: string[],
  baseFeatures: TokenFeatures,
  createToken: CreateTokenCallback,
) {
  for (const accForm of accForms) {
    // Check if this form matches genitive (animate) or nominative (inanimate)
    const matchesGen = genForms.some((genForm) => genForm === accForm);
    const matchesNom = nomForms.some((nomForm) => nomForm === accForm);

    if (matchesGen) {
      createToken(accForm, {
        ...baseFeatures,
        Animacy: 'Anim',
      });
    } else if (matchesNom) {
      createToken(accForm, {
        ...baseFeatures,
        Animacy: 'Inan',
      });
    } else {
      // If it matches neither (shouldn't happen for standard adjectives, but handle gracefully)
      createToken(accForm, {
        ...baseFeatures,
      });
    }
  }
}

/**
 * Expands plural masculine forms handling animacy distinction.
 * Assumes that if there are two forms, the first is Animate and the second is Inanimate.
 * If there is one form, it applies to both (so no Animate feature is added, or it's underspecified).
 */
export function expandPluralMasculine(
  forms: string[],
  baseFeatures: TokenFeatures,
  createToken: CreateTokenCallback,
) {
  if (forms.length === 2) {
    // First is Anim, Second is Inan
    createToken(forms[0], {
      ...baseFeatures,
      Animacy: 'Anim',
    });
    createToken(forms[1], {
      ...baseFeatures,
      Animacy: 'Inan',
    });
  } else if (forms.length === 1) {
    // Single form implies both / underspecified
    createToken(forms[0], {
      ...baseFeatures,
    });
  }
}
