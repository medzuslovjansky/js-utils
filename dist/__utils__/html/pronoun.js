"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderDiff = exports.render = void 0;
const tslib_1 = require("tslib");
const common = tslib_1.__importStar(require("./common"));
function render(value) {
    if (!value) {
        return '';
    }
    const template = value.type === 'noun' ? noun : adjective;
    return template(common.get(value));
}
exports.render = render;
function renderDiff(a, b) {
    if (a && b && a.type !== b.type) {
        throw new Error(`Pronoun types do not match (${a.type} !== ${b.type})`);
    }
    const type = a?.type ?? b?.type;
    if (!type) {
        return '';
    }
    const template = type === 'noun' ? noun : adjective;
    return template(common.diff(a, b));
}
exports.renderDiff = renderDiff;
function noun(r) {
    const figure = `\
<figure>
<figcaption>Pronoun declension</figcaption>
<table>
  <thead>
    <tr>
      <th>case</th>
      <th>Word Form</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Nom.</th>
      <td>${r('cases', 'nom', 0)}</td>
    </tr>
    <tr>
      <th>Acc.</th>
      <td>${r('cases', 'acc', 0)}</td>
    </tr>
    <tr>
      <th>Gen.</th>
      <td>${r('cases', 'gen', 0)}</td>
    </tr>
    <tr>
      <th>Loc.</th>
      <td>${r('cases', 'loc', 0)}</td>
    </tr>
    <tr>
      <th>Dat.</th>
      <td>${r('cases', 'dat', 0)}</td>
    </tr>
    <tr>
      <th>Ins.</th>
      <td>${r('cases', 'ins', 0)}</td>
    </tr>
  </tbody>
</table>
</figure>
`;
    return figure;
}
function adjective(r) {
    const figure = `\
<figure>
  <figcaption>Pronoun declension</figcaption>
  <table>
    <caption>singular</caption>
    <thead>
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
        <td>${r('casesSingular', 'nom', 0)}</td>
        <td>${r('casesSingular', 'nom', 1)}</td>
        <td>${r('casesSingular', 'nom', 2)}</td>
      </tr>
      <tr>
        <th>Acc.</th>
        <td>${r('casesSingular', 'acc', 0)}</td>
        <td>${r('casesSingular', 'acc', 1)}</td>
        <td>${r('casesSingular', 'acc', 2)}</td>
      </tr>
      <tr>
        <th>Gen.</th>
        <td colspan="2">${r('casesSingular', 'gen', 0)}</td>
        <td>${r('casesSingular', 'gen', 1)}</td>
      </tr>
      <tr>
        <th>Loc.</th>
        <td colspan="2">${r('casesSingular', 'loc', 0)}</td>
        <td>${r('casesSingular', 'loc', 1)}</td>
      </tr>
      <tr>
        <th>Dat.</th>
        <td colspan="2">${r('casesSingular', 'dat', 0)}</td>
        <td>${r('casesSingular', 'dat', 1)}</td>
      </tr>
      <tr>
        <th>Ins.</th>
        <td colspan="2">${r('casesSingular', 'ins', 0)}</td>
        <td>${r('casesSingular', 'ins', 1)}</td>
      </tr>
    </tbody>
  </table>

  <table>
    <caption>plural</caption>
    <tbody>
      <tr>
        <th>case</th>
        <th>masculine</th>
        <th>feminine/neuter</th>
      </tr>
      <tr>
        <th>Nom.</th>
        <td>${r('casesPlural', 'nom', 0)}</td>
        <td>${r('casesPlural', 'nom', 1)}</td>
      </tr>
      <tr>
        <th>Acc.</th>
        <td>${r('casesPlural', 'acc', 0)}</td>
        <td>${r('casesPlural', 'acc', 1)}</td>
      </tr>
      <tr>
        <th>Gen.</th>
        <td colspan="2">${r('casesPlural', 'gen', 0)}</td>
      </tr>
      <tr>
        <th>Loc.</th>
        <td colspan="2">${r('casesPlural', 'loc', 0)}</td>
      </tr>
      <tr>
        <th>Dat.</th>
        <td colspan="2">${r('casesPlural', 'dat', 0)}</td>
      </tr>
      <tr>
        <th>Ins.</th>
        <td colspan="2">${r('casesPlural', 'ins', 0)}</td>
      </tr>
    </tbody>
  </table>
</figure>
`;
    return figure;
}
//# sourceMappingURL=pronoun.js.map