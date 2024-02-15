import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { conjugationVerb } from './conjugationVerb';

const rawTestCases = yaml.load(
  fs.readFileSync(path.join(__dirname, 'testCases.yml'), 'utf8'),
) as { morphology: string; lemma: string; extra?: string }[];

const verb = rawTestCases.map(
  (t) => [t.lemma, t.extra ?? '', t.morphology] as const,
);

describe('verb', () => {
  test.each(verb)('%s %s', (lemma, extra, morphology) => {
    if (!morphology.startsWith('v.')) throw 'not a verb';
    const actual = conjugationVerb(lemma, extra);
    expect(actual).toMatchSnapshot();
  });
});
