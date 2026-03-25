"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReplacer = void 0;
function createReplacer(map) {
    let maxLength = 1;
    for (const key of Object.keys(map)) {
        map[key] = mirrorTerminators(key, map[key]);
        maxLength = Math.max(maxLength, key.length);
    }
    function remapWord(str) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            for (let l = maxLength; l >= 0; l--) {
                if (l > 0) {
                    const chunk = str.slice(i, i + l);
                    const transliteratedChunk = map[chunk];
                    if (transliteratedChunk !== void 0) {
                        result += transliteratedChunk;
                        i += l - 1;
                        break;
                    }
                }
                else {
                    result += str[i];
                }
            }
        }
        return result;
    }
    return remapWord;
}
exports.createReplacer = createReplacer;
function mirrorTerminators(pattern, replacement) {
    const start = pattern[0] === '|' ? '|' : '';
    const end = pattern[pattern.length - 1] === '|' ? '|' : '';
    return `${start}${replacement}${end}`;
}
//# sourceMappingURL=createReplacer.js.map