import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    // ѓ is г + acute in NFD, but the acute is a letter there: only vowel marks go
    { in: 'ме́ѓу', out: 'medžu', covers: 'prosody' },
    { in: 'ноќ', out: 'noč', covers: 'mk-letters' },
    { in: 'меѓу', out: 'medžu', covers: 'mk-letters' },
    { in: 'ѕвезда', out: 'zvezda', covers: 'mk-letters' },
    { in: 'глава', out: 'glava', covers: 'cyrillic-base' },
  ],
  metric: [
    { isv: 'noč', other: 'ноќ', max: THRESHOLDS.LOW },
    { isv: 'medžu', other: 'меѓу', max: THRESHOLDS.LOW },
    { isv: 'zvězda', other: 'ѕвезда', max: THRESHOLDS.LOW },
    { isv: 'męso', other: 'риба', min: THRESHOLDS.HIGH },
  ],
};
