import { declensionAdjective } from '.';

import { adjectives } from './__utils__/fixtures';

import { ParadigmRegistry } from './__utils__';

import { stemmer } from './__utils__/stemmer';
import {
  extractAdjective,
  flattenAdjectiveOutput,
} from './__utils__/flatteners';

describe('Consolidated Paradigm Analysis', () => {
  // Grab the singleton instance
  const registry = ParadigmRegistry.getInstance();

  // Helper to finalize a morphological output into endings
  function processForms(lemma: string, pos: string, forms: string[]) {
    // You might do more filtering or normalizing here if needed
    const [, endings] = stemmer(forms);
    registry.register(endings, lemma, pos);
  }

  test('Collect and group morphological patterns (cases)', () => {
    /**
     * --- Adjectives ---
     */
    adjectives().forEach(([_id, morphology, lemma]) => {
      // Check if it actually is an adjective
      if (!morphology.startsWith('adj')) return;

      const actual = declensionAdjective(
        extractAdjective([lemma])[0],
        '',
        morphology,
      );
      const forms = flattenAdjectiveOutput(actual);

      processForms(lemma, 'adjective', extractAdjective(forms));
    });

    /**
     * --- Nouns ---
     */
    // Standard noun fixtures
    // [
    //   ...nouns_feminine(),
    //   ...nouns_masculine_animate(),
    //   ...nouns_masculine(),
    //   ...nouns_neuter(),
    // ].forEach(([_id, morphology, lemma, extra]) => {
    //   const actual = declensionNounSimple(lemma, morphology, extra);
    //   if (actual) {
    //     const forms = flattenNounOutput(actual);
    //     processForms(lemma, 'noun', forms);
    //   }
    // });

    // Noun misc: test as masculine and feminine
    // nouns_misc().forEach(([_id, morphology, lemma, extra]) => {
    //   // 1) As masculine
    //   const masc = declensionNounSimple(lemma, morphology, extra, 'masculine');
    //   masc && processForms(lemma, 'noun_masc', flattenNounOutput(masc));
    //
    //   // 2) As feminine
    //   const fem = declensionNounSimple(lemma, morphology, extra, 'feminine');
    //   fem && processForms(lemma, 'noun_fem', flattenNounOutput(fem));
    // });
    //
    // /**
    //  * Final step: review paradigms
    //  */
    const sortedParadigms = registry.getSortedParadigms();
    // // You could snapshot this or log it out:
    expect(sortedParadigms).toMatchSnapshot('consolidated-paradigm-analysis');

    // Or console.log for debugging:
    // console.log(JSON.stringify(sortedParadigms, null, 2));
  });
});
