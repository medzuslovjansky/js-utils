import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import uniqBy from 'lodash/uniqBy';
import {
  declensionAdjective,
  declensionAdjectiveFlat,
} from './declensionAdjective';

const rawTestCases = yaml.load(
  fs.readFileSync(path.join(__dirname, 'testCases.yml'), 'utf8'),
) as { morphology: string; lemma: string; extra?: string }[];

const adjective = uniqBy(
  rawTestCases.map((t) => [t.lemma, t.extra ?? '', t.morphology] as const),
  String,
);

describe('adjective', () => {
  test.each(adjective)('%s', (lemma, _extra, morphology) => {
    if (!morphology.startsWith('adj')) throw 'not an adjective';
    const actual = declensionAdjective(lemma, '', morphology);
    expect(actual).toMatchSnapshot();
  });
});

test('declensionAdjectiveFlat integrity', () => {
  const positive = declensionAdjectiveFlat('dobry', '', 'adj.');
  const comparative = declensionAdjectiveFlat('lěpši', '', 'adj.comp.');
  const superlative = declensionAdjectiveFlat('najlěpši', '', 'adj.sup.');
  const joint = [...positive, ...comparative, ...superlative];

  // No empty strings expected
  expect(joint.filter(Boolean).length).toBe(joint.length);
  expect(positive.length).toBe(18);
  expect(comparative.length).toBe(14);
  expect(superlative.length).toBe(12);
});
