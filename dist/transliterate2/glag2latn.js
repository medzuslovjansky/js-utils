"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.glag2latn = void 0;
const createReplacer_1 = require("./createReplacer");
const constants_1 = require("../constants");
const replaceByWord_1 = require("./replaceByWord");
const punctuate = (0, createReplacer_1.createReplacer)({
    ';': '?',
    '։': '.',
    '·': ',',
    '⁖': '(',
    '჻': ')',
    '⸪': '"',
    '··': '!',
    '⸬': ':',
    '⁘': ';',
    '···': '...',
});
const softener = (0, createReplacer_1.createReplacer)({
    dь: 'ď',
    lь: 'ľ',
    nь: 'ń',
    rь: 'ŕ',
    sь: 'ś',
    tь: 'ť',
    zь: 'ź',
    ьr: 'ŕ',
    ȯr: 'r',
});
const yerify = (word) => word.replace(/([dlnrstz])ь([cčklnr])/, '$1ė$2');
const deglagolify = (0, createReplacer_1.createReplacer)({
    [constants_1.Glagolitic.Azu]: 'a',
    [constants_1.Glagolitic.Otu]: 'å',
    [constants_1.Glagolitic.Buky]: 'b',
    [constants_1.Glagolitic.Tsi]: 'c',
    [constants_1.Glagolitic.Chrivi]: 'č',
    [constants_1.Glagolitic.Chrivi + constants_1.Glagolitic.Yeri]: 'ć',
    [constants_1.Glagolitic.Shta]: 'ć',
    [constants_1.Glagolitic.Dobro]: 'd',
    [constants_1.Glagolitic.Djervi]: 'đ',
    [constants_1.Glagolitic.Dzelo]: 'ѕ',
    [constants_1.Glagolitic.Yestu]: 'e',
    [constants_1.Glagolitic.Yati]: 'ě',
    [constants_1.Glagolitic.Small_Yus]: 'ę',
    [constants_1.Glagolitic.Yeri]: 'ь',
    [constants_1.Glagolitic.Fritu]: 'f',
    [constants_1.Glagolitic.Glagoli]: 'g',
    [constants_1.Glagolitic.Heru]: 'h',
    [constants_1.Glagolitic.Spidery_Ha]: 'h',
    [constants_1.Glagolitic.I]: 'i',
    [constants_1.Glagolitic.Izhe]: 'j',
    [constants_1.Glagolitic.Initial_Izhe]: 'j',
    [constants_1.Glagolitic.Trokutasti_A]: 'ja',
    [constants_1.Glagolitic.Iotated_Small_Yus]: 'ję',
    [constants_1.Glagolitic.Yo]: 'jo',
    [constants_1.Glagolitic.Yu]: 'ju',
    [constants_1.Glagolitic.Iotated_Big_Yus]: 'jų',
    [constants_1.Glagolitic.Kako]: 'k',
    [constants_1.Glagolitic.Ljudije]: 'l',
    [constants_1.Glagolitic.Myslite]: 'm',
    [constants_1.Glagolitic.Latinate_Myslite]: 'm',
    [constants_1.Glagolitic.Nashi]: 'n',
    [constants_1.Glagolitic.Onu]: 'o',
    [constants_1.Glagolitic.Yeru]: 'ȯ',
    [constants_1.Glagolitic.Pokoji]: 'p',
    [constants_1.Glagolitic.Ritsi]: 'r',
    [constants_1.Glagolitic.Slovo]: 's',
    [constants_1.Glagolitic.Sha]: 'š',
    [constants_1.Glagolitic.Tvrido]: 't',
    [constants_1.Glagolitic.Fita]: 'θ',
    [constants_1.Glagolitic.Uku]: 'u',
    [constants_1.Glagolitic.Big_Yus]: 'ų',
    [constants_1.Glagolitic.Izhitsa]: 'ù',
    [constants_1.Glagolitic.Vedi]: 'v',
    [constants_1.Glagolitic.Yeri + constants_1.Glagolitic.Izhe]: 'y',
    [constants_1.Glagolitic.Yeru + constants_1.Glagolitic.Izhe]: 'y',
    [constants_1.Glagolitic.Zemlja]: 'z',
    [constants_1.Glagolitic.Zhivete]: 'ž',
});
function glag2latn4word(word) {
    return softener(yerify(deglagolify(word)));
}
function glag2latn(text) {
    return punctuate((0, replaceByWord_1.replaceByWord)(text, glag2latn4word));
}
exports.glag2latn = glag2latn;
//# sourceMappingURL=glag2latn.js.map