"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syllabicR = void 0;
const substitutions_1 = require("../substitutions");
const HARD_R = new RegExp(`([${substitutions_1.ALL_CONSONANTS}])r([${substitutions_1.ALL_CONSONANTS}])`, 'g');
const SOFT_R = new RegExp(`([${substitutions_1.ALL_CONSONANTS}])ŕ([${substitutions_1.ALL_CONSONANTS}])`, 'g');
function syllabicR(word) {
    return word.replace(HARD_R, '$1R$2').replace(SOFT_R, '$1Ŕ$2');
}
exports.syllabicR = syllabicR;
//# sourceMappingURL=syllabicR.js.map