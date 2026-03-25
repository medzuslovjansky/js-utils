"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declensionAdjective_1 = require("../declensionAdjective");
const fixtures_1 = require("../../__utils__/fixtures");
describe('adjective', () => {
    test.each((0, fixtures_1.adjectives)())('%s', (_id, morphology, lemma) => {
        if (!morphology.startsWith('adj'))
            throw 'not an adjective';
        const actual = (0, declensionAdjective_1.declensionAdjective)(lemma, '', morphology);
        expect(actual).toMatchSnapshot();
    });
});
//# sourceMappingURL=adjective.test.js.map