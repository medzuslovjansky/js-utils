import type { TokenFeatures } from '@interslavic/conllu';

type Form = {
  token: string;
  feats: TokenFeatures;
};

type Paradigm = {
  forms?: Form[];
  upos: 'PRON' | 'DET';
  feats?: TokenFeatures;
};

export const PRONOUN_HARDCODED_PARADIGMS: Record<string, Paradigm> = {
  ja: {
    upos: 'PRON',
    forms: [
      { token: 'ja', feats: { Case: 'Nom' } },
      { token: 'mene', feats: { Case: 'Acc' } },
      { token: 'mę', feats: { Case: 'Acc', Variant: 'Short' } },
      { token: 'mene', feats: { Case: 'Gen' } },
      { token: 'mně', feats: { Case: 'Loc' } },
      { token: 'mně', feats: { Case: 'Dat' } },
      { token: 'mi', feats: { Case: 'Dat', Variant: 'Short' } },
      { token: 'mnojų', feats: { Case: 'Ins' } },
    ],
    feats: { PronType: 'Prs', Person: '1', Number: 'Sing' },
  },

  ty: {
    upos: 'PRON',
    forms: [
      { token: 'ty', feats: { Case: 'Nom' } },
      { token: 'tebe', feats: { Case: 'Acc' } },
      { token: 'tę', feats: { Case: 'Acc', Variant: 'Short' } },
      { token: 'tebe', feats: { Case: 'Gen' } },
      { token: 'tobě', feats: { Case: 'Loc' } },
      { token: 'tobě', feats: { Case: 'Dat' } },
      { token: 'ti', feats: { Case: 'Dat', Variant: 'Short' } },
      { token: 'tobojų', feats: { Case: 'Ins' } },
    ],
    feats: { PronType: 'Prs', Person: '2', Number: 'Sing' },
  },

  on: {
    upos: 'PRON',
    forms: [
      { token: 'on', feats: { Case: 'Nom' } },
      { token: 'jego', feats: { Case: 'Acc', PrepCase: 'Npr' } },
      { token: 'njego', feats: { Case: 'Acc', PrepCase: 'Pre' } },
      { token: 'go', feats: { Case: 'Acc', Variant: 'Short' } },
      { token: 'jego', feats: { Case: 'Gen', PrepCase: 'Npr' } },
      { token: 'njego', feats: { Case: 'Gen', PrepCase: 'Pre' } },
      { token: 'njem', feats: { Case: 'Loc', PrepCase: 'Pre' } },
      { token: 'jemu', feats: { Case: 'Dat', PrepCase: 'Npr' } },
      { token: 'njemu', feats: { Case: 'Dat', PrepCase: 'Pre' } },
      { token: 'mu', feats: { Case: 'Dat', Variant: 'Short' } },
      { token: 'jim', feats: { Case: 'Ins', PrepCase: 'Npr' } },
      { token: 'njim', feats: { Case: 'Ins', PrepCase: 'Pre' } },
    ],
    feats: { PronType: 'Prs', Person: '3', Number: 'Sing', Gender: 'Masc' },
  },

  ono: {
    upos: 'PRON',
    forms: [
      { token: 'ono', feats: { Case: 'Nom' } },
      { token: 'jego', feats: { Case: 'Acc', PrepCase: 'Npr' } },
      { token: 'njego', feats: { Case: 'Acc', PrepCase: 'Pre' } },
      { token: 'go', feats: { Case: 'Acc', Variant: 'Short' } },
      { token: 'jego', feats: { Case: 'Gen', PrepCase: 'Npr' } },
      { token: 'njego', feats: { Case: 'Gen', PrepCase: 'Pre' } },
      { token: 'njem', feats: { Case: 'Loc', PrepCase: 'Pre' } },
      { token: 'jemu', feats: { Case: 'Dat', PrepCase: 'Npr' } },
      { token: 'njemu', feats: { Case: 'Dat', PrepCase: 'Pre' } },
      { token: 'mu', feats: { Case: 'Dat', Variant: 'Short' } },
      { token: 'jim', feats: { Case: 'Ins', PrepCase: 'Npr' } },
      { token: 'njim', feats: { Case: 'Ins', PrepCase: 'Pre' } },
    ],
    feats: { PronType: 'Prs', Person: '3', Number: 'Sing', Gender: 'Neut' },
  },

  ona: {
    upos: 'PRON',
    forms: [
      { token: 'ona', feats: { Case: 'Nom' } },
      { token: 'jų', feats: { Case: 'Acc', PrepCase: 'Npr' } },
      { token: 'njų', feats: { Case: 'Acc', PrepCase: 'Pre' } },
      { token: 'jej', feats: { Case: 'Gen', PrepCase: 'Npr' } },
      { token: 'njej', feats: { Case: 'Gen', PrepCase: 'Pre' } },
      { token: 'njej', feats: { Case: 'Loc', PrepCase: 'Pre' } },
      { token: 'jej', feats: { Case: 'Dat', PrepCase: 'Npr' } },
      { token: 'njej', feats: { Case: 'Dat', PrepCase: 'Pre' } },
      { token: 'jejų', feats: { Case: 'Ins', PrepCase: 'Npr' } },
      { token: 'njejų', feats: { Case: 'Ins', PrepCase: 'Pre' } },
    ],
    feats: { PronType: 'Prs', Person: '3', Number: 'Sing', Gender: 'Fem' },
  },

  my: {
    upos: 'PRON',
    forms: [
      { token: 'my', feats: { Case: 'Nom' } },
      { token: 'nas', feats: { Case: 'Acc' } },
      { token: 'nas', feats: { Case: 'Gen' } },
      { token: 'nas', feats: { Case: 'Loc' } },
      { token: 'nam', feats: { Case: 'Dat' } },
      { token: 'nami', feats: { Case: 'Ins' } },
    ],
    feats: { PronType: 'Prs', Person: '1', Number: 'Plur' },
  },

  vy: {
    upos: 'PRON',
    forms: [
      { token: 'vy', feats: { Case: 'Nom' } },
      { token: 'vas', feats: { Case: 'Acc' } },
      { token: 'vas', feats: { Case: 'Gen' } },
      { token: 'vas', feats: { Case: 'Loc' } },
      { token: 'vam', feats: { Case: 'Dat' } },
      { token: 'vami', feats: { Case: 'Ins' } },
    ],
    feats: { PronType: 'Prs', Person: '2', Number: 'Plur' },
  },

  oni: {
    upos: 'PRON',
    forms: [
      { token: 'oni', feats: { Case: 'Nom' } },
      { token: 'jih', feats: { Case: 'Acc', PrepCase: 'Npr' } },
      { token: 'njih', feats: { Case: 'Acc', PrepCase: 'Pre' } },
      { token: 'jih', feats: { Case: 'Gen', PrepCase: 'Npr' } },
      { token: 'njih', feats: { Case: 'Gen', PrepCase: 'Pre' } },
      { token: 'njih', feats: { Case: 'Loc', PrepCase: 'Pre' } },
      { token: 'jim', feats: { Case: 'Dat', PrepCase: 'Npr' } },
      { token: 'njim', feats: { Case: 'Dat', PrepCase: 'Pre' } },
      { token: 'jimi', feats: { Case: 'Ins', PrepCase: 'Npr' } },
      { token: 'njimi', feats: { Case: 'Ins', PrepCase: 'Pre' } },
    ],
    feats: {
      PronType: 'Prs',
      Person: '3',
      Number: 'Plur',
      Gender: 'Masc',
      Animacy: 'Anim',
    },
  },

  one: {
    upos: 'PRON',
    forms: [
      { token: 'one', feats: { Case: 'Nom' } },
      { token: 'je', feats: { Case: 'Acc', PrepCase: 'Npr' } },
      { token: 'nje', feats: { Case: 'Acc', PrepCase: 'Pre' } },
      { token: 'jih', feats: { Case: 'Gen', PrepCase: 'Npr' } },
      { token: 'njih', feats: { Case: 'Gen', PrepCase: 'Pre' } },
      { token: 'njih', feats: { Case: 'Loc', PrepCase: 'Pre' } },
      { token: 'jim', feats: { Case: 'Dat', PrepCase: 'Npr' } },
      { token: 'njim', feats: { Case: 'Dat', PrepCase: 'Pre' } },
      { token: 'jimi', feats: { Case: 'Ins', PrepCase: 'Npr' } },
      { token: 'njimi', feats: { Case: 'Ins', PrepCase: 'Pre' } },
    ],
    feats: { PronType: 'Prs', Person: '3', Number: 'Plur' },
  },

  sebe: {
    upos: 'PRON',
    forms: [
      { token: 'sebę', feats: { Case: 'Acc' } },
      { token: 'sę', feats: { Case: 'Acc', Variant: 'Short' } },
      { token: 'sebe', feats: { Case: 'Gen' } },
      { token: 'sobě', feats: { Case: 'Loc' } },
      { token: 'sobě', feats: { Case: 'Dat' } },
      { token: 'si', feats: { Case: 'Dat', Variant: 'Short' } },
      { token: 'sobojų', feats: { Case: 'Ins' } },
    ],
    feats: { Reflex: 'Yes', PronType: 'Prs' },
  },
};
