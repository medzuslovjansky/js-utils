"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toHTML = void 0;
const tslib_1 = require("tslib");
const node_vm_1 = tslib_1.__importDefault(require("node:vm"));
const html = tslib_1.__importStar(require("./html"));
function toHTML(test) {
    const renderer = getRenderer(test);
    const figures = renderer ? getBeforeAndAfter(test).map(renderer) : [];
    return figures.map((figure) => figure + '\n\n').join('');
}
exports.toHTML = toHTML;
function getBeforeAndAfter(test) {
    return test.failureDetails
        .map((failure) => failure?.matcherResult)
        .filter((matcherResult) => matcherResult && (matcherResult.expected || matcherResult.actual))
        .map(({ expected, actual }) => {
        try {
            return node_vm_1.default.runInNewContext(`[${expected}, ${actual}]`);
        }
        catch {
            return node_vm_1.default.runInNewContext(`[${JSON.stringify(expected)}, ${JSON.stringify(actual)}]`);
        }
    });
}
function getRenderer(test) {
    const partOfSpeech = test.ancestorTitles[0];
    switch (partOfSpeech) {
        case 'verb':
            return (tuple) => html.verb.renderDiff(...tuple);
        case 'noun':
            return (tuple) => html.noun.renderDiff(...tuple);
        case 'adjective':
            return (tuple) => html.adjective.renderDiff(...tuple);
        case 'pronoun':
            return (tuple) => html.pronoun.renderDiff(...tuple);
        default:
            return;
    }
}
//# sourceMappingURL=toHTML.js.map