import fs from 'node:fs';
import path from 'node:path';

import { declensionAdjective } from './declensionAdjective';

const rawTestCases: any[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'testCases.json'), 'utf8'),
);

describe('adjective', () => {
  const adjective = (rawTestCases as any[]).map(
    ({ init, expected }) => [init.word, expected] as const,
  );

  test.each(adjective)('%s', (word, expected) => {
    const actual = declensionAdjective(word, '');

    if (actual === null) {
      expect(actual).toBe(expected);
    } else {
      expect(actual).toMatchObject(expected);
    }
  });
});
