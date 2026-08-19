import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    { in: 'ноћ', out: 'noč', covers: 'sr-letters' },
    { in: 'међа', out: 'medža', covers: 'sr-letters' },
    { in: 'љубав', out: 'ljubav', covers: 'sr-letters' },
    { in: 'глава', out: 'glava', covers: 'cyrillic-base' },
  ],
  metric: [
    { isv: 'noč', other: 'ноћ', max: THRESHOLDS.LOW },
    { isv: 'medža', other: 'међа', max: THRESHOLDS.LOW },
    { isv: 'ljubov', other: 'љубав', max: THRESHOLDS.LOW },
    { isv: 'hlěb', other: 'кућа', min: THRESHOLDS.HIGH },
  ],
};
