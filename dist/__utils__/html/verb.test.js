"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const verb = tslib_1.__importStar(require("./verb"));
const verb_1 = require("../../verb");
describe('renderers', () => {
    describe('HTML', () => {
        describe('verb conjugation', () => {
            test('render', () => {
                const example = (0, verb_1.conjugationVerb)('dověděti sę', '(dově)');
                expect(verb.render(example)).toMatchSnapshot();
            });
            test('renderDiff', () => {
                const before = (0, verb_1.conjugationVerb)('dověděti sę', '(dově)');
                // we choose a different verb to show the diff
                const after = (0, verb_1.conjugationVerb)('pověděti', '(pově)');
                expect(verb.renderDiff(before, after)).toMatchSnapshot();
            });
        });
    });
});
//# sourceMappingURL=verb.test.js.map