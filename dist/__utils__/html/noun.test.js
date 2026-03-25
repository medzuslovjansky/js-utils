"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const noun = tslib_1.__importStar(require("./noun"));
const noun_1 = require("../../noun");
describe('renderers', () => {
    describe('HTML', () => {
        describe('noun declension', () => {
            test('render', () => {
                const taksi = (0, noun_1.declensionNounSimple)('vrěsėnj', 'm.sg.');
                expect(noun.render(taksi)).toMatchSnapshot();
            });
            test('renderDiff', () => {
                const before = (0, noun_1.declensionNounSimple)('hlåpėc', 'm.anim.');
                // we choose a different noun to show the diff
                const after = (0, noun_1.declensionNounSimple)('děvčina', 'f.');
                expect(noun.renderDiff(before, after)).toMatchSnapshot();
            });
        });
    });
});
//# sourceMappingURL=noun.test.js.map