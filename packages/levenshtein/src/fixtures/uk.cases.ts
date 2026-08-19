import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    { in: 'світ', out: 'svit', covers: 'uk-letters' },
    { in: 'син', out: 'syn', covers: 'uk-letters' },
    { in: 'їжак', out: 'jižak', covers: 'uk-letters' },
    { in: 'м’ята', out: 'mjata', covers: 'uk-letters' },
    { in: 'тютюн', out: 'tjutjun', covers: 'cyrillic-base' },
    { in: 'гора', out: 'gora', covers: 'cyrillic-base' },
  ],
  metric: [
    { isv: 'svět', other: 'світ', max: THRESHOLDS.LOW },
    { isv: 'gora', other: 'гора', max: THRESHOLDS.LOW },
    { isv: 'hlěb', other: 'хліб', max: THRESHOLDS.LOW },
    { isv: 'tjutjun', other: 'тютюн', max: THRESHOLDS.LOW },
    { isv: 'pes', other: 'хмара', min: THRESHOLDS.HIGH },
  ],
};
