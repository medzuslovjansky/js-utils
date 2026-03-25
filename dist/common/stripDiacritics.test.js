"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stripDiacritics_1 = require("./stripDiacritics");
describe('stripDiacritics', () => {
    test('råbotati -> rabotati', () => {
        expect((0, stripDiacritics_1.stripDiacritics)('råbotati')).toBe('rabotati');
    });
    test('sųråbotati -> surabotati', () => {
        expect((0, stripDiacritics_1.stripDiacritics)('sųråbotati')).toBe('surabotati');
    });
    test('gòltnųti -> goltnuti', () => {
        expect((0, stripDiacritics_1.stripDiacritics)('gòltnųti')).toBe('goltnuti');
    });
    test('Organizacija Sjedinjenyh Narodov -> ...', () => {
        expect((0, stripDiacritics_1.stripDiacritics)('Organizacija Sjedinjenyh Narodov')).toBe('Organizacija Sjedinjenyh Narodov');
    });
});
//# sourceMappingURL=stripDiacritics.test.js.map