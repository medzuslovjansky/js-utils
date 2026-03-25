"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declensionPronoun_1 = require("../declensionPronoun");
const fixtures_1 = require("../../__utils__/fixtures");
const declensionPronounSimple_1 = require("../declensionPronounSimple");
describe('pronoun', () => {
    describe('demonstrative', () => {
        test.each((0, fixtures_1.pronouns_demonstrative)())('%s', (_id, _morphology, lemma) => {
            const actual = (0, declensionPronoun_1.declensionPronoun)(lemma, 'demonstrative');
            expect(actual).toMatchSnapshot();
        });
        test.each([
            ['ona', 'onȯj'],
            ['ono', 'onȯj'],
            ['ota', 'otȯj'],
            ['oto', 'otȯj'],
            ['ova', 'ov'],
            ['ovo', 'ov'],
            ['tamta', 'tamtȯj'],
            ['tamto', 'tamtȯj'],
            ['tuta', 'tutȯj'],
            ['tuto', 'tutȯj'],
            ['ta', 'tȯj'],
            ['to', 'tȯj'],
            ['te', 'tȯj'],
            ['se', 'sėj'],
            ['sa', 'sėj'],
        ])('%s (pron.dem.) should decline as %s', (alternative, canonical) => {
            const actual = (0, declensionPronounSimple_1.declensionPronounSimple)(alternative, 'pron.dem.');
            const expected = (0, declensionPronounSimple_1.declensionPronounSimple)(canonical, 'pron.dem.');
            expect(actual).toEqual(expected);
        });
    });
});
//# sourceMappingURL=demonstrative.test.js.map