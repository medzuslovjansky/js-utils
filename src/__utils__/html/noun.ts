/* eslint-disable prettier/prettier */
import type { SteenNounParadigm } from '../../noun';
import * as common from './common';

export function render(value: SteenNounParadigm) {
  return template(common.get(value));
}

export function renderDiff(a: SteenNounParadigm, b: SteenNounParadigm) {
  return template(common.diff(a, b));
}

function template(r: (key: keyof SteenNounParadigm, index?: number) => string | null): string {
  const figure = `\
<figure>
  <figcaption>Noun declension</figcaption>
  <table>
    <thead>
      <tr>
        <th>case</th>
        <th>singular</th>
        <th>plural</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Nom.</th>
        <td>${r('nom', 0) || '—'}</td>
        <td>${r('nom', 1) || '—'}</td>
      </tr>
      <tr>
        <th>Acc.</th>
        <td>${r('acc', 0) || '—'}</td>
        <td>${r('acc', 1) || '—'}</td>
      </tr>
      <tr>
        <th>Gen.</th>
        <td>${r('gen', 0) || '—'}</td>
        <td>${r('gen', 1) || '—'}</td>
      </tr>
      <tr>
        <th>Loc.</th>
        <td>${r('loc', 0) || '—'}</td>
        <td>${r('loc', 1) || '—'}</td>
      </tr>
      <tr>
        <th>Dat.</th>
        <td>${r('dat', 0) || '—'}</td>
        <td>${r('dat', 1) || '—'}</td>
      </tr>
      <tr>
        <th>Ins.</th>
        <td>${r('ins', 0) || '—'}</td>
        <td>${r('ins', 1) || '—'}</td>
      </tr>
      <tr>
        <th>Voc.</th>
        <td>${r('voc', 0) || '—'}</td>
        <td>${r('voc', 1) || '—'}</td>
      </tr>
    </tbody>
  </table>
</figure>
`;

  return figure;
}
