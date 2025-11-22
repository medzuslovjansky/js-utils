import { Token, IdentifiableString, XPOS, TokenFeatures } from '../schema';
import { parseXPos } from '../parseXPOS';

/**
 * Hardcoded forms for personal/reflexive pronouns and auxiliary verbs.
 * One row = one token mapping.
 */

type Form = {
  token: string;
  feats: TokenFeatures;
};

type Paradigm = {
  forms?: Form[];
  upos: 'PRON' | 'DET' | 'AUX' | 'NUM';
  feats?: TokenFeatures; // Shared features applied to all forms
};

// Hardcoded pronoun paradigms
/* eslint-disable */
const HARDCODED_PARADIGMS: Record<string, Paradigm> = {
  // 1st person singular
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

  // 2nd person singular
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

  // 3rd person masculine singular
  on: {
    upos: 'PRON',
    forms: [
      { token: 'on', feats: { Case: 'Nom' } },
      { token: 'jego', feats: { Case: 'Acc' } },
      { token: 'njego', feats: { Case: 'Acc', Variant: 'Bound' } },
      { token: 'go', feats: { Case: 'Acc', Variant: 'Short' } },
      { token: 'jego', feats: { Case: 'Gen' } },
      { token: 'njego', feats: { Case: 'Gen', Variant: 'Bound' } },
      { token: 'njem', feats: { Case: 'Loc' } },
      { token: 'jemu', feats: { Case: 'Dat' } },
      { token: 'njemu', feats: { Case: 'Dat', Variant: 'Bound' } },
      { token: 'mu', feats: { Case: 'Dat', Variant: 'Short' } },
      { token: 'jim', feats: { Case: 'Ins' } },
      { token: 'njim', feats: { Case: 'Ins', Variant: 'Bound' } },
    ],
    feats: { PronType: 'Prs', Person: '3', Number: 'Sing', Gender: 'Masc' },
  },

  // 3rd person neuter singular
  ono: {
    upos: 'PRON',
    forms: [
      { token: 'ono', feats: { Case: 'Nom' } },
      { token: 'jego', feats: { Case: 'Acc' } },
      { token: 'njego', feats: { Case: 'Acc', Variant: 'Bound' } },
      { token: 'go', feats: { Case: 'Acc', Variant: 'Short' } },
      { token: 'jej', feats: { Case: 'Gen' } },
      { token: 'njej', feats: { Case: 'Gen', Variant: 'Bound' } },
      { token: 'jej', feats: { Case: 'Loc' } },
      { token: 'njej', feats: { Case: 'Loc', Variant: 'Bound' } },
      { token: 'jej', feats: { Case: 'Dat' } },
      { token: 'njej', feats: { Case: 'Dat', Variant: 'Bound' } },
      { token: 'jejų', feats: { Case: 'Ins' } },
      { token: 'njejų', feats: { Case: 'Ins', Variant: 'Bound' } },
    ],
    feats: { PronType: 'Prs', Person: '3', Number: 'Sing', Gender: 'Neut' },
  },

  // 3rd person feminine singular
  ona: {
    upos: 'PRON',
    forms: [
      { token: 'ona', feats: { Case: 'Nom' } },
      { token: 'jų', feats: { Case: 'Acc' } },
      { token: 'njų', feats: { Case: 'Acc', Variant: 'Bound' } },
      { token: 'jej', feats: { Case: 'Gen' } },
      { token: 'njej', feats: { Case: 'Gen', Variant: 'Bound' } },
      { token: 'jej', feats: { Case: 'Loc' } },
      { token: 'njej', feats: { Case: 'Loc', Variant: 'Bound' } },
      { token: 'jej', feats: { Case: 'Dat' } },
      { token: 'njej', feats: { Case: 'Dat', Variant: 'Bound' } },
      { token: 'jejų', feats: { Case: 'Ins' } },
      { token: 'njejų', feats: { Case: 'Ins', Variant: 'Bound' } },
    ],
    feats: { PronType: 'Prs', Person: '3', Number: 'Sing', Gender: 'Fem' },
  },

  // 1st person plural
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

  // 2nd person plural
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

  // 3rd person masculine animate plural
  oni: {
    upos: 'PRON',
    forms: [
      { token: 'oni', feats: { Case: 'Nom' } },
      { token: 'jih', feats: { Case: 'Acc' } },
      { token: 'njih', feats: { Case: 'Acc', Variant: 'Bound' } },
      { token: 'jih', feats: { Case: 'Gen' } },
      { token: 'njih', feats: { Case: 'Gen', Variant: 'Bound' } },
      { token: 'jih', feats: { Case: 'Loc' } },
      { token: 'njih', feats: { Case: 'Loc', Variant: 'Bound' } },
      { token: 'jim', feats: { Case: 'Dat' } },
      { token: 'njim', feats: { Case: 'Dat', Variant: 'Bound' } },
      { token: 'jimi', feats: { Case: 'Ins' } },
      { token: 'njimi', feats: { Case: 'Ins', Variant: 'Bound' } },
    ],
    feats: { PronType: 'Prs', Person: '3', Gender: 'Masc', Animacy: 'Anim' },
  },

  // 3rd person feminine/neuter plural (no gender specified)
  one: {
    upos: 'PRON',
    forms: [
      { token: 'one', feats: { Case: 'Nom' } },
      { token: 'je', feats: { Case: 'Acc' } },
      { token: 'nje', feats: { Case: 'Acc', Variant: 'Bound' } },
      { token: 'jih', feats: { Case: 'Gen' } },
      { token: 'njih', feats: { Case: 'Gen', Variant: 'Bound' } },
      { token: 'jih', feats: { Case: 'Loc' } },
      { token: 'njih', feats: { Case: 'Loc', Variant: 'Bound' } },
      { token: 'jim', feats: { Case: 'Dat' } },
      { token: 'njim', feats: { Case: 'Dat', Variant: 'Bound' } },
      { token: 'jimi', feats: { Case: 'Ins' } },
      { token: 'njimi', feats: { Case: 'Ins', Variant: 'Bound' } },
    ],
    feats: { PronType: 'Prs', Person: '3', Number: 'Plur' },
  },

  // Reflexive pronoun
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

  // Numerals
  dva: {
    upos: 'NUM',
    forms: [
      { token: 'dva', feats: { Case: 'Nom', Gender: 'Masc' } },
      { token: 'dvě', feats: { Case: 'Nom', Gender: 'Fem' } },
      { token: 'dva', feats: { Case: 'Nom', Gender: 'Neut' } },
      { token: 'dvoh', feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Anim' } },
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
      { token: 'oboh', feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Anim' } },
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

  // obadva
  obadva: {
    upos: 'NUM',
    forms: [
      { token: 'obadva', feats: { Case: 'Nom', Gender: 'Masc' } },
      { token: 'obadvě', feats: { Case: 'Nom', Gender: 'Fem' } },
      { token: 'obadvě', feats: { Case: 'Nom', Gender: 'Neut' } },
      { token: 'obadvoh', feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Anim' } },
      { token: 'obadva', feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Inan' } },
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
      { token: 'obydvoh', feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Anim' } },
      { token: 'obydva', feats: { Case: 'Acc', Gender: 'Masc', Animacy: 'Inan' } },
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
      { token: 'trěh', feats: { Case: 'Acc', Number: 'Plur', Animacy: 'Anim' } },
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
      { token: 'četyrěh', feats: { Case: 'Acc', Number: 'Plur', Animacy: 'Anim' } },
      { token: 'četyri', feats: { Case: 'Acc', Number: 'Plur', Animacy: 'Inan' } },
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
      { token: 'tysęć', feats: { Case: 'Nom', Number: 'Sing', Gender: 'Masc' } },
      { token: 'tysęć', feats: { Case: 'Acc', Number: 'Sing', Gender: 'Masc' } },
      { token: 'tysęća', feats: { Case: 'Gen', Number: 'Sing', Gender: 'Masc' } },
      { token: 'tysęću', feats: { Case: 'Dat', Number: 'Sing', Gender: 'Masc' } },
      { token: 'tysęćem', feats: { Case: 'Ins', Number: 'Sing', Gender: 'Masc' } },
      { token: 'tysęću', feats: { Case: 'Loc', Number: 'Sing', Gender: 'Masc' } },

      { token: 'tysęće', feats: { Case: 'Nom', Number: 'Plur', Gender: 'Masc' } },
      { token: 'tysęće', feats: { Case: 'Acc', Number: 'Plur', Gender: 'Masc', Animacy: 'Inan' } },
      { token: 'tysęćev', feats: { Case: 'Gen', Number: 'Plur', Gender: 'Masc' } },
      { token: 'tysęćam', feats: { Case: 'Dat', Number: 'Plur', Gender: 'Masc' } },
      { token: 'tysęćami', feats: { Case: 'Ins', Number: 'Plur', Gender: 'Masc' } },
      { token: 'tysęćah', feats: { Case: 'Loc', Number: 'Plur', Gender: 'Masc' } },

      { token: 'tysęć', feats: { Case: 'Nom', Number: 'Sing', Gender: 'Fem' } },
      { token: 'tysęć', feats: { Case: 'Acc', Number: 'Sing', Gender: 'Fem' } },
      { token: 'tysęći', feats: { Case: 'Gen', Number: 'Sing', Gender: 'Fem' } },
      { token: 'tysęći', feats: { Case: 'Dat', Number: 'Sing', Gender: 'Fem' } },
      { token: 'tysęćjų', feats: { Case: 'Ins', Number: 'Sing', Gender: 'Fem' } },
      { token: 'tysęći', feats: { Case: 'Loc', Number: 'Sing', Gender: 'Fem' } },

      { token: 'tysęći', feats: { Case: 'Nom', Number: 'Plur', Gender: 'Fem' } },
      { token: 'tysęći', feats: { Case: 'Acc', Number: 'Plur', Gender: 'Fem' } },
      { token: 'tysęćij', feats: { Case: 'Gen', Number: 'Plur', Gender: 'Fem' } },
      { token: 'tysęćam', feats: { Case: 'Dat', Number: 'Plur', Gender: 'Fem' } },
      { token: 'tysęćami', feats: { Case: 'Ins', Number: 'Plur', Gender: 'Fem' } },
      { token: 'tysęćah', feats: { Case: 'Loc', Number: 'Plur', Gender: 'Fem' } },
    ],
    feats: { NumType: 'Card' },
  },

  // Auxiliary verb "byti" (to be)
  byti: {
    upos: 'AUX',
    forms: [
      // Infinitive
      { token: 'byti', feats: { VerbForm: 'Inf' } },
      // Present tense
      { token: 'jesm', feats: { Mood: 'Ind', Number: 'Sing', Person: '1', Tense: 'Pres', VerbForm: 'Fin' } },
      { token: 'sȯm', feats: { Mood: 'Ind', Number: 'Sing', Person: '1', Tense: 'Pres', VerbForm: 'Fin', Variant: 'Short', Style: 'Vrnc' } },
      { token: 'jesi', feats: { Mood: 'Ind', Number: 'Sing', Person: '2', Tense: 'Pres', VerbForm: 'Fin' } },
      { token: 'si', feats: { Mood: 'Ind', Number: 'Sing', Person: '2', Tense: 'Pres', VerbForm: 'Fin', Variant: 'Short', Style: 'Vrnc' } },
      { token: 'jest', feats: { Mood: 'Ind', Number: 'Sing', Person: '3', Tense: 'Pres', VerbForm: 'Fin' } },
      { token: 'je', feats: { Mood: 'Ind', Number: 'Sing', Person: '3', Tense: 'Pres', Variant: 'Short', VerbForm: 'Fin' } },
      { token: 'jesmo', feats: { Mood: 'Ind', Number: 'Plur', Person: '1', Tense: 'Pres', VerbForm: 'Fin' } },
      { token: 'jeste', feats: { Mood: 'Ind', Number: 'Plur', Person: '2', Tense: 'Pres', VerbForm: 'Fin' } },
      { token: 'sųt', feats: { Mood: 'Ind', Number: 'Plur', Person: '3', Tense: 'Pres', VerbForm: 'Fin' } },
      { token: 'sų', feats: { Mood: 'Ind', Number: 'Plur', Person: '3', Tense: 'Pres', VerbForm: 'Fin', Variant: 'Short', Style: 'Vrnc' } },
      // Past tense
      { token: 'běh', feats: { Mood: 'Ind', Number: 'Sing', Person: '1', Tense: 'Past', VerbForm: 'Fin', Style: 'Arch' } },
      { token: 'běše', feats: { Mood: 'Ind', Number: 'Sing', Person: '2', Tense: 'Past', VerbForm: 'Fin', Style: 'Arch' } },
      { token: 'běše', feats: { Mood: 'Ind', Number: 'Sing', Person: '3', Tense: 'Past', VerbForm: 'Fin', Style: 'Arch' } },
      { token: 'běhmo', feats: { Mood: 'Ind', Number: 'Plur', Person: '1', Tense: 'Past', VerbForm: 'Fin', Style: 'Arch' } },
      { token: 'běste', feats: { Mood: 'Ind', Number: 'Plur', Person: '2', Tense: 'Past', VerbForm: 'Fin', Style: 'Arch' } },
      { token: 'běhų', feats: { Mood: 'Ind', Number: 'Plur', Person: '3', Tense: 'Past', VerbForm: 'Fin', Style: 'Arch' } },
      // Imperative
      { token: 'bųď', feats: { Mood: 'Imp', Number: 'Sing', Person: '2', VerbForm: 'Fin' } },
      { token: 'bųďmo', feats: { Mood: 'Imp', Number: 'Plur', Person: '1', VerbForm: 'Fin' } },
      { token: 'bųďte', feats: { Mood: 'Imp', Number: 'Plur', Person: '2', VerbForm: 'Fin' } },
      // Past participle
      { token: 'byl', feats: { Gender: 'Masc', Number: 'Sing', Tense: 'Past', VerbForm: 'Part', Voice: 'Act' } },
      { token: 'byla', feats: { Gender: 'Fem', Number: 'Sing', Tense: 'Past', VerbForm: 'Part', Voice: 'Act' } },
      { token: 'bylo', feats: { Gender: 'Neut', Number: 'Sing', Tense: 'Past', VerbForm: 'Part', Voice: 'Act' } },
      { token: 'byli', feats: { Number: 'Plur', Tense: 'Past', VerbForm: 'Part', Voice: 'Act' } },
    ],
    feats: { VerbForm: 'Inf' },
  },
};
/* eslint-enable */

/**
 * Builds a map of inflected forms to arrays of lemmas they appear in.
 */
function buildAliasesMap(): Record<string, string[]> {
  const aliases: Record<string, string[]> = {};

  for (const [lemma, paradigm] of Object.entries(HARDCODED_PARADIGMS)) {
    const seenForms = new Set<string>();
    for (const form of paradigm.forms || [{ token: lemma }]) {
      // Only add each form once per paradigm
      if (!seenForms.has(form.token)) {
        seenForms.add(form.token);
        if (!aliases[form.token]) {
          aliases[form.token] = [];
        }
        aliases[form.token].push(lemma);
      }
    }
  }

  return aliases;
}

// Build the aliases map once at module load time
export const ALIASES_MAP = buildAliasesMap();

/**
 * Hardcoded adapter for personal/reflexive pronouns and auxiliary verbs.
 * Returns all forms for the given lemma.
 *
 * If the input word is a non-ambiguous inflection, it will be resolved
 * back to the original lemma (e.g., "mene" -> "ja", "mę" -> "ja", "tebe" -> "ty").
 */
export function adaptHardcoded(
  word: string,
  xpos: XPOS,
  lemma: IdentifiableString,
): Token[] {
  // Check if word is a non-ambiguous inflection and resolve to lemma
  // Note: This might be redundant if normalization happens upstream, but keeps the adapter robust.
  const aliases = ALIASES_MAP[word];
  const resolvedWord = aliases && aliases.length === 1 ? aliases[0] : word;

  const paradigm = HARDCODED_PARADIGMS[resolvedWord];
  if (!paradigm) {
    return [];
  }

  const variants = parseXPos(xpos);

  // Check if the paradigm's UPOS matches any of the XPOS variants
  // This prevents 'ona' (PRON) from hijacking 'ona' (DET/pron.dem.)
  const matchingVariant = variants.find(([upos]) => upos === paradigm.upos);
  if (!matchingVariant) {
    // If the hardcoded paradigm UPOS (e.g. PRON) is not allowed by the XPOS (e.g. DET),
    // then this hardcoded match is invalid for this context.
    return [];
  }

  const baseFeats = matchingVariant[1];
  const tokens: Token[] = [];

  // Create tokens for all forms
  for (const form of paradigm.forms ?? [{ token: resolvedWord, feats: {} }]) {
    tokens.push({
      token: form.token,
      upos: paradigm.upos,
      xpos,
      lemma: {
        ...lemma,
        value: resolvedWord,
      },
      feats: {
        ...baseFeats,
        ...paradigm.feats,
        ...form.feats,
      },
    });
  }

  return tokens;
}
