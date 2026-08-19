import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    { in: 'щука', out: 'štuka', covers: 'bg-letters' },
    { in: 'сън', out: 'son', covers: 'bg-letters' },
    { in: 'шофьор', out: 'šofjor', covers: 'cyrillic-base' },
    { in: 'град', out: 'grad', covers: 'cyrillic-base' },
  ],
  metric: [
    { isv: 'grad', other: 'град', max: THRESHOLDS.LOW },
    { isv: 'sȯn', other: 'сън', max: THRESHOLDS.LOW },
    { isv: 'pųť', other: 'път', max: THRESHOLDS.HIGH },
    { isv: 'nebo', other: 'стол', min: THRESHOLDS.HIGH },
  ],
};
