import { describe, test } from 'node:test';
import assert from 'node:assert';
import { snapshots } from '@interslavic/dev-snapshot';
import type { Lemma } from '../schema.ts';
import { canDerive, derive } from './index.ts';
import { deriveFromVerb } from './from-verb.ts';
import { deriveFromAdjective } from './from-adjective.ts';
import { deriveFromAdverb } from './from-adverb.ts';

const snap = snapshots(import.meta.filename);

/**
 * Helper to create a minimal lemma for testing.
 */
function makeLemma(
  form: string,
  upos: 'VERB' | 'AUX' | 'ADJ' | 'ADV' | 'NOUN',
  xpos: string,
  feats: Record<string, string> = {},
): Lemma {
  return {
    xpos,
    words: [
      {
        form,
        lemma: form,
        upos,
        feats,
      },
    ],
  };
}

describe('derive', () => {
  describe('from adjectives', () => {
    test('rad adj. -> derivations', (t) => {
      const lemma = makeLemma('rad', 'ADJ', 'adj.', { Degree: 'Pos' });
      const result = derive({ lemma, lid: '100' });
      snap.match(t, 'derive from adjectives rad adj. -> derivations', result);
    });

    test('dobry adj. -> derivations', (t) => {
      const lemma = makeLemma('dobry', 'ADJ', 'adj.', { Degree: 'Pos' });
      const result = derive({ lemma, lid: '101' });
      snap.match(t, 'derive from adjectives dobry adj. -> derivations', result);
    });

    test('lěpši adj.comp. -> derivations (only superlative)', (t) => {
      const lemma = makeLemma('lěpši', 'ADJ', 'adj.comp.', { Degree: 'Cmp' });
      const result = derive({ lemma, lid: '102' });
      snap.match(
        t,
        'derive from adjectives lěpši adj.comp. -> derivations (only superlative)',
        result,
      );
    });

    test('najdobry adj.sup. -> no derivations', (t) => {
      const lemma = makeLemma('najdobry', 'ADJ', 'adj.sup.', { Degree: 'Sup' });
      const result = derive({ lemma, lid: '103' });
      snap.match(
        t,
        'derive from adjectives najdobry adj.sup. -> no derivations',
        result,
      );
    });

    test('amerikansky adj. -> derivations (analytical superlative)', (t) => {
      const lemma = makeLemma('amerikansky', 'ADJ', 'adj.', { Degree: 'Pos' });
      const result = derive({ lemma, lid: '104' });
      snap.match(
        t,
        'derive from adjectives amerikansky adj. -> derivations (analytical superlative)',
        result,
      );
    });

    test('Ivanov adj.poss. -> no derivations (possessive)', (t) => {
      const lemma = makeLemma('Ivanov', 'ADJ', 'adj.poss.', {
        Degree: 'Pos',
        Poss: 'Yes',
      });
      const result = derive({ lemma, lid: '105' });
      snap.match(
        t,
        'derive from adjectives Ivanov adj.poss. -> no derivations (possessive)',
        result,
      );
    });
  });

  describe('from verbs', () => {
    test('byti v.aux. ipf. -> derivations', (t) => {
      const lemma = makeLemma('byti', 'AUX', 'v.aux. ipf.', {
        Aspect: 'Imp',
        VerbForm: 'Inf',
      });
      const result = derive({ lemma, lid: '200' });
      snap.match(
        t,
        'derive from verbs byti v.aux. ipf. -> derivations',
        result,
      );
    });

    test('abdikovati v.intr. ipf./pf. (ipf aspect) -> derivations', (t) => {
      const lemma = makeLemma('abdikovati', 'VERB', 'v.intr. ipf.', {
        Aspect: 'Imp',
        VerbForm: 'Inf',
      });
      const result = derive({ lemma, lid: '201' });
      snap.match(
        t,
        'derive from verbs abdikovati v.intr. ipf./pf. (ipf aspect) -> derivations',
        result,
      );
    });

    test('viděti v.tr. ipf. -> derivations (all participles)', (t) => {
      const lemma = makeLemma('viděti', 'VERB', 'v.tr. ipf.', {
        Aspect: 'Imp',
        VerbForm: 'Inf',
      });
      const result = derive({ lemma, lid: '202' });
      snap.match(
        t,
        'derive from verbs viděti v.tr. ipf. -> derivations (all participles)',
        result,
      );
    });

    test('hotěti (hoće) v.tr. pf. -> derivations', (t) => {
      const lemma: Lemma = {
        xpos: 'v.tr. pf.',
        paradigms: ['(hoće)'],
        words: [
          {
            form: 'hotěti',
            lemma: 'hotěti',
            upos: 'VERB',
            feats: { Aspect: 'Perf', VerbForm: 'Inf' },
          },
        ],
      };
      const result = derive({ lemma, lid: '203' });
      snap.match(
        t,
        'derive from verbs hotěti (hoće) v.tr. pf. -> derivations',
        result,
      );
    });

    test('zahtěti (zahće) v.tr. pf. -> derivations', (t) => {
      const lemma: Lemma = {
        xpos: 'v.tr. pf.',
        paradigms: ['(zahće)'],
        words: [
          {
            form: 'zahtěti',
            lemma: 'zahtěti',
            upos: 'VERB',
            feats: { Aspect: 'Perf', VerbForm: 'Inf' },
          },
        ],
      };
      const result = derive({ lemma, lid: '204' });
      snap.match(
        t,
        'derive from verbs zahtěti (zahće) v.tr. pf. -> derivations',
        result,
      );
    });

    test('uviděti sę v.refl. ipf. -> derivations', (t) => {
      const lemma: Lemma = {
        xpos: 'v.refl. ipf.',
        words: [
          {
            form: 'uviděti',
            lemma: 'uviděti',
            upos: 'VERB',
            feats: { Aspect: 'Imp', VerbForm: 'Inf' },
          },
          {
            form: 'sę',
            lemma: 'sę',
            upos: 'PRON',
            feats: { Reflex: 'Yes' },
          },
        ],
      };
      const result = derive({ lemma, lid: '205' });
      snap.match(
        t,
        'derive from verbs uviděti sę v.refl. ipf. -> derivations',
        result,
      );
    });
  });

  describe('from adverbs', () => {
    test('dobro adv. -> derivations', (t) => {
      const lemma = makeLemma('dobro', 'ADV', 'adv.', { Degree: 'Pos' });
      const result = derive({ lemma, lid: '300' });
      snap.match(t, 'derive from adverbs dobro adv. -> derivations', result);
    });

    test('bolje adv.comp. -> derivations (only superlative)', (t) => {
      const lemma = makeLemma('bolje', 'ADV', 'adv.comp.', { Degree: 'Cmp' });
      const result = derive({ lemma, lid: '301' });
      snap.match(
        t,
        'derive from adverbs bolje adv.comp. -> derivations (only superlative)',
        result,
      );
    });

    test('najbolje adv.sup. -> no derivations', (t) => {
      const lemma = makeLemma('najbolje', 'ADV', 'adv.sup.', { Degree: 'Sup' });
      const result = derive({ lemma, lid: '302' });
      snap.match(
        t,
        'derive from adverbs najbolje adv.sup. -> no derivations',
        result,
      );
    });
  });

  describe('deriveFromVerb directly', () => {
    test('dělati v.tr. ipf. -> all participles + vnoun', (t) => {
      const lemma = makeLemma('dělati', 'VERB', 'v.tr. ipf.', {
        Aspect: 'Imp',
        VerbForm: 'Inf',
      });
      const result = deriveFromVerb({ lemma, lid: '400' });
      snap.match(
        t,
        'derive deriveFromVerb directly dělati v.tr. ipf. -> all participles + vnoun',
        result,
      );
    });
  });

  describe('deriveFromAdjective directly', () => {
    test('stary adj. -> all forms', (t) => {
      const lemma = makeLemma('stary', 'ADJ', 'adj.', { Degree: 'Pos' });
      const result = deriveFromAdjective({ lemma, lid: '500' });
      snap.match(
        t,
        'derive deriveFromAdjective directly stary adj. -> all forms',
        result,
      );
    });
  });

  describe('deriveFromAdverb directly', () => {
    test('zlo adv. -> all forms', (t) => {
      const lemma = makeLemma('zlo', 'ADV', 'adv.', { Degree: 'Pos' });
      const result = deriveFromAdverb({ lemma, lid: '600' });
      snap.match(
        t,
        'derive deriveFromAdverb directly zlo adv. -> all forms',
        result,
      );
    });

    test('svěže adv. -> forms of the soft adjective svěži', () => {
      const lemma = makeLemma('svěže', 'ADV', 'adv.', { Degree: 'Pos' });
      assert.deepStrictEqual(deriveFromAdverb({ lemma, lid: '601' }), [
        { isv: 'svěžeje', xpos: 'adv.comp.', derivationType: 'advcmp' },
        { isv: 'najsvěžeje', xpos: 'adv.sup.', derivationType: 'advsup' },
        { isv: 'najsvěže', xpos: 'adv.sup.', derivationType: 'advsupn' },
      ]);
    });

    test('dobrě adv. -> forms of dobry', () => {
      const lemma = makeLemma('dobrě', 'ADV', 'adv.', { Degree: 'Pos' });
      assert.deepStrictEqual(deriveFromAdverb({ lemma, lid: '602' }), [
        { isv: 'lěpje, lučše', xpos: 'adv.comp.', derivationType: 'advcmp' },
        {
          isv: 'najlěpje, najlučše',
          xpos: 'adv.sup.',
          derivationType: 'advsup',
        },
        { isv: 'najdobrě', xpos: 'adv.sup.', derivationType: 'advsupn' },
      ]);
    });

    test('vsegda adv. -> no synthetic comparison (no adjective behind it)', () => {
      const lemma = makeLemma('vsegda', 'ADV', 'adv.', { Degree: 'Pos' });
      assert.deepStrictEqual(deriveFromAdverb({ lemma, lid: '603' }), [
        { isv: 'najvsegda', xpos: 'adv.sup.', derivationType: 'advsupn' },
      ]);
    });
  });

  describe('nothing to derive', () => {
    test('dělajųći v.prap. -> no derivations (already a derived form)', () => {
      const lemma = makeLemma('dělajųći', 'VERB', 'v.prap.', {
        VerbForm: 'Part',
        Tense: 'Pres',
        Voice: 'Act',
      });
      assert.deepStrictEqual(deriveFromVerb({ lemma, lid: '700' }), []);
    });

    test('byti dȯlžėn v.aux. ipf. -> no derivations (MWE)', () => {
      const lemma: Lemma = {
        xpos: 'v.aux. ipf.',
        words: [
          { form: 'byti', lemma: 'byti', upos: 'AUX' },
          { form: 'dȯlžėn', lemma: 'dȯlžėn', upos: 'ADJ' },
        ],
      };
      assert.deepStrictEqual(derive({ lemma, lid: '35085' }), []);
    });

    test('ne sȯglåsiti sę v.refl. pf. -> no derivations (MWE)', () => {
      const lemma: Lemma = {
        xpos: 'v.refl. pf.',
        words: [
          { form: 'ne', lemma: 'ne', upos: 'PART' },
          { form: 'sȯglåsiti', lemma: 'sȯglåsiti', upos: 'VERB' },
          { form: 'sę', lemma: 'sę', upos: 'PRON' },
        ],
      };
      assert.deepStrictEqual(deriveFromVerb({ lemma, lid: '702' }), []);
    });

    // LID 22979: a headword that is two present-tense forms rather than an
    // infinitive, so `conjugateVerb` refuses it outright.
    test('bųde/bųdųt v.aux. ipf. -> no derivations (unconjugable)', () => {
      const lemma = makeLemma('bųde/bųdųt', 'AUX', 'v.aux. ipf.');
      assert.deepStrictEqual(deriveFromVerb({ lemma, lid: '22979' }), []);
    });

    test('dom m. -> no derivations', () => {
      const lemma = makeLemma('dom', 'NOUN', 'm.');
      assert.deepStrictEqual(derive({ lemma, lid: '702' }), []);
      assert.strictEqual(canDerive({ lemma, lid: '702' }), false);
    });

    // Until a later pass resolves them, the words of a multi-word lemma carry
    // neither upos nor lemma.
    const unresolved: Lemma = {
      xpos: 'v.tr. ipf.',
      words: [{ form: 'dělati' }],
    };

    test('unresolved word -> no derivations', () => {
      assert.deepStrictEqual(derive({ lemma: unresolved, lid: '703' }), []);
      assert.strictEqual(canDerive({ lemma: unresolved, lid: '703' }), false);
    });

    test('unresolved word -> no derivations from any single deriver', () => {
      const ctx = { lemma: unresolved, lid: '704' };
      assert.deepStrictEqual(deriveFromVerb(ctx), []);
      assert.deepStrictEqual(deriveFromAdjective(ctx), []);
      assert.deepStrictEqual(deriveFromAdverb(ctx), []);
    });

    test('derivers ignore a part of speech that is not theirs', () => {
      const noun = { lemma: makeLemma('dom', 'NOUN', 'm.'), lid: '705' };
      assert.deepStrictEqual(deriveFromVerb(noun), []);
      assert.deepStrictEqual(deriveFromAdjective(noun), []);
      assert.deepStrictEqual(deriveFromAdverb(noun), []);
    });
  });

  test('canDerive accepts verbs, adjectives and adverbs', () => {
    const derivable = [
      makeLemma('dělati', 'VERB', 'v.tr. ipf.'),
      makeLemma('byti', 'AUX', 'v.aux. ipf.'),
      makeLemma('dobry', 'ADJ', 'adj.'),
      makeLemma('dobro', 'ADV', 'adv.'),
    ];

    for (const lemma of derivable) {
      assert.strictEqual(canDerive({ lemma, lid: '800' }), true);
    }
  });

  describe('polymorphic derive() calls', () => {
    test('derive with bare string', () => {
      const derived = derive('dělati');
      assert.ok(derived.length > 0);
      assert.ok(
        derived.some(
          (t) => t.form === 'dělańje' && t.misc?.Derivation === 'v_noun',
        ),
      );
      assert.ok(
        derived.some(
          (t) => t.form === 'dělajųći' && t.misc?.Derivation === 'v_prap',
        ),
      );
      // Raw string call should not set LID/SID
      assert.strictEqual(derived[0].misc?.LID, undefined);
    });

    test('derive with KnownForm object', () => {
      const derived = derive({ form: 'dobry', xpos: 'adj.' });
      assert.ok(
        derived.some(
          (t) => t.form.includes('lěpši') && t.misc?.Derivation === 'adj_cmp',
        ),
      );
      assert.ok(
        derived.some(
          (t) => t.form === 'dobro' && t.misc?.Derivation === 'adj_adv',
        ),
      );
    });

    test('derive with options filter', () => {
      const all = derive('dělati');
      const onlyParticiples = derive('dělati', { types: ['v_prap', 'v_prpp'] });
      assert.ok(onlyParticiples.length < all.length);
      assert.ok(
        onlyParticiples.every(
          (t) =>
            t.misc?.Derivation &&
            ['v_prap', 'v_prpp'].includes(t.misc.Derivation),
        ),
      );
    });

    test('derive without analytical forms', () => {
      const withAnalytical = derive('dobry');
      const withoutAnalytical = derive('dobry', { includeAnalytical: false });
      assert.ok(withAnalytical.some((t) => t.misc?.Derivation === 'adj_sup_a'));
      assert.ok(
        !withoutAnalytical.some((t) => t.misc?.Derivation === 'adj_sup_a'),
      );
    });
  });
});

