import { createReplacer } from './createReplacer.ts';

/**
 * Merges a sequence of raw substitution tables -- each one a pass that used
 * to run as its own full left-to-right scan -- into as few `createReplacer`
 * passes as can be proven safe, and returns the reduced pass list ready for
 * the usual `.reduce((acc, pass) => pass(acc), word)` composition.
 *
 * Two tables `earlier` then `later` may fuse into one flat map only if doing
 * so cannot change the result for any input. That takes two checks, not one:
 *
 * 1. No character may be matchable by *both* tables' keys. `earlier` runs
 *    to completion, using only its own keys and its own left-to-right scan
 *    order, before `later` ever sees the text -- so wherever `earlier`
 *    matches anything, at any position, it wins outright, at whatever
 *    length, using characters `later` never gets a look at. A merged trie
 *    doesn't know any of that ordering: it just walks left to right over
 *    the union of both key sets. If the two key alphabets share a
 *    character, a `later` key starting *before* an `earlier` key -- not
 *    only a longer key at the *same* start, a genuinely separate failure
 *    first found the hard way -- can claim a character the scan would
 *    only reach `earlier`'s match through a moment later, silently
 *    stealing a match `earlier` should have taken first. (`nЬ` in a later
 *    pass reaching back to grab the `Ь` that an earlier pass's `Ьıь` was
 *    about to consume whole is exactly this: the merged scan meets the
 *    `n` first and never gets to ask what `earlier` would have done with
 *    the `Ь` two characters on.) Disjoint key alphabets rule the whole
 *    class out at once, rather than chasing each shape of it individually.
 * 2. `earlier` must not be able to *produce* a character `later` reacts
 *    to (`earlier`'s emitted characters and `later`'s matched characters
 *    are disjoint) -- otherwise the merged single pass would need to
 *    apply `later`'s rule to text `earlier` just wrote in the very same
 *    pass, which one flat lookup cannot do (it fires one table entry per
 *    position, never two in sequence).
 *
 * Both checks are necessary; neither alone is sufficient. Checked only
 * against the immediately-preceding accumulated group, in the original
 * pass order, matching how the passes used to run.
 */
export type RawMap = Record<string, string>;

/** Tally of what the soundness test decided, for reporting. Cumulative
 * across every call site in the candidate -- read after all modules that
 * call `composePasses` have loaded. */
export const fusionStats = { fused: 0, refused: 0 };

function charsOf(strings: Iterable<string>): Set<string> {
  const set = new Set<string>();
  for (const s of strings) for (const ch of s) set.add(ch);
  return set;
}

function disjoint(a: Set<string>, b: Set<string>): boolean {
  const [small, big] = a.size <= b.size ? [a, b] : [b, a];
  for (const x of small) if (big.has(x)) return false;
  return true;
}

/** A running accumulation of one or more raw maps already proven fusable,
 * with its emit/match sets tracked incrementally rather than recomputed
 * from the merged map on every new candidate. */
class Group {
  readonly map: RawMap;
  private emit: Set<string>;
  private match: Set<string>;

  constructor(seed: RawMap) {
    this.map = { ...seed };
    this.emit = charsOf(Object.values(seed));
    this.match = charsOf(Object.keys(seed));
  }

  canAbsorb(next: RawMap): boolean {
    const nextMatch = charsOf(Object.keys(next));
    if (!disjoint(this.match, nextMatch)) return false;
    if (!disjoint(this.emit, nextMatch)) return false;
    return true;
  }

  absorb(next: RawMap): void {
    Object.assign(this.map, next);
    for (const ch of charsOf(Object.values(next))) this.emit.add(ch);
    for (const ch of charsOf(Object.keys(next))) this.match.add(ch);
  }
}

/**
 * Reduces a sequence of raw tables (in the order they used to run as
 * separate passes) to the minimal number of `createReplacer` passes that
 * the soundness test can prove equivalent to running them all separately.
 */
export function composePasses(
  passes: RawMap[],
): Array<(word: string) => string> {
  const groups: Group[] = [];

  for (const raw of passes) {
    const last = groups[groups.length - 1];
    if (last && last.canAbsorb(raw)) {
      last.absorb(raw);
      fusionStats.fused++;
    } else {
      if (last) fusionStats.refused++;
      groups.push(new Group(raw));
    }
  }

  return groups.map((g) => createReplacer(g.map));
}
