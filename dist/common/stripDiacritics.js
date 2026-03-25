"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripDiacritics = void 0;
function stripDiacritics(text) {
    if (!text) {
        return '';
    }
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s-]/g, '');
}
exports.stripDiacritics = stripDiacritics;
//# sourceMappingURL=stripDiacritics.js.map