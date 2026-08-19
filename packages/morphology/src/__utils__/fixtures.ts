import fs from 'node:fs';
import path from 'node:path';

/** A row of Jan van Steenbergen's word list, as the fixtures store it. */
export type Row = [id: string, xpos: string, word: string, addition: string];

type FixtureGetter = () => Row[];

const fixturesDir = path.join(import.meta.dirname, '../__fixtures__');

const load =
  (name: string): FixtureGetter =>
  () =>
    JSON.parse(fs.readFileSync(path.join(fixturesDir, `${name}.json`), 'utf8'));

export const adjectives = load('adjectives');
export const nouns_feminine = load('nouns-feminine');
export const nouns_masculine_animate = load('nouns-masculine-animate');
export const nouns_masculine = load('nouns-masculine');
export const nouns_misc = load('nouns-misc');
export const nouns_neuter = load('nouns-neuter');
export const verbs_imperfect = load('verbs-imperfect');
export const verbs_perfect = load('verbs-perfect');
export const verbs_misc = load('verbs-misc');
export const pronouns_demonstrative = load('pronouns-demonstrative');
export const pronouns_indefinite = load('pronouns-indefinite');
export const pronouns_interrogative = load('pronouns-interrogative');
export const pronouns_personal = load('pronouns-personal');
export const pronouns_possessive = load('pronouns-possessive');
export const pronouns_reciprocal = load('pronouns-reciprocal');
export const pronouns_reflexive = load('pronouns-reflexive');
export const pronouns_relative = load('pronouns-relative');
export const other = load('other');

/** The same rows, picked by file name rather than one getter at a time. */
export function fixtures(...names: string[]): Row[] {
  return names.flatMap(
    (name) =>
      JSON.parse(
        fs.readFileSync(path.join(fixturesDir, `${name}.json`), 'utf-8'),
      ) as Row[],
  );
}

export const NOUNS = [
  'nouns-feminine',
  'nouns-masculine',
  'nouns-masculine-animate',
  'nouns-misc',
  'nouns-neuter',
];

export const ADJECTIVES = ['adjectives'];

export const VERBS = ['verbs-imperfect', 'verbs-perfect', 'verbs-misc'];

export const PRONOUNS = [
  'pronouns-demonstrative',
  'pronouns-indefinite',
  'pronouns-interrogative',
  'pronouns-personal',
  'pronouns-possessive',
  'pronouns-reciprocal',
  'pronouns-reflexive',
  'pronouns-relative',
];

export const OTHER = ['other'];