describe('derive edge cases and participles', () => {
  test('participle comma variants split into separate distinct tokens', () => {
    const derived = derive('dělati');
    const prppTokens = derived.filter((t) => t.misc?.Derivation === 'v_prpp');
    // dělajemy and dělamy must be separate tokens, NOT a combined comma string
    assert.strictEqual(prppTokens.length, 2);
    assert.strictEqual(prppTokens[0]?.form, 'dělajemy');
    assert.strictEqual(prppTokens[1]?.form, 'dělamy');
    assert.ok(!prppTokens.some((t) => t.form.includes(',')));
  });

  test('participles do not derive comparison forms (cmp, sup, adv)', () => {
    const prapDerived = derive({ form: 'dělajųći', xpos: 'v.prap.' });
    assert.strictEqual(prapDerived.length, 0);

    const prppDerived = derive({ form: 'dělajemy', xpos: 'v.prpp.' });
    assert.strictEqual(prppDerived.length, 0);
  });
});

describe('derive central variant splitting', () => {
  test('dobry splits comparative and superlative variants into individual tokens', () => {
    const derived = derive('dobry');
    const compTokens = derived.filter((t) => t.misc?.Derivation === 'adj_cmp');
    assert.strictEqual(compTokens.length, 2);
    assert.strictEqual(compTokens[0]?.form, 'lěpši');
    assert.strictEqual(compTokens[1]?.form, 'lučši');

    const supTokens = derived.filter((t) => t.misc?.Derivation === 'adj_sup');
    assert.strictEqual(supTokens.length, 2);
    assert.strictEqual(supTokens[0]?.form, 'najlěpši');
    assert.strictEqual(supTokens[1]?.form, 'najlučši');

    // Adjectives derive positive adverb (adj_adv), but NOT comparative adverbs
    const advPosTokens = derived.filter(
      (t) => t.misc?.Derivation === 'adj_adv',
    );
    assert.strictEqual(advPosTokens.length, 1);
    assert.strictEqual(advPosTokens[0]?.form, 'dobro');

    const advCompFromAdj = derived.filter(
      (t) => t.misc?.Derivation === 'adv_cmp',
    );
    assert.strictEqual(advCompFromAdj.length, 0);

    // Comparative adverbs are derived directly from the adverb (dobro)
    const advDerived = derive({ form: 'dobro', xpos: 'adv.' });
    const advCompTokens = advDerived.filter(
      (t) => t.misc?.Derivation === 'adv_cmp',
    );
    assert.strictEqual(advCompTokens.length, 2);
    assert.strictEqual(advCompTokens[0]?.form, 'lěpje');
    assert.strictEqual(advCompTokens[1]?.form, 'lučše');
  });
});

