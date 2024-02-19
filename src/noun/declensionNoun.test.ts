import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import uniqBy from 'lodash/uniqBy';

import { parsePos } from '../partOfSpeech';
import { declensionNoun } from './declensionNoun';

const rawTestCases = yaml.load(
  fs.readFileSync(path.join(__dirname, 'testCases.yml'), 'utf8'),
) as { morphology: string; lemma: string; extra?: string }[];

const noun = uniqBy(
  rawTestCases.map((t) => [t.lemma, t.morphology, t.extra ?? ''] as const),
  String,
);

describe('noun', () => {
  test.each(noun)('%s', (word, details, add) => {
    const pos = parsePos(details);
    if (pos.name !== 'noun') throw 'not a noun';

    const actual = declensionNoun(
      word,
      add,
      pos.gender!,
      pos.animate,
      pos.plural,
      pos.singular,
      pos.indeclinable,
    );

    expect(actual).toMatchSnapshot();
  });
});
