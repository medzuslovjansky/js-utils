"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.diff = void 0;
const tslib_1 = require("tslib");
const transliterate_1 = tslib_1.__importDefault(require("../../transliterate"));
const get_1 = tslib_1.__importDefault(require("lodash/get"));
function diff(before, after) {
    return (...path) => {
        const beforeValue = normalize((0, get_1.default)(before, path));
        const afterValue = normalize((0, get_1.default)(after, path));
        if (beforeValue === afterValue) {
            return beforeValue;
        }
        const del = beforeValue ? `<del>${beforeValue}</del>` : '';
        const ins = afterValue ? `<ins>${afterValue}</ins>` : '';
        return del || ins ? [del, ins].join(' ') : null;
    };
}
exports.diff = diff;
function get(obj) {
    return (...path) => {
        return normalize((0, get_1.default)(obj, path));
    };
}
exports.get = get;
function normalize(string) {
    return string && (0, transliterate_1.default)(string, 'isv-Latn-x-etymolog');
}
//# sourceMappingURL=common.js.map