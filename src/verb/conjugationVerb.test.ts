import fs from 'node:fs';
import path from 'node:path';

import { conjugationVerb } from './conjugationVerb';

const rawTestCases: any[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'testCases.json'), 'utf8'),
);

describe('verb', () => {
  const verb = (rawTestCases as any[]).map((t) => [
    t.init.word,
    t.init.add,
    t.expected,
  ]);

  test.each(verb)('%s', (word: string, add: string, expected: any) => {
    const actual = conjugationVerb(word, add);

    if (actual === null) {
      expect(actual).toBe(expected);
    } else {
      expect(actual).toMatchObject(expected);
    }
  });
});
