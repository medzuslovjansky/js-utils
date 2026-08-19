/**
 * Derivation from verbs.
 *
 * Derives participles (prap, prpp, pfap, pfpp) and verbal nouns (gerund) from verbs.
 *
 * The derivation respects aspect and transitivity:
 * - prap (present active participle): imperfective verbs only
 * - prpp (present passive participle): imperfective transitive verbs only
 * - pfap (past active participle): all verbs
 * - pfpp (past passive participle): transitive verbs only
 * - vnoun (verbal noun/gerund): all verbs
 */

import { conjugateVerb } from '../inflect/verb/index.ts';
import { transliterate } from '@interslavic/translit';
import { parseXPos } from '../steen/index.ts';
import type { DeriveContext, DerivationResult } from './core.ts';
import { filterValidResults } from './core.ts';
import type { DerivationType } from './virtual-id.ts';

function isTransitive(xpos: string): boolean {
  return /\btr\b/.test(xpos);
}

/**
 * Get the irregular paradigm hint from the lemma's paradigms.
 */
function getIrregular(ctx: DeriveContext): string | undefined {
  return ctx.lemma.paradigms?.find((p) => p.startsWith('('));
}

/**
 * Check if the lemma is a simple verb (single word or verb + reflexive sę).
 * We only derive from simple verbs, not MWEs like "ne sȯglåsiti sę".
 */
function isSimpleVerb(ctx: DeriveContext): boolean {
  const { lemma } = ctx;
  const nonPunct = lemma.words.filter((w) => w.upos !== 'PUNCT');

  // Single word - OK
  if (nonPunct.length === 1) {
    return true;
  }

  // Two words where second is reflexive sę/se - OK
  if (nonPunct.length === 2) {
    const [first, second] = nonPunct;
    if (
      (first.upos === 'VERB' || first.upos === 'AUX') &&
      (second.feats?.Reflex === 'Yes' ||
        second.form === 'sę' ||
        second.form === 'se')
    ) {
      return true;
    }
  }

  // Otherwise it's an MWE - skip derivation
  return false;
}

/**
 * Derive all applicable forms from a verb.
 */
export function deriveFromVerb(ctx: DeriveContext): DerivationResult[] {
  const { lemma } = ctx;

  // Skip MWEs (except simple reflexive verbs)
  if (!isSimpleVerb(ctx)) {
    return [];
  }

  // Find the verb word (first VERB/AUX)
  const word = lemma.words.find((w) => w.upos === 'VERB' || w.upos === 'AUX');

  if (!word?.lemma) {
    return [];
  }

  const [parsedUpos, parsedFeats] = parseXPos(word.lemma, lemma.xpos)[0] || [
    word.upos,
    {},
  ];
  const feats = { ...parsedFeats, ...word.feats };
  const upos = word.upos || parsedUpos;

  if (upos !== 'VERB' && upos !== 'AUX') {
    return [];
  }

  // Don't derive from participles (they're already derived from verbs)
  if (feats.VerbForm === 'Part') {
    return [];
  }

  const xpos = lemma.xpos;
  const irregular = getIrregular(ctx);

  // Get the verb paradigm
  const etymWord = transliterate(word.lemma, 'isv-Latn-x-etymolog');
  const paradigm = conjugateVerb(etymWord, irregular || '', xpos);

  if (!paradigm) {
    return [];
  }

  const results: DerivationResult[] = [];
  const impf = feats.Aspect === 'Imp' || !feats.Aspect;
  const trans = isTransitive(xpos);

  function addResults(
    rawForm: string | undefined,
    xposTag: string,
    derivationType: DerivationType,
  ) {
    if (!rawForm) return;
    const variants = rawForm
      .split(/[,/]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s !== '-' && s !== '—');
    for (const v of variants) {
      results.push({
        isv: v,
        xpos: xposTag,
        derivationType,
      });
    }
  }

  // prap - Present Active Participle (imperfective only)
  // e.g., dělati → dělajųći (v.prap.)
  if (impf && paradigm.prap) {
    addResults(paradigm.prap?.citation, 'v.prap.', 'prap');
  }

  // prpp - Present Passive Participle (imperfective transitive only)
  // e.g., dělati → dělajemy, dělamy (v.prpp.)
  if (impf && trans && paradigm.prpp) {
    addResults(paradigm.prpp?.citation, 'v.prpp.', 'prpp');
  }

  // pfap - Past Active Participle (all verbs)
  // e.g., sdělavši (v.pfap.)
  if (paradigm.pfap) {
    addResults(paradigm.pfap?.citation, 'v.pfap.', 'pfap');
  }

  // pfpp - Past Passive Participle (transitive only)
  // e.g., dělati → dělany (v.pfpp.)
  if (trans && paradigm.pfpp) {
    addResults(paradigm.pfpp?.citation, 'v.pfpp.', 'pfpp');
  }

  // vnoun - Verbal noun (all verbs)
  // e.g., dělati → dělańje (n.)
  if (paradigm.gerund) {
    addResults(paradigm.gerund, 'n.', 'vnoun');
  }

  return filterValidResults(results);
}
