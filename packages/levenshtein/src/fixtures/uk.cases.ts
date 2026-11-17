import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    // adjective -ий is ISV -y (nouns use -ій: геній); short pronouns are guarded
    { in: 'бідний', out: 'bidny', covers: 'uk-adj' },
    { in: 'чий', out: 'čyj', covers: 'uk-adj' },
    { in: 'ворота', out: 'vråta', covers: 'pleophony' },
    { in: 'берег', out: 'brěg', covers: 'pleophony' },
    { in: 'сестра́', out: 'sestra', covers: 'prosody' },
    { in: 'світ', out: 'svit', covers: 'uk-letters' },
    { in: 'син', out: 'syn', covers: 'uk-letters' },
    { in: 'їжак', out: 'jižak', covers: 'uk-letters' },
    { in: 'м’ята', out: 'mjata', covers: 'uk-letters' },
    { in: 'тютюн', out: 'tjutjun', covers: 'cyrillic-base' },
    { in: 'гора', out: 'gora', covers: 'cyrillic-base' },
  ],
  metric: [
    { isv: 'bědny', other: 'бідний', max: THRESHOLDS.LOW },
    { isv: 'glåva', other: 'голова', max: THRESHOLDS.LOW },
    { isv: 'svět', other: 'світ', max: THRESHOLDS.LOW },
    { isv: 'gora', other: 'гора', max: THRESHOLDS.LOW },
    { isv: 'hlěb', other: 'хліб', max: THRESHOLDS.LOW },
    { isv: 'tjutjun', other: 'тютюн', max: THRESHOLDS.LOW },
    { isv: 'pes', other: 'хмара', min: THRESHOLDS.HIGH },
  ],
};
