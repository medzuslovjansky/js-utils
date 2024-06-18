import fs from 'node:fs';
import path from 'node:path';
import { parsePos } from '../partOfSpeech';

const fixturesDir = path.join(__dirname, '../../src/__fixtures__');

let fixtures: Map<string, string[]> | undefined;

export function findLemmaById(id: string): string {
  return initFixtures().get(id)?.[2] ?? id;
}

export function findPosTags(id: string): string[] {
  const pos = initFixtures().get(id)?.[1];
  if (!pos) return [];

  const { name, ...attributes } = parsePos(pos);
  const trueAttributes = Object.entries(attributes)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  return [name, ...trueAttributes];
}

function initFixtures() {
  if (!fixtures) {
    const map = (fixtures = new Map());
    fs.readdirSync(fixturesDir).forEach((name) => {
      const jsonPath = path.join(fixturesDir, name);
      const json = fs.readFileSync(jsonPath, 'utf-8');
      const data = JSON.parse(json);
      for (const row of data) {
        map.set(row[0], row);
      }
    });
  }

  return fixtures;
}
