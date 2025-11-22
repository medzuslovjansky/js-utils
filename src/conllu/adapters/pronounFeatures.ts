import { TokenFeatures } from '../schema';

/**
 * Lemma-specific feature overrides for pronouns.
 * These features override those derived from XPOS tags.
 *
 * This handles cases where the dictionary XPOS might be too generic (e.g. "pron.indef.")
 * but we know the specific CoNLL-U type (e.g. "PronType=Tot").
 */
export const PRONOUN_FEATURE_OVERRIDES: Record<string, TokenFeatures> = {
  // Negative pronouns
  // Dictionary often labels them as 'pron.indef.', so we override to 'Neg'
  nikto: { PronType: 'Neg' },
  ničto: { PronType: 'Neg' },
  nijedin: { PronType: 'Neg' },
  žadėn: { PronType: 'Neg' },
  nikaky: { PronType: 'Neg' },
  ničij: { PronType: 'Neg', Poss: 'Yes' },
  nikde: { PronType: 'Neg' },
  nikogda: { PronType: 'Neg' },

  // Universal/Total pronouns
  // vėś is handled here because XPOS might be pron.indef (defaults to PronType=Ind)
  vse: { PronType: 'Tot' },
  vś: { PronType: 'Tot' },
  veś: { PronType: 'Tot' },
  vsi: { PronType: 'Tot' },
  každy: { PronType: 'Tot' },
  vśak: { PronType: 'Tot' },
  vśaky: { PronType: 'Tot' },

  // Possessive pronouns
  // Basic features (PronType, Poss) come from XPOS 'pron.poss.'
  // We only add specific possessor features here.
  moj: { Person: '1', 'Number[psor]': 'Sing' },
  naš: { Person: '1', 'Number[psor]': 'Plur' },
  tvoj: { Person: '2', 'Number[psor]': 'Sing' },
  vaš: { Person: '2', 'Number[psor]': 'Plur' },

  // 3rd person possessives
  jego: {
    Person: '3',
    'Gender[psor]': 'Masc,Neut',
    'Number[psor]': 'Sing',
    Uninflect: 'Yes',
  },
  jegov: {
    Person: '3',
    'Gender[psor]': 'Masc,Neut',
    'Number[psor]': 'Sing',
    Variant: 'Long',
  },
  jej: {
    Person: '3',
    'Gender[psor]': 'Fem',
    'Number[psor]': 'Sing',
    Uninflect: 'Yes',
  },
  jejin: {
    Person: '3',
    'Gender[psor]': 'Fem',
    'Number[psor]': 'Sing',
    Variant: 'Long',
  },
  jih: { Person: '3', 'Number[psor]': 'Plur', Uninflect: 'Yes' },
  jihny: { Person: '3', 'Number[psor]': 'Plur', Variant: 'Long' },

  // Reflexive possessive
  svoj: { Reflex: 'Yes' },

  // Interrogative/Relative (often ambiguous, but we can set defaults or corrections)
  kto: { Animacy: 'Anim' },
  čto: { Animacy: 'Inan' },
};
