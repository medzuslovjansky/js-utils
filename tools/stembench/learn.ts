import fs from 'node:fs';
import path from 'node:path';

import { fold } from '../../packages/stemmer/src/fold.ts';

import { type Paradigms, paradigms } from './bench.ts';

/**
 * How much of a paradigm a stem has to hold together. Not 1: forcing every form
 * of a word onto one key drags the key down to the shortest prefix any of them
 * share, and that is where precision dies — `cěliti`, `čelo` and `cělovati` all
 * end up as `cel`. Letting the one or two odd forms of a paradigm (the iotated
 * 1sg, the aorist of an athematic verb) keep their own key buys far more
 * precision than it costs recall. Measured: 1.0 scores F1 86.5, 0.75 scores 91.4.
 */
const SHARE = 0.75;

/**
 * How much word-final context a rule may look at. Long endings (`ovahmo`,
 * `ujete`) need it, and so do the inflection classes that are only knowable
 * lexically — `dělati` cuts `ti`, `pisati` cuts `ati`, and nothing about the
 * shape of either word says which.
 */
const MAX_CONTEXT = 10;

/**
 * The stemmer's own floor. A paradigm whose stem falls under it teaches rules
 * the stemmer is not allowed to follow, so it teaches nothing.
 */
const MIN_STEM = 3;

/**
 * How far behind the winning cut a longer cut may be and still take the
 * context. A stemmer exists to merge, so a word claimed by two paradigms — the
 * genitive plural `domov` of `dom` against the short form `domov` of `domovy` —
 * is better off cut than left whole. Costs 0.07 F1 against taking the plain
 * majority, and buys back the paradigms that a homograph would otherwise split.
 */
const MARGIN = 0.6;

export const TARGET = path.join(
  import.meta.dirname,
  '../../packages/stemmer/src/endings.ts',
);

/** The longest prefix at least `share` of a paradigm's forms agree on. */
export function stemOf(forms: readonly string[], share: number): string {
  const need = Math.ceil(forms.length * share);
  let best = '';

  for (const w of forms) {
    for (let n = w.length; n > best.length; n--) {
      const p = w.slice(0, n);
      let held = 0;
      for (const x of forms) if (x.startsWith(p)) held++;
      if (held >= need) {
        best = p;
        break;
      }
    }
  }

  return best;
}

/**
 * A word-final context to the number of letters to cut after it. Every context
 * of every length votes; a context survives only if it disagrees with the
 * shorter context inside it, which is what keeps the table down to the rules
 * that actually decide something.
 */
export function learn(data: Paradigms = paradigms()): Map<string, number> {
  const votes = new Map<string, Map<number, number>>();

  for (const set of data.values()) {
    const forms = [...new Set([...set].map(fold))].filter(Boolean);
    const stem = stemOf(forms, SHARE);
    if (stem.length < MIN_STEM) continue;

    // a form of a big paradigm decides more pairs than a form of a small one,
    // so it gets a proportionally louder vote — otherwise the one-form adverb
    // `naměsto` outvotes the eight forms of `město` on the context they share
    const weight = forms.length;

    for (const w of forms) {
      if (!w.startsWith(stem)) continue;
      const cut = w.length - stem.length;

      for (let d = 0; d <= Math.min(MAX_CONTEXT, w.length); d++) {
        const context = w.slice(w.length - d);
        let m = votes.get(context);
        if (!m) votes.set(context, (m = new Map()));
        m.set(cut, (m.get(cut) ?? 0) + weight);
      }
    }
  }

  const winner = new Map<string, number>();
  for (const [context, m] of votes) {
    let most = 0;
    for (const n of m.values()) if (n > most) most = n;
    let best = 0;
    for (const [cut, n] of m) if (n >= most * MARGIN && cut > best) best = cut;
    winner.set(context, best);
  }

  const table = new Map<string, number>();
  for (const [context, cut] of winner) {
    const inner = context.length > 0 ? winner.get(context.slice(1)) : undefined;
    if (inner !== cut) table.set(context, cut);
  }

  return table;
}

/** The table in the one-token-per-rule form `stemmerFor()` reads. */
export function serialize(table: Map<string, number>): string {
  const entries = [...table]
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([context, cut]) => context + cut);

  const lines: string[] = [];
  for (let i = 0; i < entries.length; i += 8) {
    lines.push(entries.slice(i, i + 8).join(' '));
  }

  return lines.join('\n');
}

/** The file body the generator writes, so a test can compare without writing. */
export function render(table: Map<string, number>): string {
  const header = fs.readFileSync(TARGET, 'utf8').split('export const')[0];

  // annotated, or the declaration file gets the whole table a second time as a
  // literal type
  return `${header}export const ENDINGS: string = \`
${serialize(table)}
\`;
`;
}

if (import.meta.filename === process.argv[1]) {
  const table = learn();
  fs.writeFileSync(TARGET, render(table));
  console.log(`${table.size} ending rules → ${TARGET}`);
}
