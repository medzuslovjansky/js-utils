import assert from 'node:assert';
import fs from 'node:fs';
import { test } from 'node:test';

import { render, stopWordStems, TARGET } from './stopwords.ts';

/**
 * The stop word list is stems, so it goes stale the moment the stemmer changes,
 * and a stale entry silently stops matching — nothing else would notice. This
 * is the only thing that does.
 */
test('the committed stop word list matches the stemmer', () => {
  assert.strictEqual(
    fs.readFileSync(TARGET, 'utf8'),
    render(stopWordStems().kept),
    'run `yarn workspace @interslavic/dev-stembench stopwords`',
  );
});
