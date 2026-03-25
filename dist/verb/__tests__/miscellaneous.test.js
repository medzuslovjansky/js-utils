"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conjugationVerb_1 = require("../conjugationVerb");
const fixtures_1 = require("../../__utils__/fixtures");
describe('verb', () => {
    describe('miscellaneous', () => {
        test.each((0, fixtures_1.verbs_misc)())('%s', (_id, morphology, lemma, extra) => {
            const actual = (0, conjugationVerb_1.conjugationVerb)(lemma, extra, morphology);
            expect(actual).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=miscellaneous.test.js.map