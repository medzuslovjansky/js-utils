import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { detectPos } from './detect-pos.ts';

describe('detectPos', () => {
  test('detects verbs by infinitive endings', () => {
    assert.deepEqual(detectPos('dělati'), {
      xpos: 'v.tr. ipf.',
      upos: 'VERB',
      label: 'Verb (imperfective)',
      reason: 'infinitive ending',
    });
    assert.deepEqual(detectPos('vesti'), {
      xpos: 'v.tr. ipf.',
      upos: 'VERB',
      label: 'Verb (imperfective)',
      reason: 'infinitive ending',
    });
  });

  test('detects participles correctly', () => {
    assert.deepEqual(detectPos('dělajųći'), {
      xpos: 'v.part.',
      upos: 'VERB',
      label: 'Verb (participle)',
      reason: 'participle ending',
    });
    assert.deepEqual(detectPos('dělajemy'), {
      xpos: 'v.part.',
      upos: 'VERB',
      label: 'Verb (participle)',
      reason: 'participle ending',
    });
    assert.deepEqual(detectPos('sdělavši'), {
      xpos: 'v.part.',
      upos: 'VERB',
      label: 'Verb (participle)',
      reason: 'participle ending',
    });
  });

  test('detects verbal nouns by -nje/-tje suffix', () => {
    assert.deepEqual(detectPos('dělańje'), {
      xpos: 'n.',
      upos: 'NOUN',
      label: 'Verbal Noun (neuter)',
      reason: 'verbal noun suffix -nje/-tje',
    });
  });

  test('detects abstract feminine nouns by suffix -ost/-osť', () => {
    assert.deepEqual(detectPos('radost'), {
      xpos: 'f.',
      upos: 'NOUN',
      label: 'Noun (feminine)',
      reason: 'abstract suffix -ost/-osť',
    });
  });

  test('detects adjectives by -y/-ji ending', () => {
    assert.deepEqual(detectPos('dobry'), {
      xpos: 'adj.',
      upos: 'ADJ',
      label: 'Adjective',
      reason: 'adjectival ending',
    });
  });

  test('detects feminine nouns by -a ending', () => {
    assert.deepEqual(detectPos('žena'), {
      xpos: 'f.',
      upos: 'NOUN',
      label: 'Noun (feminine)',
      reason: 'ending -a',
    });
  });

  test('detects neuter nouns by -o/-e/-ę ending', () => {
    assert.deepEqual(detectPos('město'), {
      xpos: 'n.',
      upos: 'NOUN',
      label: 'Noun (neuter)',
      reason: 'ending -o/-e/-ę',
    });
    assert.deepEqual(detectPos('polje'), {
      xpos: 'n.',
      upos: 'NOUN',
      label: 'Noun (neuter)',
      reason: 'ending -o/-e/-ę',
    });
  });

  test('detects agent masculine nouns by -telj and -anin suffixes', () => {
    assert.deepEqual(detectPos('učitelj'), {
      xpos: 'm.anim.',
      upos: 'NOUN',
      label: 'Noun (masculine animate)',
      reason: 'agent suffix -telj/-anin',
    });
    assert.deepEqual(detectPos('angličanin'), {
      xpos: 'm.anim.',
      upos: 'NOUN',
      label: 'Noun (masculine animate)',
      reason: 'agent suffix -telj/-anin',
    });
  });

  test('falls back to masculine noun for consonant-ending words', () => {
    assert.deepEqual(detectPos('dom'), {
      xpos: 'm.',
      upos: 'NOUN',
      label: 'Noun (masculine)',
      reason: 'consonant ending fallback',
    });
  });
});

describe('detectPos script invariance (Cyrillic, Glagolitic, ASCII)', () => {
  test('detects Cyrillic verbs and nouns identically to Latin', () => {
    assert.strictEqual(detectPos('дѣлати').xpos, 'v.tr. ipf.');
    assert.strictEqual(detectPos('делати').xpos, 'v.tr. ipf.');
    assert.strictEqual(detectPos('робити').xpos, 'v.tr. ipf.');
    assert.strictEqual(detectPos('радость').xpos, 'f.');
    assert.strictEqual(detectPos('учитель').xpos, 'm.anim.');
    assert.strictEqual(detectPos('учитељ').xpos, 'm.anim.');
    assert.strictEqual(detectPos('дѣлање').xpos, 'n.');
    assert.strictEqual(detectPos('дѣлајући').xpos, 'v.part.');
  });

  test('detects Glagolitic script forms', () => {
    // ⰴⱑⰾⰰⱅⰹ = dělati
    assert.deepEqual(detectPos('ⰴⱑⰾⰰⱅⰹ'), {
      xpos: 'v.tr. ipf.',
      upos: 'VERB',
      label: 'Verb (imperfective)',
      reason: 'infinitive ending',
    });
    // ⱃⰰⰴⱁⱄⱅⱐ = radost
    assert.deepEqual(detectPos('ⱃⰰⰴⱁⱄⱅⱐ'), {
      xpos: 'f.',
      upos: 'NOUN',
      label: 'Noun (feminine)',
      reason: 'abstract suffix -ost/-osť',
    });
    // ⰴⱁⰱⱃⱏⰹ = dobry
    assert.deepEqual(detectPos('ⰴⱁⰱⱃⱏⰹ'), {
      xpos: 'adj.',
      upos: 'ADJ',
      label: 'Adjective',
      reason: 'adjectival ending',
    });
  });

  test('detects ASCII forms', () => {
    assert.deepEqual(detectPos('delati'), {
      xpos: 'v.tr. ipf.',
      upos: 'VERB',
      label: 'Verb (imperfective)',
      reason: 'infinitive ending',
    });
    assert.deepEqual(detectPos('radost'), {
      xpos: 'f.',
      upos: 'NOUN',
      label: 'Noun (feminine)',
      reason: 'abstract suffix -ost/-osť',
    });
    assert.deepEqual(detectPos('dobry'), {
      xpos: 'adj.',
      upos: 'ADJ',
      label: 'Adjective',
      reason: 'adjectival ending',
    });
  });
});
