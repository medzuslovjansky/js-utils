import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { after } from 'node:test';

import naturalCompare from 'natural-compare';
import { format } from 'pretty-format';

// Node's own `t.assert.snapshot()` cannot produce this format: it separates
// name parts with ` > `, omits the header line and writes keys in insertion
// order. So we reimplement jest 29's `.snap` contract instead — the 24 files
// already recorded must survive the runner switch byte for byte.
const FORMAT = {
  escapeRegex: true,
  indent: 2,
  printFunctionName: false,
  escapeString: false,
  printBasicPrototype: false,
};

const escape = (string) => string.replace(/`|\\|\$\{/g, '\\$&');

const serialize = (value) => {
  const string = format(value, FORMAT).replace(/\r\n|\r/g, '\n');
  return string.includes('\n') ? `\n${string}\n` : string;
};

/**
 * Opens the `.snap` file next to `testFile` and registers the write-back hook.
 * Call once at the top level of a test module.
 *
 * @param {string} testFile - `import.meta.filename` of the calling test
 * @returns {{ match(t: unknown, name: string, received: unknown): void }}
 */
export function snapshots(
  testFile,
  { update = !!process.env.UPDATE_SNAPSHOT } = {},
) {
  const file = join(
    dirname(testFile),
    '__snapshots__',
    basename(testFile) + '.snap',
  );

  const data = Object.create(null);
  // Evaluated, not parsed — exactly how jest reads it back. Free correctness on
  // every escaping edge case in the file.
  try {
    new Function('exports', readFileSync(file, 'utf8'))(data);
  } catch {
    /* a new snapshot file */
  }

  const counters = new Map();
  const used = new Set();
  let dirty = false;

  after(() => {
    const obsolete = Object.keys(data).filter((key) => !used.has(key));
    if (obsolete.length > 0) {
      if (update) {
        for (const key of obsolete) delete data[key];
        dirty = true;
      } else {
        console.error(`${obsolete.length} obsolete snapshot(s) in ${file}`);
      }
    }

    if (!dirty) return;

    const body = Object.keys(data)
      .sort(naturalCompare)
      .map((key) => `exports[\`${escape(key)}\`] = \`${escape(data[key])}\`;\n`)
      .join('\n');

    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `// Jest Snapshot v1, https://goo.gl/fbAQLP\n\n${body}`);
  });

  return {
    match(t, name, received) {
      // jest counts per key name, not per test: one test may write several.
      const nth = (counters.get(name) ?? 0) + 1;
      counters.set(name, nth);
      const key = `${name} ${nth}`;
      used.add(key);

      const actual = serialize(received);
      if (data[key] === undefined || (update && data[key] !== actual)) {
        data[key] = actual;
        dirty = true;
        return;
      }

      t.assert.strictEqual(actual, data[key], `snapshot "${key}"`);
    },
  };
}
