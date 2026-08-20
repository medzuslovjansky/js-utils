import { describe, test } from 'node:test';
import { snapshots } from '@interslavic/dev-snapshot';

import { declineNounSimple } from '../index.ts';

const snap = snapshots(import.meta.filename);

/**
 * The lexicon spells a substantivized adjective out as a noun plus a bracketed
 * genitive, `učeny (-ogo)`, and the gender suites already snapshot those. These
 * are the same words under a `*.subst.` tag, which names the declension without
 * spelling it out, so hardness has to be worked out from the stem: once per
 * gender, and once in the plural, where the ending gives nothing away.
 */
const CASES: Array<[lemma: string, tag: string]> = [
  ['učeny', 'm.anim.subst.'],
  ['pųtujųći', 'm.anim.subst.'],
  ['veliki', 'm.anim.subst.'],
  ['zloty', 'm.subst.'],
  ['prěměnna', 'f.subst.'],
  ['srědnja', 'f.subst.'],
  ['dobro', 'n.subst.'],
  ['srědnje', 'n.subst.'],
  ['drobne', 'm.pl.subst.'],
  ['srědnji', 'm.anim.pl.subst.'],
];

describe('noun', () => {
  describe('substantivized', () => {
    for (const [lemma, tag] of CASES) {
      test(`${lemma} ${tag}`, (t) => {
        snap.match(
          t,
          `noun substantivized ${lemma} ${tag}`,
          declineNounSimple(lemma, tag),
        );
      });
    }
  });
});
