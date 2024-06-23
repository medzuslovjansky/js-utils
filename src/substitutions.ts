export const ALL_CHARACTERS =
  'aáàăâåąāæbcćçčdďđḓeéèĕêěëėęēǝfghiíìĭîīıjĵklĺľļłŀǉmnńňñņǌoóòŏôöȯǫœpqrŕṙřsśšŠtťṱuúùŭûůũųūvwxyýzźżž'.split(
    '',
  );

export const ANY = ALL_CHARACTERS;

export const CONSONANT_CHARACTERS =
  'bcćçčdďđḓfghklĺľļłŀǉmnńňñņǌpqrŕṙřsśštťṱvwxzźżž'.split('');

export const CONSONANT = CONSONANT_CHARACTERS;

export const VOWEL_CHARACTERS =
  'aáàăâåąāæeéèĕêěëėęēǝiíìĭîīıoóòŏôöȯǫœuúùŭûůũųūyý'.split('');

export const VOWEL = VOWEL_CHARACTERS;

export const LJ_NJ = ['lj', 'nj'];
export const LJj_NJj = ['lj', 'ĺj', 'ľj', 'ǉ', 'nj', 'ńj', 'ňj', 'ñj', 'ǌ'];

export const BIG_YUS = 'ų';
export const SMALL_YUS = 'ę';
export const BIG_YUS_LOOSE = ['u', BIG_YUS];
export const SMALL_YUS_LOOSE = ['e', SMALL_YUS];
export const NASAL_VOWELS = [SMALL_YUS, BIG_YUS];
export const NASAL_VOWELS_LOOSE = [...SMALL_YUS_LOOSE, ...BIG_YUS_LOOSE];
