"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NASAL_VOWELS_LOOSE = exports.NASAL_VOWELS = exports.SMALL_YUS_LOOSE = exports.IOTATED_SMALL_YUS = exports.BIG_YUS_LOOSE = exports.SMALL_YUS = exports.BIG_YUS = exports.LJj_NJj = exports.LJ_NJ = exports.HARD_YER_LOOSE = exports.SOFT_YER_LOOSE = exports.YERS = exports.VOCALIZED = exports.VOWELS = exports.SOFT_CONSONANTS = exports.ALL_VOWELS = exports.ALL_CONSONANTS = exports.ALL_LETTERS = void 0;
class LetterSet extends Set {
    toString() {
        return [...this].join('');
    }
}
exports.ALL_LETTERS = new LetterSet('aáàăâåąāæbcćçčdďđḓeéèĕêěëėęēǝfghiíìĭîīıjĵklĺľļłŀǉmnńňñņǌoóòŏôöȯǫœpqrŕṙřsśšŠtťṱuúùŭûůũųūvwxyýzźżž');
exports.ALL_CONSONANTS = new LetterSet('bcćçčdďđḓfghklĺľļłŀǉmnńňñņǌpqrŕṙřsśštťṱvwxzźżž');
exports.ALL_VOWELS = new LetterSet('aáàăâåąāæeéèĕêěëėęēǝiíìĭîīıoóòŏôöȯǫœuúùŭûůũųūyý');
exports.SOFT_CONSONANTS = new LetterSet('jcćčšžŕĺľťśď');
exports.VOWELS = new LetterSet('aåeęěėioȯuųy');
exports.VOCALIZED = new LetterSet('aåeęěèėioȯòrŕuųy');
exports.YERS = new LetterSet('èėȯò');
exports.SOFT_YER_LOOSE = new LetterSet('eèė');
exports.HARD_YER_LOOSE = new LetterSet('oȯò');
exports.LJ_NJ = ['lj', 'nj'];
exports.LJj_NJj = ['lj', 'ĺj', 'ľj', 'ǉ', 'nj', 'ńj', 'ňj', 'ñj', 'ǌ'];
exports.BIG_YUS = 'ų';
exports.SMALL_YUS = 'ę';
exports.BIG_YUS_LOOSE = ['u', exports.BIG_YUS];
exports.IOTATED_SMALL_YUS = 'ję';
exports.SMALL_YUS_LOOSE = ['e', exports.SMALL_YUS];
exports.NASAL_VOWELS = [exports.SMALL_YUS, exports.BIG_YUS];
exports.NASAL_VOWELS_LOOSE = [...exports.SMALL_YUS_LOOSE, ...exports.BIG_YUS_LOOSE];
//# sourceMappingURL=substitutions.js.map