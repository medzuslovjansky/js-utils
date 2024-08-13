export function descientify(text: string, compatibilityMode = false): string {
  return text
    .replaceAll('lıj', 'ľj')
    .replaceAll('nıj', 'ńj')
    .replaceAll('rıj', 'ŕj')
    .replaceAll('dıj', 'ďj')
    .replaceAll('sıj', 'śj')
    .replaceAll('zıj', 'źj')
    .replaceAll('jě', 'je')
    .replaceAll('ı', '')
    .replaceAll('ḓ', '')
    .replaceAll('’', '')
    .replaceAll(compatibilityMode ? 'e̊' : 'ė', 'ě')
    .replaceAll('ŀ', 'ȯl')
    .replaceAll('ř', 'r')
    .replaceAll('ṙ', 'r')
    .replaceAll('ù', 'v')
    .replaceAll('è', 'ė')
    .replaceAll('ò', 'ȯ');
}
