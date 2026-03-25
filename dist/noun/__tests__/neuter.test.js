"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declensionNounSimple_1 = require("../declensionNounSimple");
const fixtures_1 = require("../../__utils__/fixtures");
describe('noun', () => {
    describe('neuter', () => {
        test.each((0, fixtures_1.nouns_neuter)())('%s', (_id, morphology, lemma, extra) => {
            const actual = (0, declensionNounSimple_1.declensionNounSimple)(lemma, morphology, extra);
            expect(actual).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=neuter.test.js.map