import type { LangFixtures } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    { in: 'dèn’', out: 'den', covers: 'isv-rare' },
    { in: 'męso', out: 'meso', covers: 'isv-etymology' },
    { in: 'rųka', out: 'ruka', covers: 'isv-etymology' },
    { in: 'među', out: 'medžu', covers: 'isv-etymology' },
    { in: 'koń', out: 'konj', covers: 'isv-soften' },
    { in: 'buŕa', out: 'burja', covers: 'isv-soften' },
    { in: 'sŕdce', out: 'srdce', covers: 'isv-soften' },
  ],
  metric: [],
};
