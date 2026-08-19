import type { TokenFeatures } from '@interslavic/conllu';

type Form = {
  token: string;
  feats: TokenFeatures;
};

type Paradigm = {
  forms?: Form[];
  upos: 'AUX' | 'VERB';
  feats?: TokenFeatures;
};

export const VERB_HARDCODED_PARADIGMS: Record<string, Paradigm> = {
  byti: {
    upos: 'AUX',
    forms: [
      { token: 'byti', feats: { VerbForm: 'Inf' } },
      {
        token: 'jesm',
        feats: {
          Mood: 'Ind',
          Number: 'Sing',
          Person: '1',
          Tense: 'Pres',
          VerbForm: 'Fin',
        },
      },
      {
        token: 'sȯm',
        feats: {
          Mood: 'Ind',
          Number: 'Sing',
          Person: '1',
          Tense: 'Pres',
          VerbForm: 'Fin',
          Variant: 'Short',
          Style: 'Vrnc',
        },
      },
      {
        token: 'jesi',
        feats: {
          Mood: 'Ind',
          Number: 'Sing',
          Person: '2',
          Tense: 'Pres',
          VerbForm: 'Fin',
        },
      },
      {
        token: 'si',
        feats: {
          Mood: 'Ind',
          Number: 'Sing',
          Person: '2',
          Tense: 'Pres',
          VerbForm: 'Fin',
          Variant: 'Short',
          Style: 'Vrnc',
        },
      },
      {
        token: 'jest',
        feats: {
          Mood: 'Ind',
          Number: 'Sing',
          Person: '3',
          Tense: 'Pres',
          VerbForm: 'Fin',
        },
      },
      {
        token: 'je',
        feats: {
          Mood: 'Ind',
          Number: 'Sing',
          Person: '3',
          Tense: 'Pres',
          Variant: 'Short',
          VerbForm: 'Fin',
        },
      },
      {
        token: 'jesmo',
        feats: {
          Mood: 'Ind',
          Number: 'Plur',
          Person: '1',
          Tense: 'Pres',
          VerbForm: 'Fin',
        },
      },
      {
        token: 'jeste',
        feats: {
          Mood: 'Ind',
          Number: 'Plur',
          Person: '2',
          Tense: 'Pres',
          VerbForm: 'Fin',
        },
      },
      {
        token: 'sųt',
        feats: {
          Mood: 'Ind',
          Number: 'Plur',
          Person: '3',
          Tense: 'Pres',
          VerbForm: 'Fin',
        },
      },
      {
        token: 'sų',
        feats: {
          Mood: 'Ind',
          Number: 'Plur',
          Person: '3',
          Tense: 'Pres',
          VerbForm: 'Fin',
          Variant: 'Short',
          Style: 'Vrnc',
        },
      },
      {
        token: 'bųdų',
        feats: {
          Mood: 'Ind',
          Number: 'Sing',
          Person: '1',
          Tense: 'Fut',
          VerbForm: 'Fin',
        },
      },
      {
        token: 'bųdeš',
        feats: {
          Mood: 'Ind',
          Number: 'Sing',
          Person: '2',
          Tense: 'Fut',
          VerbForm: 'Fin',
        },
      },
      {
        token: 'bųde',
        feats: {
          Mood: 'Ind',
          Number: 'Sing',
          Person: '3',
          Tense: 'Fut',
          VerbForm: 'Fin',
        },
      },
      {
        token: 'bųdemo',
        feats: {
          Mood: 'Ind',
          Number: 'Plur',
          Person: '1',
          Tense: 'Fut',
          VerbForm: 'Fin',
        },
      },
      {
        token: 'bųdete',
        feats: {
          Mood: 'Ind',
          Number: 'Plur',
          Person: '2',
          Tense: 'Fut',
          VerbForm: 'Fin',
        },
      },
      {
        token: 'bųdųt',
        feats: {
          Mood: 'Ind',
          Number: 'Plur',
          Person: '3',
          Tense: 'Fut',
          VerbForm: 'Fin',
        },
      },
      {
        token: 'běh',
        feats: {
          Mood: 'Ind',
          Number: 'Sing',
          Person: '1',
          Tense: 'Past',
          VerbForm: 'Fin',
          Style: 'Arch',
        },
      },
      {
        token: 'běše',
        feats: {
          Mood: 'Ind',
          Number: 'Sing',
          Person: '2',
          Tense: 'Past',
          VerbForm: 'Fin',
          Style: 'Arch',
        },
      },
      {
        token: 'běše',
        feats: {
          Mood: 'Ind',
          Number: 'Sing',
          Person: '3',
          Tense: 'Past',
          VerbForm: 'Fin',
          Style: 'Arch',
        },
      },
      {
        token: 'běhmo',
        feats: {
          Mood: 'Ind',
          Number: 'Plur',
          Person: '1',
          Tense: 'Past',
          VerbForm: 'Fin',
          Style: 'Arch',
        },
      },
      {
        token: 'běste',
        feats: {
          Mood: 'Ind',
          Number: 'Plur',
          Person: '2',
          Tense: 'Past',
          VerbForm: 'Fin',
          Style: 'Arch',
        },
      },
      {
        token: 'běhų',
        feats: {
          Mood: 'Ind',
          Number: 'Plur',
          Person: '3',
          Tense: 'Past',
          VerbForm: 'Fin',
          Style: 'Arch',
        },
      },
      {
        token: 'bųď',
        feats: { Mood: 'Imp', Number: 'Sing', Person: '2', VerbForm: 'Fin' },
      },
      {
        token: 'bųďmo',
        feats: { Mood: 'Imp', Number: 'Plur', Person: '1', VerbForm: 'Fin' },
      },
      {
        token: 'bųďte',
        feats: { Mood: 'Imp', Number: 'Plur', Person: '2', VerbForm: 'Fin' },
      },
      {
        token: 'byl',
        feats: {
          Gender: 'Masc',
          Number: 'Sing',
          Tense: 'Past',
          VerbForm: 'Part',
          Voice: 'Act',
        },
      },
      {
        token: 'byla',
        feats: {
          Gender: 'Fem',
          Number: 'Sing',
          Tense: 'Past',
          VerbForm: 'Part',
          Voice: 'Act',
        },
      },
      {
        token: 'bylo',
        feats: {
          Gender: 'Neut',
          Number: 'Sing',
          Tense: 'Past',
          VerbForm: 'Part',
          Voice: 'Act',
        },
      },
      {
        token: 'byli',
        feats: {
          Number: 'Plur',
          Tense: 'Past',
          VerbForm: 'Part',
          Voice: 'Act',
        },
      },
    ],
    feats: { VerbForm: 'Inf' },
  },
};
