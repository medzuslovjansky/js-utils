export function areArraysEqual(
  a: IArguments | unknown[],
  b: IArguments | unknown[],
): boolean {
  const n = a.length;
  let i: number;

  if (n !== b.length) return false;

  for (i = 0; i < n; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}