describe('derive non-gradable / relational / ordinal restrictions', () => {
  test('ordinal numerals (num.ord.) do not derive comparative forms', () => {
    const derived = derive({ form: 'prvy', xpos: 'num.ord.' });
    assert.strictEqual(derived.length, 0);

    const derived2 = derive({ form: 'vtory', xpos: 'num.ord.' });
    assert.strictEqual(derived2.length, 0);
  });

  test('pronouns / determiners (pron.poss., pron.dem.) do not derive comparative forms', () => {
    const derived = derive({ form: 'moj', xpos: 'pron.poss.' });
    assert.strictEqual(derived.length, 0);

    const derived2 = derive({ form: 'sej', xpos: 'pron.dem.' });
    assert.strictEqual(derived2.length, 0);
  });

  test('relational adjectives (adj.rel.) do not derive comparative forms', () => {
    const derived = derive({ form: 'morsky', xpos: 'adj.rel.' });
    // May only derive positive adverb if applicable, but definitely NO cmp/sup forms
    assert.ok(!derived.some((t) => t.misc?.Derivation?.includes('cmp')));
    assert.ok(!derived.some((t) => t.misc?.Derivation?.includes('sup')));
  });

  test('absolute adjectives (adj.abs.) do not derive comparative forms', () => {
    const derived = derive({ form: 'glavni', xpos: 'adj.abs.' });
    assert.ok(!derived.some((t) => t.misc?.Derivation?.includes('cmp')));
    assert.ok(!derived.some((t) => t.misc?.Derivation?.includes('sup')));
  });
});

