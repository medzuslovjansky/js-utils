import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    { in: 'единство', out: 'jedinstvo', covers: 'ru-je' },
    { in: 'тюрма', out: 'tjurma', covers: 'cyrillic-base' },
    { in: 'конь', out: 'konj', covers: 'cyrillic-base' },
    { in: 'судья', out: 'sudja', covers: 'cyrillic-base' },
    { in: 'съезд', out: 'sjezd', covers: 'cyrillic-base' },
    { in: 'шофёр', out: 'šofjor', covers: 'cyrillic-base' },
    { in: 'щука', out: 'ščuka', covers: 'cyrillic-base' },
  ],
  metric: [
    { isv: 'voda', other: 'вода', max: THRESHOLDS.LOW },
    { isv: 'člověk', other: 'человек', max: THRESHOLDS.LOW },
    { isv: 'konj', other: 'конь', max: THRESHOLDS.LOW },
    { isv: 'tjurma', other: 'тюрьма', max: THRESHOLDS.LOW },
    { isv: 'pes', other: 'кошка', min: THRESHOLDS.HIGH },
    { isv: 'ryba', other: 'стол', min: THRESHOLDS.HIGH },
  ],
};
