import type { TokenFeatures } from '@interslavic/conllu';

type Form = {
  token: string;
  feats: TokenFeatures;
};

type Paradigm = {
  forms?: Form[];
  upos: 'NUM';
  feats?: TokenFeatures;
};

export const NUMERAL_HARDCODED_PARADIGMS: Record<string, Paradigm> = {
  dva: {
    upos: 'NUM',
    forms: [
      { token: 'dva', feats: { Case: 'Nom', Gender: 'Masc' } },
      { token: 'dvě', feats: { Case: 'Nom', Gender: 'Fem' } },
      { token: 'dva', feats: { Case: 'Nom', Gender: 'Neut' } },
      {
        token: 'dvoh',
        feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Anim' },
      },
      { token: 'dva', feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Inan' } },
      { token: 'dva', feats: { Case: 'Acc', Gender: 'Neut' } },
      { token: 'dvě', feats: { Case: 'Acc', Gender: 'Fem' } },
      { token: 'dvoh', feats: { Case: 'Gen' } },
      { token: 'dvom', feats: { Case: 'Dat' } },
      { token: 'dvoma', feats: { Case: 'Ins' } },
      { token: 'dvoh', feats: { Case: 'Loc' } },
    ],
    feats: { NumType: 'Card' },
  },

  oba: {
    upos: 'NUM',
    forms: [
      { token: 'oba', feats: { Case: 'Nom', Gender: 'Masc' } },
      { token: 'obě', feats: { Case: 'Nom', Gender: 'Fem' } },
      { token: 'obě', feats: { Case: 'Nom', Gender: 'Neut' } },
      {
        token: 'oboh',
        feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Anim' },
      },
      { token: 'oba', feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Inan' } },
      { token: 'obě', feats: { Case: 'Acc', Gender: 'Neut' } },
      { token: 'obě', feats: { Case: 'Acc', Gender: 'Fem' } },
      { token: 'oboh', feats: { Case: 'Gen' } },
      { token: 'obom', feats: { Case: 'Dat' } },
      { token: 'oboma', feats: { Case: 'Ins' } },
      { token: 'oboh', feats: { Case: 'Loc' } },
    ],
    feats: { NumType: 'Card' },
  },

  obadva: {
    upos: 'NUM',
    forms: [
      { token: 'obadva', feats: { Case: 'Nom', Gender: 'Masc' } },
      { token: 'obadvě', feats: { Case: 'Nom', Gender: 'Fem' } },
      { token: 'obadvě', feats: { Case: 'Nom', Gender: 'Neut' } },
      {
        token: 'obadvoh',
        feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Anim' },
      },
      {
        token: 'obadva',
        feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Inan' },
      },
      { token: 'obadvě', feats: { Case: 'Acc', Gender: 'Neut' } },
      { token: 'obadvě', feats: { Case: 'Acc', Gender: 'Fem' } },
      { token: 'obadvoh', feats: { Case: 'Gen' } },
      { token: 'obadvom', feats: { Case: 'Dat' } },
      { token: 'obadvoma', feats: { Case: 'Ins' } },
      { token: 'obadvoh', feats: { Case: 'Loc' } },
    ],
    feats: { NumType: 'Card' },
  },

  obydva: {
    upos: 'NUM',
    forms: [
      { token: 'obydva', feats: { Case: 'Nom', Gender: 'Masc' } },
      { token: 'obydvě', feats: { Case: 'Nom', Gender: 'Fem' } },
      { token: 'obydvě', feats: { Case: 'Nom', Gender: 'Neut' } },
      {
        token: 'obydvoh',
        feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Anim' },
      },
      {
        token: 'obydva',
        feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Inan' },
      },
      { token: 'obydvě', feats: { Case: 'Acc', Gender: 'Neut' } },
      { token: 'obydvě', feats: { Case: 'Acc', Gender: 'Fem' } },
      { token: 'obydvoh', feats: { Case: 'Gen' } },
      { token: 'obydvom', feats: { Case: 'Dat' } },
      { token: 'obydvoma', feats: { Case: 'Ins' } },
      { token: 'obydvoh', feats: { Case: 'Loc' } },
    ],
    feats: { NumType: 'Card' },
  },

  tri: {
    upos: 'NUM',
    forms: [
      { token: 'tri', feats: { Case: 'Nom', Number: 'Plur' } },
      {
        token: 'trěh',
        feats: { Case: 'Acc', Number: 'Plur', Animacy: 'Anim' },
      },
      { token: 'tri', feats: { Case: 'Acc', Number: 'Plur', Animacy: 'Inan' } },
      { token: 'trěh', feats: { Case: 'Gen', Number: 'Plur' } },
      { token: 'trěm', feats: { Case: 'Dat', Number: 'Plur' } },
      { token: 'trěmi', feats: { Case: 'Ins', Number: 'Plur' } },
      { token: 'trěh', feats: { Case: 'Loc', Number: 'Plur' } },
    ],
    feats: { NumType: 'Card' },
  },

  četyri: {
    upos: 'NUM',
    forms: [
      { token: 'četyri', feats: { Case: 'Nom', Number: 'Plur' } },
      {
        token: 'četyrěh',
        feats: { Case: 'Acc', Number: 'Plur', Animacy: 'Anim' },
      },
      {
        token: 'četyri',
        feats: { Case: 'Acc', Number: 'Plur', Animacy: 'Inan' },
      },
      { token: 'četyrěh', feats: { Case: 'Gen', Number: 'Plur' } },
      { token: 'četyrěm', feats: { Case: 'Dat', Number: 'Plur' } },
      { token: 'četyrěmi', feats: { Case: 'Ins', Number: 'Plur' } },
      { token: 'četyrěh', feats: { Case: 'Loc', Number: 'Plur' } },
    ],
    feats: { NumType: 'Card' },
  },

  dvasto: {
    upos: 'NUM',
    feats: { NumType: 'Card', Uninflect: 'Yes' },
  },

  dvěstě: {
    upos: 'NUM',
    forms: [
      { token: 'dvěstě', feats: { Case: 'Nom', Number: 'Plur' } },
      { token: 'dvěstě', feats: { Case: 'Acc', Number: 'Plur' } },
      { token: 'dvohsȯt', feats: { Case: 'Gen', Number: 'Plur' } },
      { token: 'dvomstam', feats: { Case: 'Dat', Number: 'Plur' } },
      { token: 'dvomastami', feats: { Case: 'Ins', Number: 'Plur' } },
      { token: 'dvohstah', feats: { Case: 'Loc', Number: 'Plur' } },
    ],
    feats: { NumType: 'Card' },
  },

  tristo: {
    upos: 'NUM',
    feats: { NumType: 'Card', Uninflect: 'Yes' },
  },

  trista: {
    upos: 'NUM',
    forms: [
      { token: 'trista', feats: { Case: 'Nom', Number: 'Plur' } },
      { token: 'trista', feats: { Case: 'Acc', Number: 'Plur' } },
      { token: 'trěhsȯt', feats: { Case: 'Gen', Number: 'Plur' } },
      { token: 'trěmstam', feats: { Case: 'Dat', Number: 'Plur' } },
      { token: 'trěmistami', feats: { Case: 'Ins', Number: 'Plur' } },
      { token: 'trěhstah', feats: { Case: 'Loc', Number: 'Plur' } },
    ],
    feats: { NumType: 'Card' },
  },

  četyristi: {
    upos: 'NUM',
    feats: { NumType: 'Card', Uninflect: 'Yes' },
  },

  četyrista: {
    upos: 'NUM',
    forms: [
      { token: 'četyrista', feats: { Case: 'Nom', Number: 'Plur' } },
      { token: 'četyrista', feats: { Case: 'Acc', Number: 'Plur' } },
      { token: 'četyrěhsȯt', feats: { Case: 'Gen', Number: 'Plur' } },
      { token: 'četyrěmstam', feats: { Case: 'Dat', Number: 'Plur' } },
      { token: 'četyrěmistami', feats: { Case: 'Ins', Number: 'Plur' } },
      { token: 'četyrěhstah', feats: { Case: 'Loc', Number: 'Plur' } },
    ],
    feats: { NumType: 'Card' },
  },

  pęťsto: {
    upos: 'NUM',
    feats: { NumType: 'Card', Uninflect: 'Yes' },
  },

  pęťsȯt: {
    upos: 'NUM',
    forms: [
      { token: 'pęťsȯt', feats: { Case: 'Nom', Number: 'Plur' } },
      { token: 'pęťsȯt', feats: { Case: 'Acc', Number: 'Plur' } },
      { token: 'pętisȯt', feats: { Case: 'Gen', Number: 'Plur' } },
      { token: 'pętistam', feats: { Case: 'Dat', Number: 'Plur' } },
      { token: 'pęťjųstami', feats: { Case: 'Ins', Number: 'Plur' } },
      { token: 'pętistah', feats: { Case: 'Loc', Number: 'Plur' } },
    ],
    feats: { NumType: 'Card' },
  },

  šesťsto: {
    upos: 'NUM',
    feats: { NumType: 'Card', Uninflect: 'Yes' },
  },

  šesťsȯt: {
    upos: 'NUM',
    forms: [
      { token: 'šesťsȯt', feats: { Case: 'Nom', Number: 'Plur' } },
      { token: 'šesťsȯt', feats: { Case: 'Acc', Number: 'Plur' } },
      { token: 'šesťsȯt', feats: { Case: 'Gen', Number: 'Plur' } },
      { token: 'šestistam', feats: { Case: 'Dat', Number: 'Plur' } },
      { token: 'šesťjųstami', feats: { Case: 'Ins', Number: 'Plur' } },
      { token: 'šestistah', feats: { Case: 'Loc', Number: 'Plur' } },
    ],
    feats: { NumType: 'Card' },
  },

  sedmsto: {
    upos: 'NUM',
    feats: { NumType: 'Card', Uninflect: 'Yes' },
  },

  sedmsȯt: {
    upos: 'NUM',
    forms: [
      { token: 'sedmsȯt', feats: { Case: 'Nom', Number: 'Plur' } },
      { token: 'sedmsȯt', feats: { Case: 'Acc', Number: 'Plur' } },
      { token: 'sedmsȯt', feats: { Case: 'Gen', Number: 'Plur' } },
      { token: 'sedmistam', feats: { Case: 'Dat', Number: 'Plur' } },
      { token: 'sedmjųstami', feats: { Case: 'Ins', Number: 'Plur' } },
      { token: 'sedmistah', feats: { Case: 'Loc', Number: 'Plur' } },
    ],
    feats: { NumType: 'Card' },
  },

  osmsto: {
    upos: 'NUM',
    feats: { NumType: 'Card', Uninflect: 'Yes' },
  },

  osmsȯt: {
    upos: 'NUM',
    forms: [
      { token: 'osmsȯt', feats: { Case: 'Nom', Number: 'Plur' } },
      { token: 'osmsȯt', feats: { Case: 'Acc', Number: 'Plur' } },
      { token: 'osmsȯt', feats: { Case: 'Gen', Number: 'Plur' } },
      { token: 'osmistam', feats: { Case: 'Dat', Number: 'Plur' } },
      { token: 'osmjųstami', feats: { Case: 'Ins', Number: 'Plur' } },
      { token: 'osmistah', feats: { Case: 'Loc', Number: 'Plur' } },
    ],
    feats: { NumType: 'Card' },
  },

  devęťsto: {
    upos: 'NUM',
    feats: { NumType: 'Card', Uninflect: 'Yes' },
  },

  devęťsȯt: {
    upos: 'NUM',
    forms: [
      { token: 'devęťsȯt', feats: { Case: 'Nom', Number: 'Plur' } },
      { token: 'devęťsȯt', feats: { Case: 'Acc', Number: 'Plur' } },
      { token: 'devęťsȯt', feats: { Case: 'Gen', Number: 'Plur' } },
      { token: 'devętistam', feats: { Case: 'Dat', Number: 'Plur' } },
      { token: 'devęťjųstami', feats: { Case: 'Ins', Number: 'Plur' } },
      { token: 'devętistah', feats: { Case: 'Loc', Number: 'Plur' } },
    ],
    feats: { NumType: 'Card' },
  },

  tysęć: {
    upos: 'NUM',
    forms: [
      {
        token: 'tysęć',
        feats: { Case: 'Nom', Number: 'Sing', Gender: 'Masc' },
      },
      {
        token: 'tysęć',
        feats: { Case: 'Acc', Number: 'Sing', Gender: 'Masc' },
      },
      {
        token: 'tysęća',
        feats: { Case: 'Gen', Number: 'Sing', Gender: 'Masc' },
      },
      {
        token: 'tysęću',
        feats: { Case: 'Dat', Number: 'Sing', Gender: 'Masc' },
      },
      {
        token: 'tysęćem',
        feats: { Case: 'Ins', Number: 'Sing', Gender: 'Masc' },
      },
      {
        token: 'tysęću',
        feats: { Case: 'Loc', Number: 'Sing', Gender: 'Masc' },
      },

      {
        token: 'tysęće',
        feats: { Case: 'Nom', Number: 'Plur', Gender: 'Masc' },
      },
      {
        token: 'tysęće',
        feats: { Case: 'Acc', Number: 'Plur', Gender: 'Masc', Animacy: 'Inan' },
      },
      {
        token: 'tysęćev',
        feats: { Case: 'Gen', Number: 'Plur', Gender: 'Masc' },
      },
      {
        token: 'tysęćam',
        feats: { Case: 'Dat', Number: 'Plur', Gender: 'Masc' },
      },
      {
        token: 'tysęćami',
        feats: { Case: 'Ins', Number: 'Plur', Gender: 'Masc' },
      },
      {
        token: 'tysęćah',
        feats: { Case: 'Loc', Number: 'Plur', Gender: 'Masc' },
      },

      { token: 'tysęć', feats: { Case: 'Nom', Number: 'Sing', Gender: 'Fem' } },
      { token: 'tysęć', feats: { Case: 'Acc', Number: 'Sing', Gender: 'Fem' } },
      {
        token: 'tysęći',
        feats: { Case: 'Gen', Number: 'Sing', Gender: 'Fem' },
      },
      {
        token: 'tysęći',
        feats: { Case: 'Dat', Number: 'Sing', Gender: 'Fem' },
      },
      {
        token: 'tysęćjų',
        feats: { Case: 'Ins', Number: 'Sing', Gender: 'Fem' },
      },
      {
        token: 'tysęći',
        feats: { Case: 'Loc', Number: 'Sing', Gender: 'Fem' },
      },

      {
        token: 'tysęći',
        feats: { Case: 'Nom', Number: 'Plur', Gender: 'Fem' },
      },
      {
        token: 'tysęći',
        feats: { Case: 'Acc', Number: 'Plur', Gender: 'Fem' },
      },
      {
        token: 'tysęćij',
        feats: { Case: 'Gen', Number: 'Plur', Gender: 'Fem' },
      },
      {
        token: 'tysęćam',
        feats: { Case: 'Dat', Number: 'Plur', Gender: 'Fem' },
      },
      {
        token: 'tysęćami',
        feats: { Case: 'Ins', Number: 'Plur', Gender: 'Fem' },
      },
      {
        token: 'tysęćah',
        feats: { Case: 'Loc', Number: 'Plur', Gender: 'Fem' },
      },
    ],
    feats: { NumType: 'Card' },
  },
};
