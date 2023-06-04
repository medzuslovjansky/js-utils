import fs from 'node:fs';
import path from 'node:path';

import { declensionNumeral } from './declensionNumeral';
import { parsePos } from '../partOfSpeech';

const rawTestCases: any[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'testCases.json'), 'utf8'),
);

describe('numeral', () => {
  const numeral = (rawTestCases as any[]).map(
    (t) => [t.init.word, t.init.details, t.expected] as const,
  );

  test.each(numeral)('%s', (word, details, expected: any) => {
    const actual = declensionNumeral(word, getNumeralType(details)!);

    if (actual === null) {
      expect(actual).toBe(expected);
    } else {
      expect(actual).toMatchObject(expected);
    }
  });
});

function getNumeralType(details: string) {
  const pos = parsePos(details);
  return pos.name === 'numeral' ? pos.type : null;
}
