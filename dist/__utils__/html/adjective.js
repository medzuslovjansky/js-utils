"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderDiff = exports.render = void 0;
const tslib_1 = require("tslib");
const common = tslib_1.__importStar(require("./common"));
function render(value) {
    return template(common.get(value));
}
exports.render = render;
function renderDiff(a, b) {
    return template(common.diff(a, b));
}
exports.renderDiff = renderDiff;
function template(r) {
    const figure = `\
<figure>
  <figcaption>Adjective declension</figcaption>
  <table>
    <thead>
      <tr>
        <th></th>
        <th colspan="3">singular</th>
      </tr>
      <tr>
        <th>case</th>
        <th>masculine</th>
        <th>neuter</th>
        <th>feminine</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Nom.</th>
        <td>${r('singular', 'nom', 0) || '—'}</td>
        <td>${r('singular', 'nom', 1) || '—'}</td>
        <td>${r('singular', 'nom', 2) || '—'}</td>
      </tr>
      <tr>
        <th>Acc.</th>
        <td>${r('singular', 'acc', 0) || '—'}</td>
        <td>${r('singular', 'acc', 1) || '—'}</td>
        <td>${r('singular', 'acc', 2) || '—'}</td>
      </tr>
      <tr>
        <th>Gen.</th>
        <td colspan="2">${r('singular', 'gen', 0) || '—'}</td>
        <td>${r('singular', 'gen', 1) || '—'}</td>
      </tr>
      <tr>
        <th>Loc.</th>
        <td colspan="2">${r('singular', 'loc', 0) || '—'}</td>
        <td>${r('singular', 'loc', 1) || '—'}</td>
      </tr>
      <tr>
        <th>Dat.</th>
        <td colspan="2">${r('singular', 'dat', 0) || '—'}</td>
        <td>${r('singular', 'dat', 1) || '—'}</td>
      </tr>
      <tr>
        <th>Ins.</th>
        <td colspan="2">${r('singular', 'ins', 0) || '—'}</td>
        <td>${r('singular', 'ins', 1) || '—'}</td>
      </tr>
    </tbody>
  </table>

  <table>
    <tbody>
      <tr>
        <th></th>
        <th colspan="2">plural</th>
      </tr>
      <tr>
        <th>case</th>
        <th>masculine</th>
        <th>feminine/neuter</th>
      </tr>
      <tr>
        <th>Nom.</th>
        <td>${r('plural', 'nom', 0) || '—'}</td>
        <td>${r('plural', 'nom', 1) || '—'}</td>
      </tr>
      <tr>
        <th>Acc.</th>
        <td>${r('plural', 'acc', 0) || '—'}</td>
        <td>${r('plural', 'acc', 1) || '—'}</td>
      </tr>
      <tr>
        <th>Gen.</th>
        <td colspan="2">${r('plural', 'gen', 0) || '—'}</td>
      </tr>
      <tr>
        <th>Loc.</th>
        <td colspan="2">${r('plural', 'loc', 0) || '—'}</td>
      </tr>
      <tr>
        <th>Dat.</th>
        <td colspan="2">${r('plural', 'dat', 0) || '—'}</td>
      </tr>
      <tr>
        <th>Ins.</th>
        <td colspan="2">${r('plural', 'ins', 0) || '—'}</td>
      </tr>
    </tbody>
  </table>

  <table>
    <tbody>
      <tr>
        <th>Degrees of comparison</th>
        <th>adjective</th>
        <th>adverb</th>
      </tr>
      <tr>
        <th>positive</th>
        <td>${r('comparison', 'positive', 0) || '—'}</td>
        <td>${r('comparison', 'positive', 1) || '—'}</td>
      </tr>
      <tr>
        <th>comparative</th>
        <td>${r('comparison', 'comparative', 0) || '—'}</td>
        <td>${r('comparison', 'comparative', 1) || '—'}</td>
      </tr>
      <tr>
        <th>superlative</th>
        <td>${r('comparison', 'superlative', 0) || '—'}</td>
        <td>${r('comparison', 'superlative', 1) || '—'}</td>
      </tr>
    </tbody>
  </table>
</figure>
`;
    return figure;
}
//# sourceMappingURL=adjective.js.map