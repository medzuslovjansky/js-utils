"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declensionNounSimple_1 = require("../declensionNounSimple");
const fixtures_1 = require("../../__utils__/fixtures");
describe('noun', () => {
    describe('masculine', () => {
        test.each((0, fixtures_1.nouns_masculine)())('%s', (_id, morphology, lemma, extra) => {
            const actual = (0, declensionNounSimple_1.declensionNounSimple)(lemma, morphology, extra);
            expect(actual).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=masculine.test.js.map