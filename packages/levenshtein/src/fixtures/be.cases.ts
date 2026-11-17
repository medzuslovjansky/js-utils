import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    { in: 'гало́ва', out: 'galova', covers: 'prosody' },
    { in: 'ехаць', out: 'jehatj', covers: 'be-je' },
    { in: 'дзень', out: 'denj', covers: 'be-affricates' },
    { in: 'быць', out: 'bytj', covers: 'be-affricates' },
    { in: 'праўда', out: 'pravda', covers: 'be-letters' },
    // the apostrophe is jotation, not a segment: strip it, the glide comes from the vowel
    { in: "сям'я", out: 'sjamja', covers: 'be-letters' },
    // …except е, which needs the apostrophe (and ў) in its glide context to fire
    { in: "аб'ект", out: 'abjekt', covers: 'be-je' },
    { in: 'здароўе', out: 'zdarovje', covers: 'be-je' },
    { in: 'горад', out: 'gorad', covers: 'cyrillic-base' },
  ],
  metric: [
    { isv: 'denj', other: 'дзень', max: THRESHOLDS.LOW },
    { isv: 'pravda', other: 'праўда', max: THRESHOLDS.LOW },
    { isv: 'byti', other: 'быць', max: THRESHOLDS.LOW },
    { isv: 'město', other: 'сабака', min: THRESHOLDS.HIGH },
  ],
};
