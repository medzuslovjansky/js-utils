type FixtureGetter = () => [string, string, string, string][];

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
