"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areArraysEqual = void 0;
function areArraysEqual(a, b) {
    const n = a.length;
    let i;
    if (n !== b.length)
        return false;
    for (i = 0; i < n; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
exports.areArraysEqual = areArraysEqual;
//# sourceMappingURL=areArraysEqual.js.map