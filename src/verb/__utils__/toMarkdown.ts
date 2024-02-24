/* eslint-disable prettier/prettier */
import type { SteenVerbParadigm } from '../conjugationVerb';

export function toMarkdown([a, b]: [SteenVerbParadigm?, SteenVerbParadigm?]): string {
  function r(key: keyof SteenVerbParadigm, index?: number): string {
    const av = a ? a[key] : undefined;
    const bv = b ? b[key] : undefined;
    const avi = (index !== undefined ? av?.[index] : av) as string;
    const bvi = (index !== undefined ? bv?.[index] : bv) as string;

    if (!bvi || avi === bvi) {
      return avi || '—';
    }

    return `~~${avi ?? '—'}~~ _${bvi ?? '—'}_`;
  }

  const table = `### Verb conjugation

| person | pronoun      | present            | imperfect            | future            |
|--------|--------------|--------------------|----------------------|-------------------|
| 1.sg.  | ja           | ${r('present', 0)} | ${r('imperfect', 0)} | ${r('future', 0)} |
| 2.sg.  | ty           | ${r('present', 1)} | ${r('imperfect', 1)} | ${r('future', 1)} |
| 3.sg.  | on, ona, ono | ${r('present', 2)} | ${r('imperfect', 2)} | ${r('future', 2)} |
| 1.pl.  | my           | ${r('present', 3)} | ${r('imperfect', 3)} | ${r('future', 3)} |
| 2.pl.  | vy           | ${r('present', 4)} | ${r('imperfect', 4)} | ${r('future', 4)} |
| 3.pl.  | oni, one     | ${r('present', 5)} | ${r('imperfect', 5)} | ${r('future', 5)} |

| person | pronoun    | perfect                | pluperfect         | conditional        |
|--------|------------|------------------------|--------------------|--------------------|
| 1.sg.  | ja         | ${r('perfect', 0)}     | ${r('pluperfect', 0)} | ${r('conditional', 0)} |
| 2.sg.  | ty         | ${r('perfect', 1)}     | ${r('pluperfect', 1)} | ${r('conditional', 1)} |
| 3.sg.  | on         | ${r('perfect', 2)}     | ${r('pluperfect', 2)} | ${r('conditional', 2)} |
| 3.sg.  | ona        | ${r('perfect', 3)}     | ${r('pluperfect', 3)} | ${r('conditional', 3)} |
| 3.sg.  | ono        | ${r('perfect', 4)}     | ${r('pluperfect', 4)} | ${r('conditional', 4)} |
| 1.pl.  | my         | ${r('perfect', 5)}     | ${r('pluperfect', 5)} | ${r('conditional', 5)} |
| 2.pl.  | vy         | ${r('perfect', 6)}     | ${r('pluperfect', 6)} | ${r('conditional', 6)} |
| 3.pl.  | oni, one   | ${r('perfect', 7)}     | ${r('pluperfect', 7)} | ${r('conditional', 7)} |

| **form**                       | **notation**                              |
|--------------------------------|-------------------------------------------|
| **infinitive**                 | ${r('infinitive')}                        |
| **imperative**                 | ${r('imperative')}                        |
| **present active participle**  | ${r('prap')}                              |
| **present passive participle** | ${r('prpp')}                              |
| **past active participle**     | ${r('pfap')}                              |
| **past passive participle**    | ${r('pfpp')}                              |
| **verbal noun**                | ${r('gerund')}                            |
`;

  return table;
}
