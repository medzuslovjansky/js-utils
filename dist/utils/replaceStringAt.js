"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceStringAt = void 0;
function replaceStringAt(str, index, replacement, length = Math.max(1, replacement.length)) {
    if (index < 0 || index >= str.length) {
        return str;
    }
    return str.slice(0, index) + replacement + str.slice(index + length);
}
exports.replaceStringAt = replaceStringAt;
//# sourceMappingURL=replaceStringAt.js.map