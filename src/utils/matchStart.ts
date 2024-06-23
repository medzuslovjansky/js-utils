export function matchStart(
  str: string,
  prefixes: string | Array<string | string[]>,
): string {
  if (!Array.isArray(prefixes)) {
    return str.startsWith(prefixes) ? prefixes : '';
  }

  if (prefixes.length === 1 && !Array.isArray(prefixes[0])) {
    return matchStart(str, prefixes[0]);
  }

  const P = prefixes.length;
  let start = 0;
  let prefix = '';

  for (let k = 0; k < P; k++) {
    const end = findPrefixesIndex(str, prefixes[k], start);
    if (end === -1) {
      return '';
    }

    prefix += str.slice(start, end);
    start = end;
  }

  return prefix;
}

function findPrefixesIndex(
  str: string,
  prefixes: string | string[],
  start: number,
): number {
  let cache = '';
  let len = 0;

  const arr = Array.isArray(prefixes) ? prefixes : [prefixes];
  for (const p of arr) {
    if (len !== p.length) {
      len = p.length;
      cache = str.slice(start, start + len);
    }

    if (cache === p) {
      return start + len;
    }
  }

  return -1;
}
