import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  declinePronoun,
  declinePronounSimple,
  inflectPronoun,
} from './declension.ts';

/** The person every form of the paradigm was tagged with, as a set. */
function persons(word: string): string[] {
  const feats = inflectPronoun(word, 'pron.pers.').map(
    (result) => (result.feats as Record<string, string>).Person,
  );

  return [...new Set(feats)];
}

describe('inflectPronoun', () => {
  test('reads the person off an oblique lemma of the first person', () => {
    assert.deepEqual(persons('mene'), ['1']);
  });

  test('reads the person off an oblique lemma of the second person', () => {
    assert.deepEqual(persons('tebe'), ['2']);
  });

  test('reads the person off an oblique lemma of the third person', () => {
    assert.deepEqual(persons('jego'), ['3']);
  });

  test('hands back a pronoun it cannot decline unchanged', () => {
    // `jedin drugogo` is two words, and the module declines single words.
    assert.deepEqual(inflectPronoun('jedin drugogo', 'pron.rec.'), [
      { form: 'jedin drugogo', upos: 'PRON', feats: { PronType: 'Rcp' } },
    ]);
  });

  test('says nothing about a word that is not a pronoun', () => {
    assert.deepEqual(inflectPronoun('dom', 'm.'), []);
  });

  test('says nothing when the tag is a pronoun the XPOS parser cannot place', () => {
    // `parsePos` takes any tag starting with `pron`; `parseXPos` wants the dot.
    assert.deepEqual(inflectPronoun('ja', 'pron'), []);
  });
});

describe('declinePronoun', () => {
  test('has no table for a reciprocal pronoun', () => {
    assert.equal(declinePronoun('drugogo', 'reciprocal'), null);
  });
});

describe('declinePronounSimple', () => {
  test('declines a pronoun named by its dictionary tag', () => {
    assert.deepEqual(
      declinePronounSimple('sebe', 'pron.refl.'),
      declinePronoun('sebe', 'reflexive'),
    );
  });

  test('refuses a tag that is not a pronoun', () => {
    assert.throws(() => declinePronounSimple('dom', 'm.'), TypeError);
  });
});
