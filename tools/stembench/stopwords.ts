import fs from 'node:fs';
import path from 'node:path';

import { stem } from '@interslavic/stemmer';

import { FIXTURES_DIR, type FixtureRow } from '../dump/dump.ts';

const FUNCTION_POS = /^(prep|conj|particle)/;

export const TARGET = path.join(
  import.meta.dirname,
  '../../packages/stemmer/src/stopwords.ts',
);

/**
 * The stems of the lexicon's function words, minus every stem a content word
 * also produces — dropping `oko` the eye to save `okolo` the preposition is not
 * a trade worth making.
 */
export function stopWordStems(): { kept: string[]; dropped: string[] } {
  const functional = new Set<string>();
  const content = new Set<string>();

  for (const name of fs.readdirSync(FIXTURES_DIR)) {
    if (!name.endsWith('.json')) continue;

    const rows = JSON.parse(
      fs.readFileSync(path.join(FIXTURES_DIR, name), 'utf8'),
    ) as FixtureRow[];

    for (const [, xpos, isv] of rows) {
      if (isv.includes(' ')) continue;

      const isFunction =
        name.startsWith('pronouns') ||
        (name.startsWith('other') && FUNCTION_POS.test(xpos));

      (isFunction ? functional : content).add(stem(isv));
    }
  }

  return {
    kept: [...functional].filter((s) => s && !content.has(s)).sort(),
    dropped: [...functional].filter((s) => s && content.has(s)).sort(),
  };
}

/** The file body the generator writes, so a test can compare without writing. */
export function render(kept: readonly string[]): string {
  const header = fs.readFileSync(TARGET, 'utf8').split('export const')[0];

  return (
    header +
    'export const STOP_WORDS: readonly string[] = [\n' +
    kept.map((s) => `  '${s}',\n`).join('') +
    '];\n'
  );
}

if (import.meta.filename === process.argv[1]) {
  const { kept, dropped } = stopWordStems();
  fs.writeFileSync(TARGET, render(kept));
  console.log(`${kept.length} stop stems → ${TARGET}`);
  console.log(`${dropped.length} dropped as ambiguous: ${dropped.join(' ')}`);
}
