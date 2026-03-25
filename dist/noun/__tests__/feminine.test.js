"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declensionNounSimple_1 = require("../declensionNounSimple");
const fixtures_1 = require("../../__utils__/fixtures");
describe('noun', () => {
    describe('feminine', () => {
        test.each((0, fixtures_1.nouns_feminine)())('%s', (_id, morphology, lemma, extra) => {
            const actual = (0, declensionNounSimple_1.declensionNounSimple)(lemma, morphology, extra);
            expect(actual).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=feminine.test.js.map