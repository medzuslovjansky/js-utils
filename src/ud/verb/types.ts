import type { Word } from '../types';

export interface Aux extends Word {
  uPosTag: 'AUX';
}

export interface Verb extends Word {
  uPosTag: 'VERB';
  feats: VerbFeatures;
}

export interface VerbFeatures {
  aspect?: 'Imp' | 'Perf';
  gender?: 'Masc' | 'Fem' | 'Neut';
  mood?: 'Ind' | 'Cnd' | 'Imp' | 'Sub';
  number?: 'Sing' | 'Plur';
  person?: '1' | '2' | '3';
  tense?: 'Past' | 'Pres' | 'Fut' | 'Imp';
  verbForm?: 'Fin' | 'Inf' | 'Part' | 'Conv';
  voice?: 'Act' | 'Pass';
}
