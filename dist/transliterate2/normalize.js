"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = void 0;
function normalize(text) {
    return text
        .normalize('NFC')
        .replaceAll('ĺ', 'ľ')
        .replaceAll('ř', 'ŕ')
        .replaceAll('t́', 'ť')
        .replaceAll('ò', 'ȯ')
        .replaceAll('è', 'ė');
}
exports.normalize = normalize;
//# sourceMappingURL=normalize.js.map