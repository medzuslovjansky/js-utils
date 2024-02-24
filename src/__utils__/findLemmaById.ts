import fs from 'node:fs';
import path from 'node:path';

const fixturesDir = path.join(__dirname, '../../src/__fixtures__');

let fixtures: Map<string, string[]> | undefined;

export function findLemmaById(id: string): string {
  return initFixtures().get(id)?.[2] ?? id;
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
