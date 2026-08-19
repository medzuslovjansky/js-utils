import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import type { KnownForm } from '../inflect.ts';
import { inflect } from '../inflect.ts';

/** FEATS is a union per part of speech, so reading one by name needs a widening. */
function gender(known: string | KnownForm): string | undefined {
  const feats = inflect(known)[0]?.feats as Record<string, string> | undefined;
  return feats?.Gender;
}

describe('inflect', () => {
  test('a bare string is the same as a form with nothing else known', () => {
    assert.deepEqual(inflect('žena'), inflect({ form: 'žena' }));
  });

  test('guesses the part of speech from the ending', () => {
    assert.equal(inflect('žena')[0].upos, 'NOUN');
    assert.equal(gender('žena'), 'Fem');
    assert.equal(inflect('dělati')[0].upos, 'VERB');
    assert.equal(inflect('dobry')[0].upos, 'ADJ');
    assert.equal(gender('slovo'), 'Neut');
  });

  test('what the caller states beats the guess', () => {
    assert.equal(gender({ form: 'sudja', xpos: 'm.anim.' }), 'Masc');
    assert.equal(gender('sudja'), 'Fem');
  });

  test('a feature on its own is enough to override', () => {
    assert.equal(inflect('pisati')[0].xpos, 'v.tr. ipf.');
    assert.equal(
      inflect({ form: 'pisati', feats: { Aspect: 'Perf' } })[0].xpos,
      'v.tr. pf.',
    );
  });

  test('an oblique form is read as a principal part, not as the lemma', () => {
    const stated = inflect({
      form: 'ide',
      lemma: 'idti',
      upos: 'VERB',
      feats: { VerbForm: 'Fin', Number: 'Sing', Person: '3' },
    });

    assert.equal(stated[0].lemma, 'idti');

    // The same two forms, listed instead of related through `lemma`.
    assert.deepEqual(
      stated.map((t) => t.form),
      inflect([{ form: 'idti' }, { form: 'ide' }]).map((t) => t.form),
    );
  });

  test('several principal parts reach the suppletive stems', () => {
    const forms = inflect([
      { form: 'idti', xpos: 'v.intr. ipf.' },
      { form: 'ide' },
      { form: 'šėl' },
    ]).map((token) => token.form);

    assert.ok(forms.includes('ide'));
    assert.ok(forms.includes('šla'));
  });

  test('phrases are not this function', () => {
    assert.deepEqual(inflect('bojati sę'), []);
    assert.deepEqual(inflect([]), []);
  });
});
