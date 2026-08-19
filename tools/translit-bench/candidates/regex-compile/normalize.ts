export function normalize(text: string): string {
  return text
    .normalize('NFC')
    .replaceAll('ĺ', 'ľ')
    .replaceAll('ř', 'ŕ')
    .replaceAll('t́', 'ť')
    .replaceAll('ò', 'ȯ')
    .replaceAll('è', 'ė');
}
