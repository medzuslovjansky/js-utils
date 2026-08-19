import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    { in: 'góra', out: 'gora', covers: 'sl-accents' },
    { in: 'svét', out: 'svet', covers: 'sl-accents' },
  ],
  metric: [
    { isv: 'gora', other: 'gora', max: THRESHOLDS.LOW },
    { isv: 'člověk', other: 'človek', max: THRESHOLDS.LOW },
    { isv: 'svět', other: 'svet', max: THRESHOLDS.LOW },
    { isv: 'pes', other: 'miza', min: THRESHOLDS.HIGH },
  ],
};
