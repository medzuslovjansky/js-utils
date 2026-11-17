import { mapStep, prosody, regexStep, type Step } from '../steps.ts';

// Non-jat ije is stem-final i + je (nije = ne+je, čije, pije- forms). No regex
// separates it from word-final jat (dvije, prije), so frequent offenders go on a
// stop-list. Add words when a fixture needs them.
const NON_JAT_IJE = new Set(['nije', 'čije', 'pije', 'pijem', 'piješ', 'piju']);

export const hr: readonly Step[] = [
  prosody,
  {
    name: 'hr-jat',
    // only the ijekavian trigraph is jat (rijeka→rěka); plain je stays (jezik)
    apply: (word) =>
      word
        .split(' ')
        .map((token) =>
          NON_JAT_IJE.has(token) ? token : token.replaceAll('ije', 'ě'),
        )
        .join(' '),
  },
  // short jat is consonant + je (mjesto→město, vjera→věra); the lookbehind skips
  // word-initial (jezik) and post-vocalic (moje) je. Latinate loans fold too
  // (objekt→oběkt), which costs only a diacriticFold (e↔ě) against the cognate.
  regexStep('hr-short-jat', /(?<=[bcčdfgklmnprsštvzž])je/g, 'ě'),
  // ISV standard writes ć as č and đ as dž (noć→noč, međa→medža)
  mapStep('hr-letters', { ć: 'č', đ: 'dž' }),
];
