import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    { in: 'hora', out: 'gora', covers: 'cs-gh' },
    { in: 'chleba', out: 'hleba', covers: 'cs-gh' },
    { in: 'moře', out: 'morje', covers: 'cs-soft' },
    { in: 'kůň', out: 'kunj', covers: 'cs-soft' },
    { in: 'soud', out: 'sud', covers: 'cs-vowels' },
    { in: 'mléko', out: 'mleko', covers: 'cs-vowels' },
  ],
  metric: [
    { isv: 'gora', other: 'hora', max: THRESHOLDS.LOW },
    { isv: 'morje', other: 'moře', max: THRESHOLDS.LOW },
    { isv: 'sųd', other: 'soud', max: THRESHOLDS.LOW },
    { isv: 'město', other: 'město', max: THRESHOLDS.LOW },
    { isv: 'konj', other: 'kůň', max: THRESHOLDS.LOW },
    { isv: 'ryba', other: 'stůl', min: THRESHOLDS.HIGH },
  ],
};