describe('derive script invariance (Cyrillic, Glagolitic, ASCII)', () => {
  test('Cyrillic verb derives identically to Latin', () => {
    const latinTokens = derive('dělati');
    const cyrillicTokens = derive('дѣлати');

    assert.ok(cyrillicTokens.length > 0);
    assert.strictEqual(cyrillicTokens.length, latinTokens.length);
    for (let i = 0; i < latinTokens.length; i++) {
      assert.strictEqual(cyrillicTokens[i]?.form, latinTokens[i]?.form);
      assert.strictEqual(
        cyrillicTokens[i]?.misc?.Derivation,
        latinTokens[i]?.misc?.Derivation,
      );
    }
  });

  test('Glagolitic verb derives identically to Latin', () => {
    const latinTokens = derive('dělati');
    const glagoliticTokens = derive('ⰴⱑⰾⰰⱅⰹ');

    assert.ok(glagoliticTokens.length > 0);
    assert.strictEqual(glagoliticTokens.length, latinTokens.length);
    for (let i = 0; i < latinTokens.length; i++) {
      assert.strictEqual(glagoliticTokens[i]?.form, latinTokens[i]?.form);
      assert.strictEqual(
        glagoliticTokens[i]?.misc?.Derivation,
        latinTokens[i]?.misc?.Derivation,
      );
    }
  });

  test('Cyrillic adjective derives comparison and adverb forms', () => {
    const derived = derive('добры');
    assert.ok(
      derived.some(
        (t) => t.form === 'dobro' && t.misc?.Derivation === 'adj_adv',
      ),
    );
    assert.ok(
      derived.some(
        (t) => t.form === 'lěpši' && t.misc?.Derivation === 'adj_cmp',
      ),
    );
    assert.ok(
      derived.some(
        (t) => t.form === 'najdobry' && t.misc?.Derivation === 'adj_sup_a',
      ),
    );
  });

  test('Cyrillic adverb derives comparative and superlative forms', () => {
    const derived = derive({ form: 'добро', xpos: 'adv.' });
    assert.ok(
      derived.some(
        (t) => t.form === 'lěpje' && t.misc?.Derivation === 'adv_cmp',
      ),
    );
    assert.ok(
      derived.some(
        (t) => t.form === 'najlěpje' && t.misc?.Derivation === 'adv_sup',
      ),
    );
    assert.ok(
      derived.some(
        (t) => t.form === 'najdobro' && t.misc?.Derivation === 'adv_sup_a',
      ),
    );
  });

  test('canDerive works across scripts', () => {
    assert.strictEqual(canDerive('дѣлати'), true);
    assert.strictEqual(canDerive('ⰴⱑⰾⰰⱅⰹ'), true);
    assert.strictEqual(canDerive('добры'), true);
    assert.strictEqual(canDerive({ form: 'добро', xpos: 'adv.' }), true);
    assert.strictEqual(canDerive('дом'), false);
  });
});

