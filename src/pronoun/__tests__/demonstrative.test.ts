import { declensionPronoun } from '../declensionPronoun';
import { pronouns_demonstrative } from '../../__utils__/fixtures';
import { declensionPronounSimple } from '../declensionPronounSimple';

describe('pronoun', () => {
  describe('demonstrative', () => {
    test.each(pronouns_demonstrative())('%s', (_id, _morphology, lemma) => {
      const actual = declensionPronoun(lemma, 'demonstrative');
      expect(actual).toMatchSnapshot();
    });

    test.each([
      ['ona', 'onȯj'],
      ['ono', 'onȯj'],
      ['ota', 'otȯj'],
      ['oto', 'otȯj'],
      ['ova', 'ov'],
      ['ovo', 'ov'],
      ['tamta', 'tamtȯj'],
      ['tamto', 'tamtȯj'],
      ['tuta', 'tutȯj'],
      ['tuto', 'tutȯj'],
      ['ta', 'tȯj'],
      ['to', 'tȯj'],
      ['te', 'tȯj'],
      ['se', 'sėj'],
      ['sa', 'sėj'],
    ])('%s (pron.dem.) should decline as %s', (alternative, canonical) => {
      const actual = declensionPronounSimple(alternative, 'pron.dem.');
      const expected = declensionPronounSimple(canonical, 'pron.dem.');
      expect(actual).toEqual(expected);
    });
  });
});
