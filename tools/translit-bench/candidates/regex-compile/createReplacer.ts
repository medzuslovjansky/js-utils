// Compiles a flat longest-match lookup table into one native RegExp instead
// of hand-scanning the string in JS. `String.prototype.replace` with a `g`
// alternation already does exactly what the old char-by-char loop did:
// scans left to right, and at each position tries the alternatives in the
// order they're written -- so sorting the keys longest-first before joining
// them reproduces the old "try maxLength down to 1" priority for free, and
// any position with no match is left untouched, same as the old fallback.
//
// This is built once per table at module-load time; only `remapWord` runs
// per word, so the sort/escape/compile cost here is amortised to nothing.
export function createReplacer(map: Record<string, string>) {
  const keys = Object.keys(map);
  for (const key of keys) {
    map[key] = mirrorTerminators(key, map[key]);
  }

  if (keys.length === 0) {
    // No rules: nothing to match. (An empty alternation would compile to a
    // regex that matches the empty string everywhere -- not what "no rules"
    // means here.)
    return (str: string) => str;
  }

  // Tried a character-class fast path for tables where every key is a
  // single code unit (order doesn't matter there, so no sort needed) --
  // measured against plain alternation head to head, and on this codebase's
  // table sizes the difference was inside run-to-run noise either way, not
  // a real win. One code path it stays.
  const re = new RegExp(
    keys
      .slice()
      .sort((a, b) => b.length - a.length)
      .map(escapeForAlternation)
      .join('|'),
    'g',
  );

  return function remapWord(str: string): string {
    return str.replace(re, (match) => map[match]);
  };
}

function mirrorTerminators(pattern: string, replacement: string) {
  const start = pattern[0] === '|' ? '|' : '';
  const end = pattern[pattern.length - 1] === '|' ? '|' : '';
  return `${start}${replacement}${end}`;
}

const ALTERNATION_SPECIALS = /[.*+?^${}()|[\]\\]/g;
function escapeForAlternation(key: string): string {
  return key.replace(ALTERNATION_SPECIALS, '\\$&');
}
