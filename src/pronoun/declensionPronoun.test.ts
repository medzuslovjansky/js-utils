import fs from 'node:fs';
import path from 'node:path';

import { declensionPronoun } from './declensionPronoun';
import { parsePos } from '../partOfSpeech';

const rawTestCases: any[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'testCases.json'), 'utf8'),
);

describe('pronoun', () => {
  const pronoun = (rawTestCases as any[]).map(
    (t) => [t.init.word, t.init.details, t.expected] as const,
  );

  test.each(pronoun)('%s', (word, details, expected: any) => {
    const actual = declensionPronoun(word, getPronounType(details)!);

    if (actual === null) {
      expect(actual).toBe(expected);
    } else {
      expect(actual).toMatchObject(expected);
    }
  });

  test.each([
    ['ona', 'onoj'],
    ['ono', 'onoj'],
    ['ota', 'otoj'],
    ['oto', 'otoj'],
    ['ova', 'ov'],
    ['ovo', 'ov'],
    ['tamta', 'tamtoj'],
    ['tamto', 'tamtoj'],
    ['tuta', 'tutoj'],
    ['tuto', 'tutoj'],
    ['ta', 'toj'],
    ['to', 'toj'],
    ['te', 'toj'],
    ['se', 'sej'],
    ['sa', 'sej'],
  ])('%s (pron.dem.) should decline as %s', (alternative, canonical) => {
    const actual = declensionPronoun(alternative, 'demonstrative');
    const expected = declensionPronoun(canonical, 'demonstrative');
    expect(actual?.casesSingular).toEqual(expected?.casesSingular);
    expect(actual?.casesPlural).toEqual(expected?.casesPlural);
  });
});

function getPronounType(details: string) {
  const pos = parsePos(details);
  return pos.name === 'pronoun' ? pos.type : null;
}
