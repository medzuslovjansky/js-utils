import type { NormalizeLang } from '../normalize/index.ts';
import type { LangFixtures } from './types.ts';
import { cases as isv } from './isv.cases.ts';
import { cases as ru } from './ru.cases.ts';
import { cases as be } from './be.cases.ts';
import { cases as uk } from './uk.cases.ts';
import { cases as pl } from './pl.cases.ts';
import { cases as cs } from './cs.cases.ts';
import { cases as sk } from './sk.cases.ts';
import { cases as sl } from './sl.cases.ts';
import { cases as hr } from './hr.cases.ts';
import { cases as sr } from './sr.cases.ts';
import { cases as mk } from './mk.cases.ts';
import { cases as bg } from './bg.cases.ts';

/** The Record type makes "every pipeline has fixtures" a compile-time guarantee. */
export const FIXTURES: Record<NormalizeLang, LangFixtures> = {
  isv,
  ru,
  be,
  uk,
  pl,
  cs,
  sk,
  sl,
  hr,
  sr,
  mk,
  bg,
};
