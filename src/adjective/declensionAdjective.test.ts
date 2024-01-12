import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { declensionAdjective } from './declensionAdjective';

const rawTestCases = yaml.load(
  fs.readFileSync(path.join(__dirname, 'testCases.yml'), 'utf8'),
) as { morphology: string; lemma: string; extra?: string }[];

const adjective = rawTestCases.map(
  (t) => [t.lemma, t.extra ?? '', t.morphology] as const,
);

describe('adjective', () => {
  test.each(adjective)('%s %s', (lemma, _extra, morphology) => {
    if (!morphology.startsWith('adj')) throw 'not an adjective';
    const actual = declensionAdjective(lemma, '');
    expect(actual).toMatchSnapshot();
  });
});
