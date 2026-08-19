import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    { in: 'hlava', out: 'glava', covers: 'sk-gh' },
    { in: 'kôň', out: 'konj', covers: 'sk-soft' },
    { in: 'ľud', out: 'ljud', covers: 'sk-soft' },
    { in: 'medzi', out: 'medži', covers: 'sk-soft' },
    { in: 'mäso', out: 'meso', covers: 'sk-vowels' },
    { in: 'chlieb', out: 'hlěb', covers: 'sk-vowels' },
  ],
  metric: [
    { isv: 'glava', other: 'hlava', max: THRESHOLDS.LOW },
    { isv: 'męso', other: 'mäso', max: THRESHOLDS.LOW },
    { isv: 'konj', other: 'kôň', max: THRESHOLDS.LOW },
    { isv: 'hlěb', other: 'chlieb', max: THRESHOLDS.LOW },
    { isv: 'medžu', other: 'medzi', max: THRESHOLDS.LOW },
    { isv: 'žena', other: 'strom', min: THRESHOLDS.HIGH },
  ],
};
