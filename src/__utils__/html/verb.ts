/* eslint-disable prettier/prettier */
import type { SteenVerbParadigm } from '../../verb';
import * as common from './common';

export function render(value: SteenVerbParadigm) {
  return template(common.get(value));
}

export function renderDiff(a: SteenVerbParadigm, b: SteenVerbParadigm) {
  return template(common.diff(a, b));
}

function template(r: (key: keyof SteenVerbParadigm, index?: number) => string | null): string {
  const figure = `\
<figure>
   <figcaption>Verb conjugation</figcaption>
   <table>
      <thead>
         <tr>
            <th>person</th>
            <th>pronoun</th>
            <th>present</th>
            <th>imperfect</th>
            <th>future</th>
         </tr>
      </thead>
      <tbody>
         <tr>
            <th>1.sg</th>
            <td>ja</td>
            <td>${r('present', 0) || '—'}</td>
            <td>${r('imperfect', 0) || '—'}</td>
            <td>${r('future', 0) || '—'}</td>
         </tr>
         <tr>
            <th>2.sg</th>
            <td>ty</td>
            <td>${r('present', 1) || '—'}</td>
            <td>${r('imperfect', 1) || '—'}</td>
            <td>${r('future', 1) || '—'}</td>
         </tr>
         <tr>
            <th>3.sg</th>
            <td>on, ona, ono</td>
            <td>${r('present', 2) || '—'}</td>
            <td>${r('imperfect', 2) || '—'}</td>
            <td>${r('future', 2) || '—'}</td>
         </tr>
         <tr>
            <th>1.pl</th>
            <td>my</td>
            <td>${r('present', 3) || '—'}</td>
            <td>${r('imperfect', 3) || '—'}</td>
            <td>${r('future', 3) || '—'}</td>
         </tr>
         <tr>
            <th>2.pl</th>
            <td>vy</td>
            <td>${r('present', 4) || '—'}</td>
            <td>${r('imperfect', 4) || '—'}</td>
            <td>${r('future', 4) || '—'}</td>
         </tr>
         <tr>
            <th>3.pl</th>
            <td>oni, one</td>
            <td>${r('present', 5) || '—'}</td>
            <td>${r('imperfect', 5) || '—'}</td>
            <td>${r('future', 5) || '—'}</td>
         </tr>
      </tbody>
      </table>
      <table>
      <thead>
         <tr>
            <th>person</th>
            <th>pronoun</th>
            <th>perfect</th>
            <th>pluperfect</th>
            <th>conditional</th>
         </tr>
         <tr>
            <th>1.sg</th>
            <td>ja</td>
            <td>${r('perfect', 0) || '—'}</td>
            <td>${r('pluperfect', 0) || '—'}</td>
            <td>${r('conditional', 0) || '—'}</td>
         </tr>
         <tr>
            <th>2.sg</th>
            <td>ty</td>
            <td>${r('perfect', 1) || '—'}</td>
            <td>${r('pluperfect', 1) || '—'}</td>
            <td>${r('conditional', 1) || '—'}</td>
         </tr>
         <tr>
            <th rowspan="3">3.sg</th>
            <td>on</td>
            <td>${r('perfect', 2) || '—'}</td>
            <td>${r('pluperfect', 2) || '—'}</td>
            <td>${r('conditional', 2) || '—'}</td>
         </tr>
         <tr>
            <td>ona</td>
            <td>${r('perfect', 3) || '—'}</td>
            <td>${r('pluperfect', 3) || '—'}</td>
            <td>${r('conditional', 3) || '—'}</td>
         </tr>
         <tr>
            <td>ono</td>
            <td>${r('perfect', 4) || '—'}</td>
            <td>${r('pluperfect', 4) || '—'}</td>
            <td>${r('conditional', 4) || '—'}</td>
         </tr>
         <tr>
            <th>1.pl</th>
            <td>my</td>
            <td>${r('perfect', 5) || '—'}</td>
            <td>${r('pluperfect', 5) || '—'}</td>
            <td>${r('conditional', 5) || '—'}</td>
         </tr>
         <tr>
            <th>2.pl</th>
            <td>vy</td>
            <td>${r('perfect', 6) || '—'}</td>
            <td>${r('pluperfect', 6) || '—'}</td>
            <td>${r('conditional', 6) || '—'}</td>
         </tr>
         <tr>
            <th>3.pl</th>
            <td>oni, one</td>
            <td>${r('perfect', 7) || '—'}</td>
            <td>${r('pluperfect', 7) || '—'}</td>
            <td>${r('conditional', 7) || '—'}</td>
         </tr>
       </thead>
       </table>
       <table>
       <tbody>
         <tr>
            <th align="left" colspan="2">infinitive</th>
            <td colspan="3">${r('infinitive') || '—'}</td>
         </tr>
         <tr>
            <th align="left" colspan="2">imperative</th>
            <td colspan="3">${r('imperative') || '—'}</td>
         </tr>
         <tr>
            <th align="left" colspan="2">present active participle</th>
            <td colspan="3">${r('prap') || '—'}</td>
         </tr>
         <tr>
            <th align="left" colspan="2">present passive participle</th>
            <td colspan="3">${r('prpp') || '—'}</td>
         </tr>
         <tr>
            <th align="left" colspan="2">past active participle</th>
            <td colspan="3">${r('pfap') || '—'}</td>
         </tr>
         <tr>
            <th align="left" colspan="2">past passive participle</th>
            <td colspan="3">${r('pfpp') || '—'}</td>
         </tr>
         <tr>
            <th align="left" colspan="2">verbal noun</th>
            <td colspan="3">${r('gerund') || '—'}</td>
         </tr>
      </tbody>
   </table>
</figure>
`;

  return figure;
}
