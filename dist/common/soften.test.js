"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const soften_1 = require("./soften");
describe('soften function', () => {
    test('softens the last consonant by default', () => {
        expect((0, soften_1.soften)('dnes')).toBe('dneś');
        expect((0, soften_1.soften)('gaz')).toBe('gaź');
        expect((0, soften_1.soften)('lad')).toBe('laď');
    });
    test('softens the specified consonant at given index', () => {
        expect((0, soften_1.soften)('lad', 0)).toBe('ľad');
        expect((0, soften_1.soften)('selsky', 2)).toBe('seľsky');
        expect((0, soften_1.soften)('měd', 2)).toBe('měď');
    });
    test('handles negative indices', () => {
        expect((0, soften_1.soften)('dnes', -1)).toBe('dneś');
        expect((0, soften_1.soften)('test', -2)).toBe('teśt');
    });
    test('handles all softenable consonants', () => {
        expect((0, soften_1.soften)('D')).toBe('Ď');
        expect((0, soften_1.soften)('L')).toBe('Ľ');
        expect((0, soften_1.soften)('N')).toBe('Ń');
        expect((0, soften_1.soften)('R')).toBe('Ŕ');
        expect((0, soften_1.soften)('S')).toBe('Ś');
        expect((0, soften_1.soften)('T')).toBe('Ť');
        expect((0, soften_1.soften)('Z')).toBe('Ź');
        expect((0, soften_1.soften)('d')).toBe('ď');
        expect((0, soften_1.soften)('l')).toBe('ľ');
        expect((0, soften_1.soften)('n')).toBe('ń');
        expect((0, soften_1.soften)('r')).toBe('ŕ');
        expect((0, soften_1.soften)('s')).toBe('ś');
        expect((0, soften_1.soften)('t')).toBe('ť');
        expect((0, soften_1.soften)('z')).toBe('ź');
    });
    test('does not change non-softenable consonants and vowels', () => {
        expect((0, soften_1.soften)('baba')).toBe('baba');
        expect((0, soften_1.soften)('mama')).toBe('mama');
        expect((0, soften_1.soften)('papa')).toBe('papa');
    });
    test('handles empty strings', () => {
        expect((0, soften_1.soften)('')).toBe('');
        expect((0, soften_1.soften)('', 0)).toBe('');
    });
    test('handles out of range index', () => {
        expect((0, soften_1.soften)('test', 4)).toBe('test');
        expect((0, soften_1.soften)('test', -5)).toBe('test');
    });
});
//# sourceMappingURL=soften.test.js.map