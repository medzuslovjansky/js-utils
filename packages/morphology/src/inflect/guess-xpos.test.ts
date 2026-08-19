import { describe, it } from 'node:test';
import assert from 'node:assert';

import { guessXpos } from './guess-xpos.ts';

describe('guessXpos', () => {
  it('should read an infinitive as an imperfective transitive verb', () => {
    assert.strictEqual(guessXpos('dělati'), 'v.tr. ipf.');
  });

  it('should read -osť as a feminine noun', () => {
    assert.strictEqual(guessXpos('radosť'), 'f.');
  });

  it('should read -y as an adjective', () => {
    assert.strictEqual(guessXpos('dobry'), 'adj.');
  });

  it('should read -a as a feminine noun', () => {
    assert.strictEqual(guessXpos('žena'), 'f.');
  });

  it('should read -o as a neuter noun', () => {
    assert.strictEqual(guessXpos('slovo'), 'n.');
  });

  it('should fall back to a masculine noun', () => {
    assert.strictEqual(guessXpos('dom'), 'm.');
  });

  it('should read a capitalized form by the same endings', () => {
    assert.strictEqual(guessXpos('Praga'), 'f.');
  });

  describe('script invariance (Cyrillic, Glagolitic, ASCII)', () => {
    it('should correctly guess POS for Cyrillic forms', () => {
      assert.strictEqual(guessXpos('дѣлати'), 'v.tr. ipf.');
      assert.strictEqual(guessXpos('делати'), 'v.tr. ipf.');
      assert.strictEqual(guessXpos('робити'), 'v.tr. ipf.');
      assert.strictEqual(guessXpos('радость'), 'f.');
      assert.strictEqual(guessXpos('добры'), 'adj.');
      assert.strictEqual(guessXpos('жена'), 'f.');
      assert.strictEqual(guessXpos('слово'), 'n.');
      assert.strictEqual(guessXpos('дѣлање'), 'n.');
      assert.strictEqual(guessXpos('учитель'), 'm.anim.');
      assert.strictEqual(guessXpos('учитељ'), 'm.anim.');
      assert.strictEqual(guessXpos('дѣлајући'), 'v.prap.');
      assert.strictEqual(guessXpos('дѣлаемы'), 'v.prpp.');
      assert.strictEqual(guessXpos('дѣлајемы'), 'v.prpp.');
      assert.strictEqual(guessXpos('сдѣлавши'), 'v.pfap.');
      assert.strictEqual(guessXpos('дом'), 'm.');
    });

    it('should correctly guess POS for Glagolitic forms', () => {
      // ⰴⱑⰾⰰⱅⰹ = dělati
      assert.strictEqual(guessXpos('ⰴⱑⰾⰰⱅⰹ'), 'v.tr. ipf.');
      // ⱃⰰⰴⱁⱄⱅⱐ = radost
      assert.strictEqual(guessXpos('ⱃⰰⰴⱁⱄⱅⱐ'), 'f.');
      // ⰴⱁⰱⱃⱏⰹ = dobry
      assert.strictEqual(guessXpos('ⰴⱁⰱⱃⱏⰹ'), 'adj.');
      // ⰶⰵⱀⰰ = žena
      assert.strictEqual(guessXpos('ⰶⰵⱀⰰ'), 'f.');
      // ⱄⰾⱁⰲⱁ = slovo
      assert.strictEqual(guessXpos('ⱄⰾⱁⰲⱁ'), 'n.');
    });

    it('should correctly guess POS for ASCII forms', () => {
      assert.strictEqual(guessXpos('delati'), 'v.tr. ipf.');
      assert.strictEqual(guessXpos('radost'), 'f.');
      assert.strictEqual(guessXpos('dobry'), 'adj.');
    });
  });
});
