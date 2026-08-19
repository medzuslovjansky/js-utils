import fs from 'node:fs';
import path from 'node:path';

// Only test-reporter.mjs imports this module, and `src/__utils__` is excluded
// from the CommonJS build, so `import.meta` is safe here.
const fixturesDir = path.join(import.meta.dirname, '../__fixtures__');

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
