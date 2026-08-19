// The `--test-reporter` entry point: names the failing lemma in the report.
//
// It used to render the paradigm as a table too, out of a set of HTML
// templates that took the old display strings. Those went when the strings
// did: a snapshot is now a list of forms with their features, which the
// generic reporter shows as well as any template could.
import { createReporter } from '@interslavic/dev-reporter';

import { findLemmaById } from './src/__utils__/lemmata.ts';

export default createReporter({
  // Fixture-driven tests are titled by dictionary ID; prepend the lemma.
  title: (name) => {
    const id = /^-?\d+/.exec(name)?.[0];
    const lemma = id && findLemmaById(id);
    return lemma && lemma !== id ? `${lemma} — ${name}` : name;
  },
  output: process.env.TEST_REPORT ?? 'test-report.html',
});
