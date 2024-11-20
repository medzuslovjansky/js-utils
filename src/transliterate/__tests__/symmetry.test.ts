import * as fixtures from '../../__utils__/fixtures';
import transliterate from '..';

describe('transliteration integrity', () => {
  test('symmetry between Latin and Cyrillic', () => {
    const exceptions = fixtures
      .word_forms()
      .reduce((acc: string[], word: string) => {
        const lat = transliterate(word, 'isv-Latn', true);
        const cyr = transliterate(word, 'isv-Cyrl', true);
        const lat2 = transliterate(cyr, 'isv-Latn');
        const cyr2 = transliterate(lat2, 'isv-Cyrl', true);

        if (lat.includes('lj') || lat.includes('nj')) {
          return cyr === cyr2
            ? acc
            : [...acc, `${word} (${lat}) -> ${cyr} vs. ${cyr2}`];
        }

        return acc;
      }, []);

    expect(exceptions).toMatchSnapshot();
  });
});
