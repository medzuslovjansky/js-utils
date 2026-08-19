import test from 'node:test';
import assert from 'node:assert/strict';
import { FIXTURES } from '../fixtures/index.ts';
import { PIPELINES, type NormalizeLang } from '../normalize/index.ts';

// Meta-test: the fixtures are the specification, so every named step of every
// pipeline must be demonstrated by at least one precedent — and every precedent
// must point at a real step (typo guard).
for (const [lang, pipeline] of Object.entries(PIPELINES)) {
  const fixtures = FIXTURES[lang as NormalizeLang];

  test(`coverage ${lang}: every step has at least one fixture`, () => {
    const covered = new Set(fixtures.translit.map((c) => c.covers));
    for (const step of pipeline) {
      assert.ok(
        covered.has(step.name),
        `step "${step.name}" has no fixture — add a TranslitCase with covers: '${step.name}' to src/fixtures/${lang}.cases.ts`,
      );
    }
  });

  test(`coverage ${lang}: every covers names a real step`, () => {
    const names = new Set(pipeline.map((s) => s.name));
    for (const c of fixtures.translit) {
      assert.ok(
        names.has(c.covers),
        `fixture "${c.in}" covers unknown step "${c.covers}" (pipeline has: ${[...names].join(', ')})`,
      );
    }
  });
}
