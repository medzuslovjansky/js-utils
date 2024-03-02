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
      ['ona', 'onoj'],
      ['ono', 'onoj'],
      ['ota', 'otoj'],
      ['oto', 'otoj'],
      ['ova', 'ov'],
      ['ovo', 'ov'],
      ['tamta', 'tamtoj'],
      ['tamto', 'tamtoj'],
      ['tuta', 'tutoj'],
      ['tuto', 'tutoj'],
      ['ta', 'toj'],
      ['to', 'toj'],
      ['te', 'toj'],
      ['se', 'sej'],
      ['sa', 'sej'],
    ])('%s (pron.dem.) should decline as %s', (alternative, canonical) => {
      const actual = declensionPronounSimple(alternative, 'pron.dem.');
      const expected = declensionPronounSimple(canonical, 'pron.dem.');
      expect(actual).toEqual(expected);
    });
  });
});
