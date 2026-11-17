import type { LangFixtures } from './types.ts';
import { THRESHOLDS } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    // after labials/velars/l the i of ie only marks softness, as ru е does
    // (bieda→beda like беда→beda); c/s/z/n/dz are left to pl-soften (życie→žytje)
    { in: 'bieda', out: 'beda', covers: 'pl-ie' },
    { in: 'wiek', out: 'vek', covers: 'pl-ie' },
    { in: 'morze', out: 'morje', covers: 'pl-digraphs' },
    { in: 'szkoła', out: 'škola', covers: 'pl-digraphs' },
    { in: 'czas', out: 'čas', covers: 'pl-digraphs' },
    { in: 'koń', out: 'konj', covers: 'pl-soften' },
    { in: 'być', out: 'bytj', covers: 'pl-soften' },
    { in: 'siostra', out: 'sjostra', covers: 'pl-soften' },
    // the same ci, but before a consonant: the i stays instead of being muted
    { in: 'cicho', out: 'tjiho', covers: 'pl-soften' },
    { in: 'dąb', out: 'dub', covers: 'pl-letters' },
    { in: 'żaba', out: 'žaba', covers: 'pl-letters' },
    { in: 'wąs', out: 'vus', covers: 'pl-letters' },
  ],
  metric: [
    { isv: 'běda', other: 'bieda', max: THRESHOLDS.LOW },
    { isv: 'kråva', other: 'krowa', max: THRESHOLDS.LOW },
    { isv: 'morje', other: 'morze', max: THRESHOLDS.LOW },
    { isv: 'dųb', other: 'dąb', max: THRESHOLDS.LOW },
    { isv: 'byti', other: 'być', max: THRESHOLDS.LOW },
    { isv: 'rěka', other: 'rzeka', max: THRESHOLDS.HIGH },
    { isv: 'pes', other: 'żaba', min: THRESHOLDS.HIGH },
  ],
};
