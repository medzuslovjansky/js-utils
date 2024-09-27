type FixtureGetter = () => [string, string, string, string][];
type StringsGetter = () => string[];

export const adjectives: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/adjectives.json');
export const nouns_feminine: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/nouns-feminine.json');
export const nouns_masculine_animate: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/nouns-masculine-animate.json');
export const nouns_masculine: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/nouns-masculine.json');
export const nouns_misc: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/nouns-misc.json');
export const nouns_neuter: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/nouns-neuter.json');
export const verbs_imperfect: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/verbs-imperfect.json');
export const verbs_perfect: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/verbs-perfect.json');
export const verbs_misc: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/verbs-misc.json');
export const pronouns_demonstrative: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/pronouns-demonstrative.json');
export const pronouns_indefinite: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/pronouns-indefinite.json');
export const pronouns_interrogative: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/pronouns-interrogative.json');
export const pronouns_personal: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/pronouns-personal.json');
export const pronouns_possessive: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/pronouns-possessive.json');
export const pronouns_reciprocal: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/pronouns-reciprocal.json');
export const pronouns_reflexive: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/pronouns-reflexive.json');
export const pronouns_relative: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/pronouns-relative.json');
export const other: FixtureGetter = () =>
  jest.requireActual('../__fixtures__/other.json');
export const word_forms: StringsGetter = () =>
  jest.requireActual('../__fixtures__/word-forms.json');
