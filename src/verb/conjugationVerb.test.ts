import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import uniqBy from 'lodash/uniqBy';
import { conjugationVerb } from './conjugationVerb';

const rawTestCases = yaml.load(
  fs.readFileSync(path.join(__dirname, 'testCases.yml'), 'utf8'),
) as { morphology: string; lemma: string; extra?: string }[];

const verb = uniqBy(
  rawTestCases.map((t) => [t.lemma, t.extra ?? '', t.morphology] as const),
  String,
);

describe('verb', () => {
  test.each(verb)('%s', (lemma, extra, morphology) => {
    if (!morphology.startsWith('v.')) throw 'not a verb';
    const actual = conjugationVerb(lemma, extra);
    expect(actual).toMatchSnapshot();
  });
});
