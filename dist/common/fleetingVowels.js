"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferFleetingVowel = exports.markFleetingVowel = void 0;
const substitutions_1 = require("../substitutions");
const soften_1 = require("./soften");
function markFleetingVowel(word, add) {
    let i = 0;
    const L = Math.min(word.length - 1, add.length);
    while (i < L && word[i] === add[i]) {
        i++;
    }
    if (word[i] !== add[i]) {
        if (word[i + 1] === add[i]) {
            return replaceFleetingVowel(word, i);
        }
        if (word[i + 1] === add[i + 1] && isLJNJ(add, i - 1)) {
            return replaceFleetingVowel(word, i);
        }
    }
    return word;
}
exports.markFleetingVowel = markFleetingVowel;
function inferFleetingVowel(word) {
    let end = word.length;
    let result = word;
    for (let i = end - 1; i >= 0; i--) {
        const char = word[i];
        if (isNonLetter(char)) {
            end = i;
            continue;
        }
        if (substitutions_1.YERS.has(char) || isEC(word, i, end)) {
            if (isLastSyllable(word, i, end) && canOmitYer(word, i)) {
                result = replaceFleetingVowel(result, i);
            }
        }
    }
    return result;
}
exports.inferFleetingVowel = inferFleetingVowel;
function replaceFleetingVowel(word, j) {
    const consonant = shouldSoftenPreceedingConsonant(word, j)
        ? (0, soften_1.soften)(word[j - 1])
        : word[j - 1];
    const before = word.slice(0, j - 1);
    const after = word.slice(j + 1);
    return `${before}${consonant}${toBracketNotation(word[j])}${after}`;
}
function shouldSoftenPreceedingConsonant(word, i) {
    return isLN(word, i - 1) && substitutions_1.SOFT_YER_LOOSE.has(word[i]);
}
function toBracketNotation(maybeYer) {
    if (substitutions_1.SOFT_YER_LOOSE.has(maybeYer)) {
        return '(e)';
    }
    if (substitutions_1.HARD_YER_LOOSE.has(maybeYer)) {
        return '(o)';
    }
    return maybeYer;
}
function isLastSyllable(word, i, end) {
    if (i === end - 2)
        return substitutions_1.ALL_CONSONANTS.has(word[i + 1]);
    if (i === end - 3)
        return isLJNJ(word, i + 1);
    return false;
}
/**
 * Checks if the yer can be omitted in the word.
 *
 * @param word - The word to check.
 * @param i - The index of the yer.
 * @returns True if the yer can be omitted.
 */
function canOmitYer(word, i) {
    const [c2, c1] = isLJNJ(word, i - 2)
        ? [word[i - 3], word[i - 2]]
        : [word[i - 2], word[i - 1]];
    return (isNonLetter(c2) || substitutions_1.VOCALIZED.has(c2)) && c1 !== word[i + 1];
}
function isNonLetter(char) {
    return !substitutions_1.ALL_LETTERS.has(char);
}
function isLJNJ(word, i) {
    return i >= 0 && word[i + 1] === 'j' && isLN(word, i);
}
function isLN(word, i) {
    const c = word[i];
    return c === 'l' || c === 'n' || c === 'L' || c === 'N';
}
function isEC(word, i, end) {
    return i > 0 && word[i] === 'e' && word[i + 1] === 'c' && i === end - 2;
}
//# sourceMappingURL=fleetingVowels.js.map