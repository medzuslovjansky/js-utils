import { describe, test } from 'node:test';
import assert from 'node:assert';

import { conjugateVerb, inflectVerb } from '../index.ts';
import type { VerbCell, VerbParadigm } from '../index.ts';

function conjugate(lemma: string, hint = '', xpos?: string): VerbParadigm {
  const paradigm = conjugateVerb(lemma, hint, xpos);
  assert.ok(paradigm, `the conjugator refused ${lemma}`);
  return paradigm;
}

const forms = (cell: VerbCell) => cell.map((entry) => entry.form);
const allForms = (cells: VerbCell[]) => cells.flatMap(forms);

describe('verb', () => {
  describe('conjugation', () => {
    test('a hyphen says where the prefix ends', () => {
      assert.deepStrictEqual(
        conjugate('iz-jehati', '', 'v.intr. pf.'),
        conjugate('izjehati', '(izjede)', 'v.intr. pf.'),
      );
    });

    test('the reflexive particle in a present-tense hint is dropped', () => {
      assert.deepStrictEqual(
        conjugate('bojati sę', '(boji sę)', 'v.refl. ipf.'),
        conjugate('bojati sę', '(boji)', 'v.refl. ipf.'),
      );
    });

    test('the particle survives a government marker in the same brackets', () => {
      assert.deepStrictEqual(
        conjugate('bojati sę', '(boji sę +2)', 'v.refl. ipf.'),
        conjugate('bojati sę', '(boji)', 'v.refl. ipf.'),
      );
    });

    test('the particle is dropped from the front of a hint too', () => {
      assert.deepStrictEqual(
        conjugate('bojati sę', '(sę boji)', 'v.refl. ipf.'),
        conjugate('bojati sę', '(boji)', 'v.refl. ipf.'),
      );
    });

    test('jěhati and jahati take the present tense of jehati', () => {
      const jehati = conjugate('jěhati', '', 'v.intr. ipf.');
      assert.deepStrictEqual(allForms(jehati.present), [
        'jědų',
        'jědem',
        'jědeš',
        'jěde',
        'jědemo',
        'jědete',
        'jědųt',
      ]);
      assert.deepStrictEqual(allForms(jehati.imperative), [
        'jědi',
        'jědimo',
        'jědite',
      ]);

      const jahati = conjugate('jahati', '', 'v.intr. ipf.');
      assert.deepStrictEqual(allForms(jahati.present), [
        'jadų',
        'jadem',
        'jadeš',
        'jade',
        'jademo',
        'jadete',
        'jadųt',
      ]);
      assert.deepStrictEqual(allForms(jahati.imperative), [
        'jadi',
        'jadimo',
        'jadite',
      ]);
    });

    test('jěsti and jasti conjugate like jesti', () => {
      const jesti = conjugate('jěsti', '(jědų)', 'v.tr. ipf.');
      assert.deepStrictEqual(forms(jesti.infinitive), ['jěstì']);
      assert.deepStrictEqual(allForms(jesti.present), [
        'jěm',
        'jěš',
        'jě',
        'jěmo',
        'jěte',
        'jědųt',
      ]);
      assert.deepStrictEqual(forms(jesti.lparticiple), [
        'jědl',
        'jědla',
        'jědlo',
        'jědli',
      ]);

      const jasti = conjugate('jasti', '(jadų)', 'v.tr. ipf.');
      assert.deepStrictEqual(forms(jasti.infinitive), ['jastì']);
      assert.deepStrictEqual(allForms(jasti.present), [
        'jam',
        'jaš',
        'ja',
        'jamo',
        'jate',
        'jadųt',
      ]);
      assert.deepStrictEqual(forms(jasti.lparticiple), [
        'jadl',
        'jadla',
        'jadlo',
        'jadli',
      ]);
    });

    // The present tense has no rule for a vowel-final stem — `imati` is meant
    // to be given its `imaje`, and then contraction produces `ima` — so only
    // the two forms that do have one are worth asserting here.
    test('a present-tense stem handed over vowel-final still builds the imperative', () => {
      const imati = conjugate('imati', '(ima)', 'v.tr. ipf.');
      assert.deepStrictEqual(allForms(imati.imperative), [
        'imaj',
        'imajmo',
        'imajte',
      ]);
      assert.strictEqual(imati.prap?.citation, 'imajųćí');
    });

    test('a lemma with no infinitive ending is marked, not thrown on', () => {
      assert.deepStrictEqual(forms(conjugate('slovo').infinitive), [
        'ERROR2tì',
      ]);
      assert.deepStrictEqual(forms(conjugate('').infinitive), ['ERROR1tì']);
    });

    test('a reading that is not verbal is left to whoever owns it', () => {
      assert.deepStrictEqual(inflectVerb('slovo', 'n.'), []);
    });

    test('a lemma the conjugator refuses is passed through untouched', () => {
      assert.deepStrictEqual(inflectVerb('bųde/bųdųt', 'v.aux. ipf.'), [
        {
          form: 'bųde/bųdųt',
          upos: 'AUX',
          feats: { Aspect: 'Imp', VerbForm: 'Inf' },
        },
      ]);
    });
  });
});
