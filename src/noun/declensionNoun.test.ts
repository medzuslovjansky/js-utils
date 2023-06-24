import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

import { parsePos } from '../partOfSpeech';
import { declensionNoun } from './declensionNoun';

const rawTestCases = yaml.load(
  fs.readFileSync(path.join(__dirname, 'testCases.yml'), 'utf8'),
) as { morphology: string; lemma: string; extra?: string }[];

const noun = rawTestCases.map(
  (t) => [t.morphology, t.lemma, t.extra ?? ''] as const,
);

describe('noun', () => {
  test.each(noun)('%s %s %s', (details, word, add) => {
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
