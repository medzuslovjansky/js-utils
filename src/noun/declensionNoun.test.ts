import fs from 'node:fs';
import path from 'node:path';

import { parsePos } from '../partOfSpeech';
import { declensionNoun } from './declensionNoun';

const rawTestCases: any[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'testCases.json'), 'utf8'),
);

describe('noun', () => {
  const noun = rawTestCases.map(
    (t) => [t.init.word, t.init.details, t.init.add, t.expected] as const,
  );

  test.each(noun)('%s', (word, details, add, expected: any) => {
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

    if (actual === null) {
      expect(actual).toBe(expected);
    } else {
      expect(actual).toMatchObject(expected);
    }
  });
});
