"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declensionPronoun_1 = require("../declensionPronoun");
const fixtures_1 = require("../../__utils__/fixtures");
describe('pronoun', () => {
    describe('interrogative', () => {
        test.each((0, fixtures_1.pronouns_interrogative)())('%s', (_id, _morphology, lemma) => {
            const actual = (0, declensionPronoun_1.declensionPronoun)(lemma, 'interrogative');
            expect(actual).toMatchSnapshot();
        });
    });
});
//# sourceMappingURL=interrogative.test.js.map