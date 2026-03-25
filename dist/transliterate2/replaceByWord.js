"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceByWord = void 0;
const normalize_1 = require("./normalize");
function replaceByWord(text, replacer) {
    return text.replace(/[\p{Letter}\p{Mark}]+/gu, (word) => {
        const restore = getCaseRestorer(word);
        const preprocessed = addBoundaries((0, normalize_1.normalize)(word.toLowerCase()));
        return restore(removeBoundaries(replacer(preprocessed)));
    });
}
exports.replaceByWord = replaceByWord;
function addBoundaries(word) {
    return `|${word}|`;
}
function removeBoundaries(str) {
    const start = str[0] === '|' ? 1 : 0;
    const end = str[str.length - 1] === '|' ? -1 : str.length;
    return str.slice(start, end);
}
function getCaseRestorer(word) {
    if (isUpper(word, 0)) {
        return isUpper(word, word.length - 1) ? toUpper : toFirstUpper;
    }
    else {
        return toLower;
    }
}
function isUpper(word, index) {
    const letter = word[index];
    return letter ? letter === letter.toUpperCase() : false;
}
function toUpper(word) {
    return word.toUpperCase();
}
function toFirstUpper(word) {
    return word[0].toUpperCase() + word.slice(1);
}
function toLower(word) {
    return word.toLowerCase();
}
//# sourceMappingURL=replaceByWord.js.map