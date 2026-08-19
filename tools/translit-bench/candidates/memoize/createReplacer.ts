const REGEXP_SPECIAL = /[.*+?^${}()|[\]\\]/g;
function escapeForRegExp(literal: string): string {
  return literal.replace(REGEXP_SPECIAL, '\\$&');
}

/**
 * Same contract as the old hand-rolled scan (longest key wins at each
 * position, unmatched characters pass through untouched), but compiled once
 * into a single native regular expression instead of walked one character
 * at a time.
 *
 * The old scan tried every length from the table's single longest key down
 * to 1 at *every* character -- e.g. a table with one 7-character rule like
 * `%szadu%` paid for 7 substring allocations and 7 failed object lookups at
 * every position, even though almost every other key in that same table is
 * one character. An alternation regex with the keys sorted longest-first
 * reproduces "prefer the longest match at this position" for free (a regex
 * engine tries alternatives left-to-right at a given start position, same as
 * the old loop tried lengths high-to-low), and does the scanning itself in
 * compiled code instead of a JS loop that slices and hits the map on every
 * miss.
 */
export function createReplacer(map: Record<string, string>) {
  for (const key of Object.keys(map)) {
    map[key] = mirrorTerminators(key, map[key]);
  }

  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  if (keys.length === 0) return (str: string) => str;

  const pattern = new RegExp(keys.map(escapeForRegExp).join('|'), 'g');

  function remapWord(str: string) {
    return str.replace(pattern, (match) => map[match]);
  }

  return remapWord;
}

function mirrorTerminators(pattern: string, replacement: string) {
  const start = pattern[0] === '|' ? '|' : '';
  const end = pattern[pattern.length - 1] === '|' ? '|' : '';
  return `${start}${replacement}${end}`;
}
