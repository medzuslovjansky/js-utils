import { establishGender } from './establishGender';

describe('estabishGender', () => {
  test.each([
    'ibis',
    'jaźь',
    'ježь',
    'konjь',
    'kråljь',
    'krȯt',
    'kum',
    'lev',
    'menjь',
    'mnih',
    'neuk',
    'omar',
    'pan',
    'råb',
    'sųp',
    'sųsěd',
    'šef',
    'šimpanz',
    'ujь',
    'vol',
    'vođ',
    'vråg',
    'vųžь',
    'zebu', // TODO: is this declinable at all?
    'zęťь',
    'žiteljь',
  ])('m1: %s', (word) => {
    expect(establishGender(word, 'm1')).toBe('m1');
  });

  test.each([
    'akt',
    'bob',
    'drn',
    'god',
    'golf',
    'jug',
    'lov',
    'lěs',
    'lųk',
    'mah',
    'pųp',
    'tyl',
    'voz',
    'šum',
    'žar',

    'boljь',
    'hmeljь',
    'čajь',
    'dušь',
    'črtežь',
    'mečь',
    'měďь',
    'muljь',
    'låk(ȯ)ťь',
    'nog(ȯ)ťь',
    'olejь',
    'pėnjь',
    'svęźь',
    'dȯžьďь',
    'kyjь',
    'ovoćь',
    'pųťь',
    'těnjь',
    'želųďь',
    'zųbecь',
    'glosarijь',
    'vějaŕь',
  ])('m2: %s', (word) => {
    expect(establishGender(word, 'm2')).toBe('m2');
  });

  test.each(['jelenjь'])('m3 (animate): %s', (word) => {
    expect(establishGender(word, 'm1')).toBe('m3');
  });

  test.each([
    'grebenjь',
    'jęčmenjь',
    'kamenjь',
    'korenjь',
    'kremenjь',
    'plåmenjь',
    'pŕstenjь',
    'šeršenjь',
    'dėnjь',
    'stepenjь',
    'stųpenjь', // TODO: escalate change jer to e in the dictionary
    'strumenjь',
  ])('m3 (inanimate): %s', (word) => {
    expect(establishGender(word, 'm2')).toBe('m3');
  });

  test.each([
    'Kuba',
    'Nikaragua',
    'anketa',
    'babicьa',
    'bala',
    'barva',
    'baza',
    'boa',
    'bogyni', // TODO: escalate change to bogynja
    'dråga',
    'dupa',
    'dȯćera',
    'dȯćьi',
    'epoha',
    'fajka',
    'kosa',
    'međa',
    'norma',
    'pani',
    'škoda',
    'žirafa',
    'žricьa',
  ])('f1: %s', (word) => {
    expect(establishGender(word, 'f')).toBe('f1');
  });

  xtest.each([
    'grizli',
    'kari',
    'kolibri',
    'lori',
    'poni',
    'safari',
    'viski',
    'zombi',
  ])('f1: %s', (word) => {
    // m1 is an oversimplification but anyway this test does not pass
    expect(establishGender(word, 'm1')).not.toBe('f1');
  });

  test.each([
    'brťь',
    'danjь',
    'kaďь',
    'kosťь',
    'lučь',
    'maźь',
    'myšь',
    'mųťь',
    'niťь',
    'noćь',
    'oděžь',
    'osťь',
    'ośь',
    'skrb',
    'sěťь',
    'těnjь',
    'vualjь',
    'žȯlčь',
  ])('f2: %s', (word) => {
    expect(establishGender(word, 'f')).toBe('f2');
  });

  test.each([
    'brȯv',
    'crkȯv',
    'jatrȯv',
    'krȯv',
    'ljubȯv',
    'obuv',
    'svekrȯv',
    'žȯlv',
    'mati',
    // TODO:
    'dočьi',
    'doćьi',
  ])('f3: %s', (word) => {
    expect(establishGender(word, 'f')).toBe('f3');
  });

  test.each([
    'koljcьe',
    'kopjьe',
    'ložьe',
    'mango',
    'mylo',
    'męso',
    'mųdo',
    'ogniščьe',
    'piśmo',
    'radio',
    'runo',
    'sito',
    'srodstvo',
    'sŕdcьe',
    'sȯlncьe',
    'tempo',
    'uško',
    'video',
    'vědro',
    'věćьe',
    'želězo',
  ])('n1: %s', (word) => {
    expect(establishGender(word, 'n')).toBe('n1');
  });

  test.each([
    // -ę
    'brěmę',
    'dvojčьę',
    'dětę',
    'děvčьę',
    'gųsę',
    'imę',
    'jagnę',
    'jelenę',
    'katę',
    'kotę',
    'lisę',
    'ljvę',
    'medvěđę',
    'međuvrěmę',
    'mlådę',
    'městoimę',
    'orlę',
    'oslę',
    'piśmę',
    'plemę',
    'pråsę',
    'prězimę',
    'ptačьę',
    'ramę',
    'stremę',
    'sěmę',
    'telę',
    'vnučьę',
    'vrěmę',
    'vymę',
    'zaimę',
    'znamę',
    'ščenę',
    'žrěbę',
    // -e
    'akne',
    'aloe',
    'Čile',
    'kabare',
    'Zimbabve',
  ])('n2: %s', (word) => {
    expect(establishGender(word, 'n')).toBe('n2');
  });

  test.each([
    'čudo',
    'divo',
    'drěvo',
    'dělo',
    'igo',
    'kolo',
    'licьe',
    'nebo',
    'ojьe',
    'oko',
    'slovo',
    'tělo',
    'uho',
  ])('n3: %s', (word) => {
    expect(establishGender(word, 'n')).toBe('n3');
  });
});
