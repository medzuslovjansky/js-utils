import { describe, test } from 'node:test';
import assert from 'node:assert';

import { establishGender } from '../establishGender.ts';

describe('estabishGender', () => {
  for (const word of [
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
  ]) {
    test(`m1: ${word}`, () => {
      assert.strictEqual(establishGender(word, 'm1'), 'm1');
    });
  }

  for (const word of [
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
  ]) {
    test(`m2: ${word}`, () => {
      assert.strictEqual(establishGender(word, 'm2'), 'm2');
    });
  }

  for (const word of ['jelenjь']) {
    test(`m3 (animate): ${word}`, () => {
      assert.strictEqual(establishGender(word, 'm1'), 'm3');
    });
  }

  for (const word of [
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
  ]) {
    test(`m3 (inanimate): ${word}`, () => {
      assert.strictEqual(establishGender(word, 'm2'), 'm3');
    });
  }

  for (const word of [
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
  ]) {
    test(`f1: ${word}`, () => {
      assert.strictEqual(establishGender(word, 'f'), 'f1');
    });
  }

  for (const word of [
    'grizli',
    'kari',
    'kolibri',
    'lori',
    'poni',
    'safari',
    'viski',
    'zombi',
  ]) {
    // These are indeclinable in the dictionary and never reach here from
    // `declineNoun`, so `m1` is only a sane fallback, not a claim about how
    // they decline.
    test(`not f1: ${word}`, () => {
      assert.notStrictEqual(establishGender(word, 'm1'), 'f1');
    });
  }

  for (const word of [
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
  ]) {
    test(`f2: ${word}`, () => {
      assert.strictEqual(establishGender(word, 'f'), 'f2');
    });
  }

  for (const word of [
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
  ]) {
    test(`f3: ${word}`, () => {
      assert.strictEqual(establishGender(word, 'f'), 'f3');
    });
  }

  for (const word of [
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
  ]) {
    test(`n1: ${word}`, () => {
      assert.strictEqual(establishGender(word, 'n'), 'n1');
    });
  }

  for (const word of [
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
  ]) {
    test(`n2: ${word}`, () => {
      assert.strictEqual(establishGender(word, 'n'), 'n2');
    });
  }

  for (const word of [
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
  ]) {
    test(`n3: ${word}`, () => {
      assert.strictEqual(establishGender(word, 'n'), 'n3');
    });
  }
});
