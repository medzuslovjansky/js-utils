import type { NormalizeLang, SupportedLang } from './normalize/index.ts';

export type AlignmentOp = 'equal' | 'substitute' | 'insert' | 'delete';

export interface AlignmentStep {
  a?: string;
  b?: string;
  op: AlignmentOp;
  cost: number;
}

export interface DistanceOptions {
  details?: boolean;
}

export interface DistanceDetails {
  distance: number;
  rawCost: number;
  graphemesA: string[];
  graphemesB: string[];
  alignment: AlignmentStep[];
}

export type { SupportedLang, NormalizeLang };
