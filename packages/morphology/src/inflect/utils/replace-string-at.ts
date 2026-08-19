export function replaceStringAt(
  str: string,
  index: number,
  replacement: string,
  length = Math.max(1, replacement.length),
): string {
  if (index < 0 || index >= str.length) {
    return str;
  }

  return str.slice(0, index) + replacement + str.slice(index + length);
}
