"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transliterate_1 = require("./transliterate");
function transliterate(text, lang, preprocessed = false) {
    switch (lang) {
        case 'isv-Latn':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.Latin, transliterate_1.FlavorizationType.Standard, preprocessed);
        case 'isv-Cyrl':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.StandardCyrillic, transliterate_1.FlavorizationType.Standard, preprocessed);
        case 'isv-Glag':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.Glagolitic, transliterate_1.FlavorizationType.Standard, preprocessed);
        case 'isv-x-fonipa':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.IPA, transliterate_1.FlavorizationType.Etymological, preprocessed);
        case 'isv-Latn-x-etymolog':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.Latin, transliterate_1.FlavorizationType.Etymological, preprocessed);
        case 'isv-Cyrl-x-etymolog':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.StandardCyrillic, transliterate_1.FlavorizationType.Etymological, preprocessed);
        case 'isv-Glag-x-etymolog':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.Glagolitic, transliterate_1.FlavorizationType.Etymological, preprocessed);
        case 'isv-Cyrl-x-iotated':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.TraditionalIotatedCyrillic, transliterate_1.FlavorizationType.Standard, preprocessed);
        case 'isv-Cyrl-x-iotated-ext':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.TraditionalIotatedCyrillic, transliterate_1.FlavorizationType.CyrillicExtended, preprocessed);
        case 'isv-Cyrl-x-northern':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.StandardCyrillic, transliterate_1.FlavorizationType.Northern, preprocessed);
        case 'isv-Cyrl-x-sloviant':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.StandardCyrillic, transliterate_1.FlavorizationType.Slovianto, preprocessed);
        case 'isv-Cyrl-x-southern':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.StandardCyrillic, transliterate_1.FlavorizationType.Southern, preprocessed);
        case 'isv-Latn-PL':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.Polish, transliterate_1.FlavorizationType.Etymological, preprocessed);
        case 'isv-Latn-x-ascii':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.ASCII, transliterate_1.FlavorizationType.Standard, preprocessed);
        case 'isv-Latn-x-northern':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.Latin, transliterate_1.FlavorizationType.Northern, preprocessed);
        case 'isv-Latn-x-sloviant':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.Latin, transliterate_1.FlavorizationType.Slovianto, preprocessed);
        case 'isv-Latn-x-southern':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.Latin, transliterate_1.FlavorizationType.Southern, preprocessed);
        case 'isv-Glag-x-northern':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.Glagolitic, transliterate_1.FlavorizationType.Northern, preprocessed);
        case 'isv-Glag-x-southern':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.Glagolitic, transliterate_1.FlavorizationType.Southern, preprocessed);
        case 'isv-Glag-x-sloviant':
            return (0, transliterate_1.transliterate)(text, transliterate_1.TransliterationType.Glagolitic, transliterate_1.FlavorizationType.Slovianto, preprocessed);
        case 'isv':
            return text;
        default:
            throw new TypeError(`Unsupported IETF BCP47 tag: ${lang}`);
    }
}
exports.default = transliterate;
//# sourceMappingURL=index.js.map