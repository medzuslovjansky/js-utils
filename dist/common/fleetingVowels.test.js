"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fleetingVowels_1 = require("./fleetingVowels");
describe('fleetingVowels', () => {
    describe('markFleetingVowel', () => {
        it('marks the fleeting vowel in the word', () => {
            expect((0, fleetingVowels_1.markFleetingVowel)('pes', 'psa')).toBe('p(e)s');
            expect((0, fleetingVowels_1.markFleetingVowel)('son', 'sna')).toBe('s(o)n');
        });
        it('returns the same word when there is no fleeting vowel', () => {
            expect((0, fleetingVowels_1.markFleetingVowel)('mama', 'mama')).toBe('mama');
        });
        it('marks the fleeting vowel when it includes a diacritic', () => {
            expect((0, fleetingVowels_1.markFleetingVowel)('pènj', 'pnja')).toBe('p(e)nj');
            expect((0, fleetingVowels_1.markFleetingVowel)('sòn', 'sna')).toBe('s(o)n');
        });
    });
    describe('inferFleetingVowel', () => {
        it('infers the fleeting vowel in the word', () => {
            expect((0, fleetingVowels_1.inferFleetingVowel)('pės')).toBe('p(e)s');
            expect((0, fleetingVowels_1.inferFleetingVowel)('pèsȯk')).toBe('pès(o)k');
            expect((0, fleetingVowels_1.inferFleetingVowel)('sȯn')).toBe('s(o)n');
            expect((0, fleetingVowels_1.inferFleetingVowel)('dėnj')).toBe('d(e)nj');
            expect((0, fleetingVowels_1.inferFleetingVowel)('orėl')).toBe('or(e)l');
        });
        it('infers the fleeting vowel in complex words', () => {
            expect((0, fleetingVowels_1.inferFleetingVowel)('pėsȯk, kotȯk i orėl')).toBe('pės(o)k, kot(o)k i or(e)l');
            expect((0, fleetingVowels_1.inferFleetingVowel)('pės-afrikanec')).toBe('p(e)s-afrikań(e)c');
            expect((0, fleetingVowels_1.inferFleetingVowel)('afrikanec-pės')).toBe('afrikań(e)c-p(e)s');
        });
        it('does not infer incorrect fleeting vowels in the word', () => {
            expect((0, fleetingVowels_1.inferFleetingVowel)('pėj')).toBe('pėj');
            expect((0, fleetingVowels_1.inferFleetingVowel)('dvėri')).toBe('dvėri');
            expect((0, fleetingVowels_1.inferFleetingVowel)('dȯžď')).toBe('dȯžď');
            expect((0, fleetingVowels_1.inferFleetingVowel)('linėnj')).toBe('linėnj');
        });
    });
});
//# sourceMappingURL=fleetingVowels.test.js.map