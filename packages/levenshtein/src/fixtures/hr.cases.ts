import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    // tonal accents are not segments; ć keeps its acute
    { in: 'rȉjeka', out: 'rěka', covers: 'prosody' },
    { in: 'nȏć', out: 'noč', covers: 'prosody' },
    { in: 'rijeka', out: 'rěka', covers: 'hr-jat' },
    { in: 'mlijeko', out: 'mlěko', covers: 'hr-jat' },
    // non-jat ije (stem-final i + je) must not fold — stop-list precedents
    { in: 'nije', out: 'nije', covers: 'hr-jat' },
    { in: 'pijem', out: 'pijem', covers: 'hr-jat' },
    // short jat: consonant + je (word-initial jezik and post-vocalic moje stay)
    { in: 'mjesto', out: 'město', covers: 'hr-short-jat' },
    { in: 'vjera', out: 'věra', covers: 'hr-short-jat' },
    { in: 'djeca', out: 'děca', covers: 'hr-short-jat' },
    // Latinate loans fold too — accepted, e↔ě is only a diacriticFold
    { in: 'objekt', out: 'oběkt', covers: 'hr-short-jat' },
    { in: 'noć', out: 'noč', covers: 'hr-letters' },
    { in: 'međa', out: 'medža', covers: 'hr-letters' },
  ],
  metric: [
    { isv: 'kråva', other: 'krava', max: THRESHOLDS.LOW },
    { isv: 'rěka', other: 'rijeka', max: THRESHOLDS.LOW },
    { isv: 'město', other: 'mjesto', max: THRESHOLDS.LOW },
    { isv: 'noč', other: 'noć', max: THRESHOLDS.LOW },
    { isv: 'medža', other: 'međa', max: THRESHOLDS.LOW },
    { isv: 'byti', other: 'biti', max: THRESHOLDS.LOW },
    { isv: 'hlěb', other: 'kruh', min: THRESHOLDS.HIGH },
  ],
};
