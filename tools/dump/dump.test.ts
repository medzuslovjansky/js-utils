import assert from 'node:assert/strict';
import test from 'node:test';

import {
  expand,
  readFixtures,
  toConlluBlock,
  toTsvRows,
  type FixtureRow,
} from './dump.ts';

const DOM: FixtureRow = ['24020', 'm.', 'dom', ''];

test('expands a lemma into its paradigm', () => {
  const [entry, ...rest] = expand(DOM);

  assert.equal(rest.length, 0);
  assert.equal(entry.sid, '24020');
  assert.equal(entry.lemma, 'dom');
  assert.ok(entry.tokens.length > 10, 'a masculine noun has 14 forms');
});

test('TSV rows are lemma / form / feats, with UPOS leading the bundle', () => {
  const rows = toTsvRows(expand(DOM)[0]);

  assert.equal(rows[0], 'dom\tdom\tNOUN|Case=Nom|Gender=Masc|Number=Sing');
  assert.ok(
    rows.every((row) => row.split('\t').length === 3),
    'every row has exactly three columns',
  );
});

test('CoNLL-U blocks carry the id and end with a blank line', () => {
  const block = toConlluBlock(expand(DOM)[0]);
  const lines = block.split('\n');

  assert.equal(lines[0], '# sent_id = 24020');
  assert.equal(lines[1], '# text = dom');
  assert.equal(lines[2], '# xpos = m.');
  assert.equal(
    lines[3],
    '1\tdom\tdom\tNOUN\tm.\tCase=Nom|Gender=Masc|Number=Sing\t_\t_\t_\tSID=24020',
  );
  assert.ok(block.endsWith('\n\n'), 'sentences are separated by a blank line');
});

test('every fixture row either expands or is multi-word', () => {
  // The skips are not arbitrary: inflect() returns undefined for lemmas whose
  // words it could not resolve, and in this corpus that is exactly the
  // multi-word entries — phrases, prepositional adverbs, reflexive verbs.
  const skipped = readFixtures().filter((row) => expand(row).length === 0);

  assert.ok(skipped.length > 0, 'the corpus does contain multi-word entries');
  assert.deepEqual(
    skipped.filter((row) => !/[\s-]/.test(row[2])),
    [],
  );
});
