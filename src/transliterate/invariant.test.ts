import { nmsify as nmsifyOld } from './transliterate';
import { nmsify as nmsifyNew } from './transliterate2';

describe('invariant test', () => {
  const LATIN_BLOCK = [
    [0x0020, 0x007f], // Basic Latin
    [0x0080, 0x00ff], // Latin-1 Supplement
    [0x0100, 0x017f], // Latin Extended-A
    [0x0180, 0x024f], // Latin Extended-B
  ];

  const CYRILLIC_BLOCK = [
    [0x0400, 0x04ff], // Cyrillic
    [0x0500, 0x052f], // Cyrillic Supplement
  ];

  // fast implementation
  function* generateMonoGrams(range: number[]) {
    for (const code of range) {
      yield String.fromCodePoint(code);
    }
  }

  // fast implementation
  function* generateBiGrams(range: number[]) {
    for (const code1 of range) {
      for (const code2 of range) {
        yield String.fromCodePoint(code1, code2);
      }
    }
  }

  function generateGrams(n: number, range: number[]) {
    switch (n) {
      case 1:
        return generateMonoGrams(range);
      case 2:
        return generateBiGrams(range);
      default:
        throw new Error('Unsupported n');
    }
  }

  function uniteRanges(ranges: number[][]): number[] {
    return ranges.reduce((acc, [start, end]) => {
      const length = end - start + 1;
      return [...acc, ...Array.from({ length }, (_, i) => start + i)];
    }, [] as number[]);
  }

  test.each`
    n    | block         | ranges
    ${1} | ${'Latin'}    | ${LATIN_BLOCK}
    ${1} | ${'Cyrillic'} | ${CYRILLIC_BLOCK}
    ${2} | ${'Latin'}    | ${LATIN_BLOCK}
    ${2} | ${'Cyrillic'} | ${CYRILLIC_BLOCK}
  `(
    'nmsifyOld and nmsifyNew should generate the same output for all $n-grams in $block block',
    ({ n, ranges }) => {
      const range = uniteRanges(ranges);
      for (const gram of generateGrams(n, range)) {
        const oldOutput = nmsifyOld(gram);
        const newOutput = nmsifyNew(gram);

        expect(`${gram} -> ${oldOutput}`).toEqual(`${gram} -> ${newOutput}`);
      }
    },
  );

  test.each`
    input
    ${'zsk'}
    ${'zst'}
    ${'%izs'}
    ${'%bezs'}
    ${'%razs'}
    ${'%råzs'}
    ${'konjug'}
    ${'konjun'}
    ${'injek'}
  `(
    'nmsifyOld and nmsifyNew should generate the same output for $input',
    ({ input }) => {
      const oldOutput = nmsifyOld(input);
      const newOutput = nmsifyNew(input);

      expect(oldOutput).toEqual(newOutput);
    },
  );
});
