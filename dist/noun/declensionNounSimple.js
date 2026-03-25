"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declensionNounSimple = void 0;
const partOfSpeech_1 = require("../partOfSpeech");
const declensionNoun_1 = require("./declensionNoun");
function declensionNounSimple(lemma, morphology, extra = '', genderOverride) {
    const pos = (0, partOfSpeech_1.parsePos)(morphology);
    if (pos.name !== 'noun')
        throw new Error('not a noun');
    let gender = pos.gender;
    if (gender === 'masculineOrFeminine') {
        gender = genderOverride ?? gender;
    }
    return (0, declensionNoun_1.declensionNoun)(lemma, extra, gender, pos.animate, pos.plural, pos.singular, pos.indeclinable);
}
exports.declensionNounSimple = declensionNounSimple;
//# sourceMappingURL=declensionNounSimple.js.map