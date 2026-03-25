"use strict";
// noinspection NonAsciiCharacters,JSNonASCIINames
Object.defineProperty(exports, "__esModule", { value: true });
exports.latn2glag = void 0;
const createReplacer_1 = require("./createReplacer");
const constants_1 = require("../constants");
const replaceByWord_1 = require("./replaceByWord");
const syllabicR_1 = require("./syllabicR");
function optionsToInt({ latinateMyslite, shta }) {
    const b0 = latinateMyslite ? 1 : 0;
    const b1 = shta ? 2 : 0;
    return b0 | b1;
}
const MEMO = {};
const desoftener = (0, createReplacer_1.createReplacer)({
    ď: 'dь',
    ľ: 'lь',
    lj: 'lь',
    ń: 'nь',
    nj: 'nь',
    ŕ: 'rь',
    ś: 'sь',
    ť: 'tь',
    ź: 'zь',
    Ŕ: 'ьr',
});
const punctuate = (0, createReplacer_1.createReplacer)({
    '?': ';',
    '.': '։',
    ',': '·',
    '(': '⁖',
    ')': '჻',
    '"': '⸪',
    '«': '⸪',
    '»': '⸪',
    '!': '··',
    ':': '⸬',
    ';': '⁘',
    '...': '···',
    '…': '···',
});
const izhefy = (0, createReplacer_1.createReplacer)({
    [constants_1.Glagolitic.Yeri + constants_1.Glagolitic.Izhe]: constants_1.Glagolitic.Yeri + constants_1.Glagolitic.Initial_Izhe,
    [constants_1.Glagolitic.Izhe + constants_1.Glagolitic.Izhe]: constants_1.Glagolitic.Izhe + constants_1.Glagolitic.Initial_Izhe,
});
function buildGlagolitizer({ latinateMyslite = false, shta = false, }) {
    const id = optionsToInt({ latinateMyslite, shta });
    if (!MEMO[id]) {
        const glagolify = (0, createReplacer_1.createReplacer)({
            a: constants_1.Glagolitic.Azu,
            å: constants_1.Glagolitic.Otu,
            b: constants_1.Glagolitic.Buky,
            c: constants_1.Glagolitic.Tsi,
            ć: shta ? constants_1.Glagolitic.Shta : constants_1.Glagolitic.Chrivi + constants_1.Glagolitic.Yeri,
            č: constants_1.Glagolitic.Chrivi,
            d: constants_1.Glagolitic.Dobro,
            đ: constants_1.Glagolitic.Djervi,
            ѕ: constants_1.Glagolitic.Dzelo,
            dž: constants_1.Glagolitic.Dobro + constants_1.Glagolitic.Zhivete,
            e: constants_1.Glagolitic.Yestu,
            ě: constants_1.Glagolitic.Yati,
            ę: constants_1.Glagolitic.Small_Yus,
            ė: constants_1.Glagolitic.Yeri,
            ь: constants_1.Glagolitic.Yeri,
            f: constants_1.Glagolitic.Fritu,
            g: constants_1.Glagolitic.Glagoli,
            h: constants_1.Glagolitic.Heru,
            i: constants_1.Glagolitic.I,
            j: constants_1.Glagolitic.Izhe,
            '’j': constants_1.Glagolitic.Initial_Izhe,
            ję: constants_1.Glagolitic.Iotated_Small_Yus,
            jo: constants_1.Glagolitic.Yo,
            ju: constants_1.Glagolitic.Yu,
            jų: constants_1.Glagolitic.Iotated_Big_Yus,
            k: constants_1.Glagolitic.Kako,
            l: constants_1.Glagolitic.Ljudije,
            m: latinateMyslite ? constants_1.Glagolitic.Latinate_Myslite : constants_1.Glagolitic.Myslite,
            mj: (latinateMyslite ? constants_1.Glagolitic.Latinate_Myslite : constants_1.Glagolitic.Myslite) +
                constants_1.Glagolitic.Initial_Izhe,
            n: constants_1.Glagolitic.Nashi,
            o: constants_1.Glagolitic.Onu,
            ȯ: constants_1.Glagolitic.Yeru,
            p: constants_1.Glagolitic.Pokoji,
            pj: constants_1.Glagolitic.Pokoji + constants_1.Glagolitic.Initial_Izhe,
            r: constants_1.Glagolitic.Ritsi,
            R: constants_1.Glagolitic.Yeru + constants_1.Glagolitic.Ritsi,
            s: constants_1.Glagolitic.Slovo,
            sj: constants_1.Glagolitic.Slovo + constants_1.Glagolitic.Initial_Izhe,
            š: constants_1.Glagolitic.Sha,
            t: constants_1.Glagolitic.Tvrido,
            tj: constants_1.Glagolitic.Tvrido + constants_1.Glagolitic.Initial_Izhe,
            θ: constants_1.Glagolitic.Fita,
            u: constants_1.Glagolitic.Uku,
            ų: constants_1.Glagolitic.Big_Yus,
            ù: constants_1.Glagolitic.Izhitsa,
            v: constants_1.Glagolitic.Vedi,
            vj: constants_1.Glagolitic.Vedi + constants_1.Glagolitic.Initial_Izhe,
            y: constants_1.Glagolitic.Yeru + constants_1.Glagolitic.Izhe,
            z: constants_1.Glagolitic.Zemlja,
            ž: constants_1.Glagolitic.Zhivete, // ⰶ
        });
        MEMO[id] = (word) => izhefy(glagolify(desoftener((0, syllabicR_1.syllabicR)(word))));
    }
    return MEMO[id];
}
const DEFAULT_OPTIONS = {
    latinateMyslite: false,
    shta: true,
};
function latn2glag(text, options = DEFAULT_OPTIONS) {
    return punctuate((0, replaceByWord_1.replaceByWord)(text, buildGlagolitizer(options)));
}
exports.latn2glag = latn2glag;
//# sourceMappingURL=latn2glag.js.map