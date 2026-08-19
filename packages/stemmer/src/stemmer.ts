import { ENDINGS } from './endings.ts';
import { fold } from './fold.ts';

/**
 * A stem shorter than this is not a stem, it is a coincidence. It is also what
 * keeps a rule learnt from long words off short ones: `-omu` is three letters
 * of `mlådomu` and one letter of `domu`.
 */
const MIN_STEM = 3;

/**
 * Exported so the bench can score a table learnt from part of the lexicon
 * against the part it never saw. Without that, nothing distinguishes a rule
 * that generalizes from a word the table simply memorized.
 */
export function stemmerFor(endings: string): (word: string) => string {
  const table = new Map<string, number>();
  let longest = 0;

  for (const entry of endings.trim().split(/\s+/)) {
    const context = entry.slice(0, -1);
    table.set(context, Number(entry.slice(-1)));
    if (context.length > longest) longest = context.length;
  }

  return (word) => {
    const w = fold(word);

    let cut = 0;
    for (let d = Math.min(longest, w.length); d >= 0; d--) {
      const hit = table.get(w.slice(w.length - d));
      if (hit !== undefined) {
        cut = hit;
        break;
      }
    }

    // clamped rather than skipped: the rule has the right ending in mind, it
    // just met a shorter word than the ones it was learnt from
    const keep = Math.max(MIN_STEM, w.length - cut);
    return keep >= w.length ? w : w.slice(0, keep);
  };
}

/**
 * Fold a word to one key per script and flavorisation, then cut its inflection
 * off. The result is not a lemma and is not meant to be readable: it is an
 * index key, and its only job is that every form of a word produces the same
 * one while unrelated words produce different ones.
 *
 * The cut comes from the longest word-final context in `ENDINGS`, one lookup
 * per context length. The previous design — ordered category passes over hand
 * written ending lists — scored F1 79 against this one's 91, and the reason is
 * that the categories overlap: a pass that fires early cannot see what a later
 * one would have done, so every ambiguous ending was resolved by guesswork
 * about category order instead of by what the lexicon actually does.
 */
export const stem: (word: string) => string = stemmerFor(ENDINGS);
