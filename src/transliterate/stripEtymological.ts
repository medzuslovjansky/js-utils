const MAP: Record<string, string> = {
  å: 'a',
  ć: 'č',
  ď: 'd',
  đ: 'dž',
  è: 'e',
  ę: 'e',
  ĺ: 'l',
  ń: 'n',
  ȯ: 'o',
  ŕ: 'r',
  ś: 's',
  ť: 't',
  ų: 'u',
  ŭ: 'v',
  ź: 'z',
};

export function stripEtymological(word: string): string {
  let result = '';
  for (const char of word) {
    result += MAP[char] || char;
  }
  return result;
}
