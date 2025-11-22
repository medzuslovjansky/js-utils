import { declensionAdjective } from '../adjective';
import { parseXPos } from '../conllu/parseXPOS';
import { normalizeForm, isValidDerivedWord } from './utils';
import { DerivedLemma } from './types';

export function deriveFromAdjective(
  lemma: string,
  xpos: string,
): DerivedLemma[] {
  const derived: DerivedLemma[] = [];

  // Skip if item is ordinal numeral (starts with num.)
  if (!xpos || xpos.startsWith('num.')) return derived;

  const variants = parseXPos(xpos);

  for (const [upos, baseFeats] of variants) {
    if (upos !== 'ADJ') continue;

    // Only derive from positive degree to avoid recursion/duplication loops
    if (baseFeats.Degree && baseFeats.Degree !== 'Pos') continue;

    // Skip participles from further derivation for now
    if (baseFeats.VerbForm === 'Part') continue;

    // 1. Negation: dobry -> nedobry
    if (baseFeats.Polarity !== 'Neg') {
      if (!lemma.toLowerCase().startsWith('ne')) {
        const negLemma = 'ne' + lemma;
        derived.push({
          lemma: negLemma,
          xpos: xpos, // Keeps same XPOS structure
          derivation: 'pfx:ne',
          features: { Polarity: 'Neg' },
        });
      }
    }

    const paradigm = declensionAdjective(lemma, '', xpos);

    // 2. Adverb: dobry -> dobro
    if (
      paradigm.comparison &&
      paradigm.comparison.positive &&
      paradigm.comparison.positive.length > 1
    ) {
      const advForm = paradigm.comparison.positive[1];
      if (advForm) {
        const advs = normalizeForm(advForm);
        advs.forEach((adv) => {
          if (isValidDerivedWord(adv))
            derived.push({
              lemma: adv,
              xpos: 'adv.',
              derivation: 'adv:pos',
              features: { Degree: 'Pos' },
            });
        });
      }
    }

    // 3. Comparative: dobry -> lěpši / slaběje (adv)
    if (
      paradigm.comparison &&
      paradigm.comparison.comparative &&
      paradigm.comparison.comparative.length > 0
    ) {
      const adjComp = paradigm.comparison.comparative[0];
      const advComp = paradigm.comparison.comparative[1];

      if (adjComp) {
        const adjs = normalizeForm(adjComp);
        adjs.forEach((adj) => {
          if (isValidDerivedWord(adj))
            derived.push({
              lemma: adj,
              xpos: 'adj. comp.',
              derivation: 'adj:cmp',
              features: { Degree: 'Cmp' },
            });
        });
      }
      if (advComp) {
        const advs = normalizeForm(advComp);
        advs.forEach((adv) => {
          if (isValidDerivedWord(adv))
            derived.push({
              lemma: adv,
              xpos: 'adv. comp.',
              derivation: 'adv:cmp',
              features: { Degree: 'Cmp' },
            });
        });
      }
    }

    // 4. Superlative: dobry -> najlěpši / najslaběje (adv)
    if (
      paradigm.comparison &&
      paradigm.comparison.superlative &&
      paradigm.comparison.superlative.length > 0
    ) {
      const adjSup = paradigm.comparison.superlative[0];
      const advSup = paradigm.comparison.superlative[1];

      if (adjSup) {
        const adjs = normalizeForm(adjSup);
        adjs.forEach((adj) => {
          if (isValidDerivedWord(adj))
            derived.push({
              lemma: adj,
              xpos: 'adj. sup.',
              derivation: 'adj:sup',
              features: { Degree: 'Sup' },
            });
        });
      }
      if (advSup) {
        const advs = normalizeForm(advSup);
        advs.forEach((adv) => {
          if (isValidDerivedWord(adv))
            derived.push({
              lemma: adv,
              xpos: 'adv. sup.',
              derivation: 'adv:sup',
              features: { Degree: 'Sup' },
            });
        });
      }
    }

    // 5. Analytical Superlative: dobry -> najdobry
    if (
      paradigm.comparison &&
      paradigm.comparison.superlative &&
      paradigm.comparison.superlative.length > 0
    ) {
      const analyticalSup = 'naj' + lemma;
      if (isValidDerivedWord(analyticalSup)) {
        derived.push({
          lemma: analyticalSup,
          xpos: 'adj. sup.',
          derivation: 'pfx:naj',
          features: { Degree: 'Sup', Analyt: 'Yes' },
        });
      }
    }
  }

  return derived;
}
