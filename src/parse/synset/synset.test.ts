import parseSynset from './synset';
import parsePartOfSpeech from '../partOfSpeech';

describe('parseSynset', () => {
  test.each([
    ['', '', undefined],
    ['!', '', undefined],
    ['#', '', undefined],
    ['#!', '', undefined],
    ['!#', '', '#!'],
    ['!#course', '', '#!course'],
    ['!U-Boot', '', undefined],
    ['#co-worker', '', undefined],
    ['#!only, ĝuste nun', '', undefined],
    ["з'явитися", 'v. refl.', undefined],
    ['сей (устар.; местоим.)', 'pron. dem.', undefined],
    ['по, за (напр.: по грибы, за хлебом)', '', undefined],
    ['собака (символ) [@]', 'f.', 'собака [@] (символ)'],
    ['реформација (верски / политички покрет)', 'f.', undefined],
    ['there was/were not', 'phrase', undefined],
    ['будет / будут', '', undefined],
    ['и; а, зато (смысл2)', 'conj.', undefined],
    ['Добрий ранок!; Доброго ранку!', 'phrase', undefined],
  ])(
    'should parse synset: %s',
    (value: string, pos: string, expectedSerialization: string | undefined) => {
      const partOfSpeech = pos ? parsePartOfSpeech(pos) : null;
      const isPhrase = partOfSpeech?.name === 'phrase';

      const synset = parseSynset(value, { isPhrase });
      expect(synset).toMatchSnapshot('synset');
      expect(`${synset}`).toMatchSnapshot('toString');
      expect(`${synset}`).toBe(expectedSerialization || value);
    },
  );
});
