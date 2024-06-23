export const ALL_LETTERS = new Set(
  'aáàăâåąāæbcćçčdďđḓeéèĕêěëėęēǝfghiíìĭîīıjĵklĺľļłŀǉmnńňñņǌoóòŏôöȯǫœpqrŕṙřsśšŠtťṱuúùŭûůũųūvwxyýzźżž',
);

export const ALL_CONSONANTS = new Set(
  'bcćçčdďđḓfghklĺľļłŀǉmnńňñņǌpqrŕṙřsśštťṱvwxzźżž',
);

export const ALL_VOWELS = new Set(
  'aáàăâåąāæeéèĕêěëėęēǝiíìĭîīıoóòŏôöȯǫœuúùŭûůũųūyý',
);

export const VOWELS = new Set('aåeęěėioȯuųy');

export const LJ_NJ = ['lj', 'nj'];
export const LJj_NJj = ['lj', 'ĺj', 'ľj', 'ǉ', 'nj', 'ńj', 'ňj', 'ñj', 'ǌ'];

export const BIG_YUS = 'ų';
export const SMALL_YUS = 'ę';
export const BIG_YUS_LOOSE = ['u', BIG_YUS];
export const IOTATED_SMALL_YUS = 'ję';
export const SMALL_YUS_LOOSE = ['e', SMALL_YUS];
export const NASAL_VOWELS = [SMALL_YUS, BIG_YUS];
export const NASAL_VOWELS_LOOSE = [...SMALL_YUS_LOOSE, ...BIG_YUS_LOOSE];
