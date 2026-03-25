"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_fs_1 = tslib_1.__importDefault(require("node:fs"));
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const declensionNumeral_1 = require("./declensionNumeral");
const partOfSpeech_1 = require("../partOfSpeech");
const rawTestCases = JSON.parse(node_fs_1.default.readFileSync(node_path_1.default.join(__dirname, 'testCases.json'), 'utf8'));
describe('numeral', () => {
    const numeral = rawTestCases.map((t) => [t.init.word, t.init.details, t.expected]);
    test.each(numeral)('%s', (word, details, expected) => {
        const actual = (0, declensionNumeral_1.declensionNumeral)(word, getNumeralType(details));
        if (actual === null) {
            expect(actual).toBe(expected);
        }
        else {
            expect(actual).toMatchObject(expected);
        }
    });
});
function getNumeralType(details) {
    const pos = (0, partOfSpeech_1.parsePos)(details);
    return pos.name === 'numeral' ? pos.type : null;
}
//# sourceMappingURL=declensionNumeral.test.js.map