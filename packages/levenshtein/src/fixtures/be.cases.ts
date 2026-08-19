import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    { in: 'ехаць', out: 'jehatj', covers: 'be-je' },
    { in: 'дзень', out: 'denj', covers: 'be-affricates' },
    { in: 'быць', out: 'bytj', covers: 'be-affricates' },
    { in: 'праўда', out: 'pravda', covers: 'be-letters' },
    { in: 'горад', out: 'gorad', covers: 'cyrillic-base' },
  ],
  metric: [
    { isv: 'denj', other: 'дзень', max: THRESHOLDS.LOW },
    { isv: 'pravda', other: 'праўда', max: THRESHOLDS.LOW },
    { isv: 'byti', other: 'быць', max: THRESHOLDS.LOW },
    { isv: 'město', other: 'сабака', min: THRESHOLDS.HIGH },
  ],
};
