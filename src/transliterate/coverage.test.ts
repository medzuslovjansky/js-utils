import transliterate from './index';
import extractWords from './__utils__/extractWords';

const SCRIPTS = [
  'art-Latn-x-interslv',
  'art-Cyrl-x-interslv',
  'art-Glag-x-interslv',
  'art-x-interslv-fonipa',
  'art-Latn-x-interslv-etym',
  'art-Cyrl-x-interslv-etym',
  'art-Glag-x-interslv-etym',
  'art-Cyrl-x-interslv-iotated',
  'art-Cyrl-x-interslv-iotated-ext',
  'art-Cyrl-x-interslv-northern',
  'art-Cyrl-x-interslv-sloviant',
  'art-Cyrl-x-interslv-southern',
  'art-Latn-PL-x-interslv',
  'art-Latn-x-interslv-ascii',
  'art-Latn-x-interslv-northern',
  'art-Latn-x-interslv-sloviant',
  'art-Latn-x-interslv-southern',
  'art-Glag-x-interslv-northern',
  'art-Glag-x-interslv-southern',
  'art-Glag-x-interslv-sloviant',
] as const;

/* eslint-disable prefer-rest-params,@typescript-eslint/ban-types */
describe('transliterate', () => {
  let hits: Record<string, number>;
  let original: typeof String.prototype.replace;
  let newHits = false;

  beforeAll(() => {
    hits = {};

    original = String.prototype.replace;
    String.prototype.replace = function replaceWrapper(
      this: string,
      searchValue: string | RegExp,
      replaceValue: string | Function,
    ) {
      const key = `${searchValue} -> ${replaceValue}`;
      // @ts-expect-error TS2345
      const result = original.apply(this, arguments);
      hits[key] = hits[key] || 0;
      if (result !== this) {
        hits[key]++;
        newHits = newHits || hits[key] === 1;
      }
      return result;
    } as any;
  });

  afterAll(() => {
    String.prototype.replace = original;
  });

  test('coverage', () => {
    for (const word of extractWords()) {
      newHits = false;

      for (const bcp47 of SCRIPTS) {
        const result = transliterate(word, bcp47);
        if (!newHits) {
          for (const script of SCRIPTS) {
            transliterate(result, script);
            if (newHits) {
              break;
            }
          }
        }
      }

      if (newHits) {
        for (const bcp47 of SCRIPTS) {
          expect(transliterate(word, bcp47)).toMatchSnapshot(
            `${word} (${bcp47})`,
          );
        }
      }
    }
  });
});
