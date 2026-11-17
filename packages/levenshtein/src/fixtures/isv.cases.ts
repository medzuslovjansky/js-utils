import type { LangFixtures } from './types.ts';

export const cases: LangFixtures = {
  translit: [
    // å is kept: it is cheap to both a (hr krava) and o (pl krowa)
    { in: 'kråva', out: 'kråva', covers: 'isv-etymology' },
    { in: 'dèn’', out: 'den', covers: 'isv-rare' },
    // ę is kept like å: cheap to e (bg meso) and a (cs maso, ru мясо)
    { in: 'męso', out: 'męso', covers: 'isv-etymology' },
    { in: 'rųka', out: 'ruka', covers: 'isv-etymology' },
    { in: 'među', out: 'medžu', covers: 'isv-etymology' },
    { in: 'koń', out: 'konj', covers: 'isv-soften' },
    { in: 'buŕa', out: 'burja', covers: 'isv-soften' },
    { in: 'sŕdce', out: 'srdce', covers: 'isv-soften' },
  ],
  metric: [],
};
