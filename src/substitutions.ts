class LetterSet extends Set<string> {
  toString() {
    return [...this].join('');
  }
}

export const ALL_LETTERS = new LetterSet(
  'aáàăâåąāæbcćçčdďđḓeéèĕêěëėęēǝfghiíìĭîīıjĵklĺľļłŀǉmnńňñņǌoóòŏôöȯǫœpqrŕṙřsśšŠtťṱuúùŭûůũųūvwxyýzźżž',
);

export const ALL_CONSONANTS = new LetterSet(
  'bcćçčdďđḓfghklĺľļłŀǉmnńňñņǌpqrŕṙřsśštťṱvwxzźżž',
);

export const ALL_VOWELS = new LetterSet(
  'aáàăâåąāæeéèĕêěëėęēǝiíìĭîīıoóòŏôöȯǫœuúùŭûůũųūyý',
);

export const SOFT_CONSONANTS = new LetterSet('jcćčšžŕĺľťśď');

export const VOWELS = new LetterSet('aåeęěėioȯuųy');
export const YERS = new LetterSet('èėȯò');
export const SOFT_YER_LOOSE = new LetterSet('eèė');
export const HARD_YER_LOOSE = new LetterSet('oȯò');

export const LJ_NJ = ['lj', 'nj'];
export const LJj_NJj = ['lj', 'ĺj', 'ľj', 'ǉ', 'nj', 'ńj', 'ňj', 'ñj', 'ǌ'];

export const BIG_YUS = 'ų';
export const SMALL_YUS = 'ę';
export const BIG_YUS_LOOSE = ['u', BIG_YUS];
export const IOTATED_SMALL_YUS = 'ję';
export const SMALL_YUS_LOOSE = ['e', SMALL_YUS];
export const NASAL_VOWELS = [SMALL_YUS, BIG_YUS];
export const NASAL_VOWELS_LOOSE = [...SMALL_YUS_LOOSE, ...BIG_YUS_LOOSE];
