import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import vm from 'node:vm';

const CSS = `
:root { color-scheme: light dark; }
body { font: 16px/1.5 system-ui, sans-serif; margin: 0 auto; max-width: 60rem; padding: 2rem 1rem; }
h1 { margin-bottom: 0; }
.summary { color: #666; margin-bottom: 2rem; }
.fail { color: #9e0500; font-weight: bold; }
section { border-top: 1px solid #ccc; padding-top: 1rem; }
section > h2 { font-size: 1.1rem; }
section > h2 > a { color: inherit; text-decoration: none; }
section > h2 > a:hover::after { content: ' #'; color: #999; }
.overflow { overflow-x: auto; }
table { border-collapse: collapse; }
th { background-color: #e4edfe; color: #000; }
th, td { border: 1px solid #777; padding: 0.5ch; text-align: left; }
del { background-color: #ffe7e6; color: #9e0500; display: block; }
ins { background-color: #eef9eb; color: #125400; display: block; text-decoration: none; }
pre { background: #f5f5f5; color: #000; overflow-x: auto; padding: 0.5rem; }
figcaption { font-style: italic; margin: 1em 0; }
`;

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c],
  );

/**
 * A node:test reporter that keeps the console terse and writes the paradigm
 * diffs to a standalone HTML page. Deliberately knows nothing about the
 * packages it reports on: the caller injects the renderers, keyed by the
 * outermost `describe` title, so tools/ never depends on packages/.
 *
 * @param {object} options
 * @param {Record<string, { renderDiff(before: unknown, after: unknown): string }>} options.renderers
 * @param {(name: string) => string} [options.title] - prettifies a test name
 * @param {string} [options.output] - where to write the page
 */
export function createReporter({
  renderers = {},
  title = (name) => name,
  output = 'test-report.html',
} = {}) {
  return async function* reporter(source) {
    // One stack per file: suites from different files interleave.
    const stacks = new Map();
    const sections = [];
    let passed = 0;
    let failed = 0;

    const stackOf = (file) => {
      let stack = stacks.get(file);
      if (!stack) stacks.set(file, (stack = []));
      return stack;
    };

    for await (const { type, data } of source) {
      // Only `test:start` is ordered reliably — a leaf's `test:complete` can
      // arrive before its ancestors'.
      if (type === 'test:start') {
        const stack = stackOf(data.file);
        stack[data.nesting] = data.name;
        stack.length = data.nesting + 1;
      }

      // Test files get their output captured, so pass it through or it is lost.
      if (type === 'test:stdout' || type === 'test:stderr') {
        yield data.message;
        continue;
      }

      // Suites report their children's failures again; count the leaves only.
      if (data.details?.type === 'suite') continue;

      if (type === 'test:pass') passed++;

      if (type === 'test:fail') {
        failed++;
        const ancestors = stackOf(data.file).slice(0, data.nesting);
        const name = title(data.name);
        const path = [...ancestors, name].join(' › ');
        sections.push(
          renderSection(path, name, renderers[ancestors[0]], data),
        );
        yield `FAIL ${path}\n`;
      }

      if (type === 'test:summary' && !data.file) {
        mkdirSync(dirname(output), { recursive: true });
        writeFileSync(output, renderPage(sections, passed, failed));
        yield failed === 0
          ? `\n${passed} passed.\n`
          : `\n${passed} passed, ${failed} failed. Report: ${output}\n`;
      }
    }
  };
}

function renderSection(path, name, renderer, data) {
  const id = encodeURIComponent(path);
  const heading = `<h2 id="${escapeHtml(id)}"><a href="#${escapeHtml(id)}">${escapeHtml(path)}</a></h2>`;
  return `<section>${heading}<div class="overflow">${renderBody(renderer, data)}</div></section>`;
}

function renderBody(renderer, data) {
  const cause = data.details?.error?.cause;
  const message = cause?.message ?? data.details?.error?.message ?? '(no error)';
  if (!renderer || cause?.actual === undefined || cause?.expected === undefined) {
    return `<pre>${escapeHtml(message)}</pre>`;
  }

  try {
    // `actual`/`expected` are the pretty-format texts the assertion compared,
    // so evaluating them hands the renderer real paradigm objects back.
    // Known ceiling inherited from jest: escapeString:false means a value
    // containing `"` produces invalid JS and lands in the catch below.
    const [before, after] = vm.runInNewContext(
      `[${cause.expected}, ${cause.actual}]`,
    );
    return renderer.renderDiff(before, after);
  } catch {
    return `<pre>${escapeHtml(message)}</pre>`;
  }
}

function renderPage(sections, passed, failed) {
  const summary = failed
    ? `<span class="fail">${failed} failed</span>, ${passed} passed`
    : `${passed} passed`;

  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Test report</title>
<style>${CSS}</style>
<h1>Test report</h1>
<p class="summary">${summary}</p>
${sections.join('\n') || '<p>Nothing to show.</p>'}
</html>
`;
}
