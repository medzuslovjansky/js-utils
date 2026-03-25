"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declensionPronoun_1 = require("../declensionPronoun");
const fixtures_1 = require("../../__utils__/fixtures");
describe('pronoun', () => {
    describe('relative', () => {
        test.each((0, fixtures_1.pronouns_relative)())('%s', (_id, _morphology, lemma) => {
            const actual = (0, declensionPronoun_1.declensionPronoun)(lemma, 'relative');
            expect(actual).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=relative.test.js.map