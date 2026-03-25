"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declensionPronounSimple = void 0;
const partOfSpeech_1 = require("../partOfSpeech");
const declensionPronoun_1 = require("./declensionPronoun");
function declensionPronounSimple(lemma, morphology) {
    const pos = (0, partOfSpeech_1.parsePos)(morphology);
    if (pos.name !== 'pronoun')
        throw new TypeError(`${lemma} (${morphology} is not a pronoun`);
    return (0, declensionPronoun_1.declensionPronoun)(lemma, pos.type);
}
exports.declensionPronounSimple = declensionPronounSimple;
//# sourceMappingURL=declensionPronounSimple.js.map