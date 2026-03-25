"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declensionNounSimple_1 = require("../declensionNounSimple");
const fixtures_1 = require("../../__utils__/fixtures");
describe('noun', () => {
    describe('miscellaneous', () => {
        test.each((0, fixtures_1.nouns_misc)())('%s (as masculine)', (_id, morphology, lemma, extra) => {
            const masculine = (0, declensionNounSimple_1.declensionNounSimple)(lemma, morphology, extra, 'masculine');
            expect(masculine).toMatchSnapshot('masculine');
        });
        test.each((0, fixtures_1.nouns_misc)())('%s (as feminine)', (_id, morphology, lemma, extra) => {
            const feminine = (0, declensionNounSimple_1.declensionNounSimple)(lemma, morphology, extra, 'feminine');
            expect(feminine).toMatchSnapshot('feminine');
        });
    });
});
//# sourceMappingURL=miscellaneous.test.js.map