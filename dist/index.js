"use strict";
/*
 * @interslavic/utils
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.transliterate2 = exports.transliterate = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./adjective"), exports);
tslib_1.__exportStar(require("./constants"), exports);
tslib_1.__exportStar(require("./noun"), exports);
tslib_1.__exportStar(require("./numeral"), exports);
tslib_1.__exportStar(require("./partOfSpeech"), exports);
tslib_1.__exportStar(require("./pronoun"), exports);
var transliterate_1 = require("./transliterate");
Object.defineProperty(exports, "transliterate", { enumerable: true, get: function () { return tslib_1.__importDefault(transliterate_1).default; } });
exports.transliterate2 = tslib_1.__importStar(require("./transliterate2"));
tslib_1.__exportStar(require("./verb"), exports);
//# sourceMappingURL=index.js.map