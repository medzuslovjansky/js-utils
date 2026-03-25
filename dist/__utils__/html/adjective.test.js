"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const adjective = tslib_1.__importStar(require("./adjective"));
const adjective_1 = require("../../adjective");
describe('renderers', () => {
    describe('HTML', () => {
        describe('noun declension', () => {
            test('render', () => {
                // This word does not exist, but it demonstrates the rendering
                // In alternative reality, it would mean "the best of all ever" :)
                const najdobry_koli = (0, adjective_1.declensionAdjective)('najdobry', '-koli', 'adj.sup.');
                expect(adjective.render(najdobry_koli)).toMatchSnapshot();
            });
            test('renderDiff', () => {
                const before = (0, adjective_1.declensionAdjective)('svěži');
                // we choose a different noun to show the diff
                const after = (0, adjective_1.declensionAdjective)('črstvy');
                expect(adjective.renderDiff(before, after)).toMatchSnapshot();
            });
        });
    });
});
//# sourceMappingURL=adjective.test.js.map