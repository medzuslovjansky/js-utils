"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fixtures = tslib_1.__importStar(require("../../__utils__/fixtures"));
const __1 = tslib_1.__importDefault(require(".."));
describe('transliteration integrity', () => {
    test.each([
        ...fixtures.adjectives(),
        ...fixtures.nouns_feminine(),
        ...fixtures.nouns_masculine_animate(),
        ...fixtures.nouns_masculine(),
        ...fixtures.nouns_misc(),
        ...fixtures.nouns_neuter(),
        ...fixtures.verbs_imperfect(),
        ...fixtures.verbs_perfect(),
        ...fixtures.verbs_misc(),
        ...fixtures.pronouns_demonstrative(),
        ...fixtures.pronouns_indefinite(),
        ...fixtures.pronouns_interrogative(),
        ...fixtures.pronouns_personal(),
        ...fixtures.pronouns_possessive(),
        ...fixtures.pronouns_reciprocal(),
        ...fixtures.pronouns_reflexive(),
        ...fixtures.pronouns_relative(),
        ...fixtures.other(),
    ])('%s', (_id, _morphology, lemma, additional) => {
        const value = lemma + ' ' + additional;
        const script = 'isv-Cyrl-x-etymolog';
        const withPreprocessing = (0, __1.default)(value, script, false);
        const withoutPreprocessing = (0, __1.default)(value, script, true);
        expect(withPreprocessing).toBe(withoutPreprocessing);
    });
});
//# sourceMappingURL=integrity.test.js.map