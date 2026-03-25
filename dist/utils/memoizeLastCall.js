"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoizeLastCall = void 0;
/* eslint-disable prefer-rest-params */
const areArraysEqual_1 = require("./areArraysEqual");
function memoizeLastCall(func) {
    let lastArgs;
    let lastResult;
    function memoized() {
        if (lastArgs && (0, areArraysEqual_1.areArraysEqual)(arguments, lastArgs)) {
            return lastResult;
        }
        lastArgs = arguments;
        lastResult = func(...arguments);
        return lastResult;
    }
    return memoized;
}
exports.memoizeLastCall = memoizeLastCall;
//# sourceMappingURL=memoizeLastCall.js.map