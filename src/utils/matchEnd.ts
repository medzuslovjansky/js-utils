export function matchEnd(
  str: string,
  suffixes: string | Array<string | string[]>,
): string {
  if (!Array.isArray(suffixes)) {
    return str.endsWith(suffixes) ? suffixes : '';
  }

  if (suffixes.length === 1 && !Array.isArray(suffixes[0])) {
    return matchEnd(str, suffixes[0]);
  }

  const S = suffixes.length;
  let end = str.length;
  let ending = '';

  for (let k = S - 1; k >= 0; k--) {
    const start = findSuffixesIndex(str, suffixes[k], end);
    if (start === -1) {
      return '';
    }

    ending = str.slice(start, end) + ending;
    end = start;
  }

  return ending;
}

function findSuffixesIndex(
  str: string,
  suffixes: string | string[],
  end: number,
): number {
  let cache = '';
  let len = 0;

  const arr = Array.isArray(suffixes) ? suffixes : [suffixes];
  for (const s of arr) {
    if (len !== s.length) {
      len = s.length;
      cache = str.slice(end - len, end);
    }

    if (cache === s) {
      return end - len;
    }
  }

  return -1;
}
