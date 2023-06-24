export function establishGender(noun: string, gender: string): string {
  const lastChar = noun.slice(-1);
  const beforeLastChar = noun.slice(-2, -1);
  const lastTwo = noun.slice(-2);
  const sub05 = noun.substring(0, 5);
  const sub06 = noun.substring(0, 6);
  const sub07 = noun.substring(0, 7);

  if (noun == 'den' || noun == 'dėn' || noun == 'denjь' || noun == 'dėnjь') {
    return 'm3';
  }
  if (
    gender.charAt(0) == 'm' &&
    (lastTwo === 'en' || noun.endsWith('enjь')) &&
    (sub05 === 'kamen' ||
      sub05 === 'jelen' ||
      sub06 === 'jęčmen' ||
      sub06 === 'ječmen' ||
      sub05 === 'koren' ||
      sub06 === 'kremen' ||
      sub06 === 'plåmen' ||
      sub06 === 'plamen' ||
      sub06 === 'pŕsten' ||
      sub06 === 'prsten' ||
      sub07 == 'strumen' ||
      sub06 === 'greben' ||
      sub06 === 'stępen' ||
      sub06 === 'stepen' ||
      sub06 === 'stųpen' ||
      sub06 === 'stupen' ||
      sub05 === 'šršen' ||
      sub05 === 'šŕšen' ||
      sub05 === 'sršen' ||
      sub05 === 'sŕšen' ||
      sub06 === 'šeršen')
  ) {
    return 'm3';
  }
  if (
    gender.charAt(0) == 'n' &&
    [
      'čudo',
      'dělo',
      'divo',
      'drěvo',
      'igo',
      'kolo',
      'licьe',
      'nebo',
      'ojьe',
      'oko',
      'slovo',
      'tělo',
      'uho',
    ].indexOf(noun) !== -1
  ) {
    return 'n3';
  }
  if (gender === 'f' && lastChar === 'v') {
    return 'f3';
  }
  if (noun === 'mati' || noun === 'dočьi' || noun === 'doćьi') {
    return 'f3';
  }
  if (lastChar === 'a' || lastChar === 'i') {
    return 'f1';
  }
  if (lastChar === 'ę') {
    return 'n2';
  }
  if (beforeLastChar !== 'ь' && lastChar === 'e') {
    return 'n2';
  }
  if (lastChar === 'o' || lastChar === 'e') {
    return 'n1';
  }
  if (gender == 'm1') {
    return 'm1';
  }
  if (gender == 'f') {
    return 'f2';
  }

  return 'm2';
}
