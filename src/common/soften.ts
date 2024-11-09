const FULL_SOFTENABLE_CONSONANT_MAP: Record<string, string> = {
  D: 'Ď',
  L: 'Ľ',
  N: 'Ń',
  R: 'Ŕ',
  S: 'Ś',
  T: 'Ť',
  Z: 'Ź',
  d: 'ď',
  l: 'ľ',
  n: 'ń',
  r: 'ŕ',
  s: 'ś',
  t: 'ť',
  z: 'ź',
};

export function soften(str: string, index = str.length - 1): string {
  const pos = index < 0 ? str.length + index : index;
  if (pos < 0) return str;

  const before = str.slice(0, pos) || '';
  const softened = FULL_SOFTENABLE_CONSONANT_MAP[str[pos]] || str[pos] || '';
  const after = str.slice(pos + 1) || '';

  return before + softened + after;
}
