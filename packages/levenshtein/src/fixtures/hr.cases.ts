import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    { in: 'rijeka', out: 'rěka', covers: 'hr-jat' },
    { in: 'mlijeko', out: 'mlěko', covers: 'hr-jat' },
    { in: 'noć', out: 'noč', covers: 'hr-letters' },
    { in: 'međa', out: 'medža', covers: 'hr-letters' },
  ],
  metric: [
    { isv: 'rěka', other: 'rijeka', max: THRESHOLDS.LOW },
    { isv: 'noč', other: 'noć', max: THRESHOLDS.LOW },
    { isv: 'medža', other: 'međa', max: THRESHOLDS.LOW },
    { isv: 'byti', other: 'biti', max: THRESHOLDS.LOW },
    { isv: 'hlěb', other: 'kruh', min: THRESHOLDS.HIGH },
  ],
};