describe('derive structured feats inspection', () => {
  test('direct Lemma object as input to derive()', () => {
    const lemma = makeLemma('dělati', 'VERB', 'v.tr. ipf.', {
      Aspect: 'Imp',
      VerbForm: 'Inf',
    });
    const derived = derive(lemma);
    assert.ok(derived.length > 0);
    assert.ok(derived.some((t) => t.form === 'dělańje'));
  });

  test('participle in feats skips derivation even with verb upos', () => {
    const lemma = makeLemma('dělajųći', 'VERB', 'v.tr. ipf.', {
      VerbForm: 'Part',
    });
    assert.deepStrictEqual(derive(lemma), []);
  });

  test('adjective with Poss: Yes skips comparison derivation', () => {
    const lemma = makeLemma('bratov', 'ADJ', 'adj.', {
      Degree: 'Pos',
      Poss: 'Yes',
    });
    assert.deepStrictEqual(derive(lemma), []);
  });

  test('adjective with Degree: Cmp derives only superlative', () => {
    const lemma = makeLemma('lěpši', 'ADJ', 'adj.', {
      Degree: 'Cmp',
    });
    const result = derive(lemma);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0]?.form, 'najlěpši');
    assert.strictEqual(result[0]?.misc?.Derivation, 'adj_sup');
  });

  test('adverb with Degree: Cmp derives only superlative', () => {
    const lemma = makeLemma('bolje', 'ADV', 'adv.', {
      Degree: 'Cmp',
    });
    const result = derive(lemma);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0]?.form, 'najbolje');
    assert.strictEqual(result[0]?.misc?.Derivation, 'adv_sup');
  });
});
