import { conllufy } from '../conllufy';
import { formatTokensAsConllu } from '../formatConllu';

describe('conllufy - pronouns (demonstrative)', () => {
  test.each([
    [2893, 'pron.dem.', 'tȯj', '(ta, to)'],
    [20212, 'pron.dem.', 'tȯjže', '(taže, tože)'],
    [19600, 'pron.dem.', 'onoj', '(ona, ono)'],
    [10387, 'pron.dem.', 'ov', '(ova, ovo)'],
    [1347, 'pron.dem.', 'sėj', '(śa, se)'],
    [2263, 'pron.dem.', 'tamtȯj', '(tamta, tamto)'],
    [1534, 'pron.dem.', 'tutȯj', '(tuta, tuto)'],
  ])('%s', (id, xpos, word, irregular) => {
    const forms = conllufy(word, xpos, { id, irregular });
    const conlluString = formatTokensAsConllu(forms);
    expect(conlluString).toMatchSnapshot();
  });

  test('aliases produce same output as lemma', () => {
    const xpos = 'pron.dem.';
    const id = 0;

    // tȯj (ta, to)
    expect(conllufy('ta', xpos, { id })).toEqual(conllufy('tȯj', xpos, { id }));
    expect(conllufy('to', xpos, { id })).toEqual(conllufy('tȯj', xpos, { id }));

    // ov (ova, ovo)
    expect(conllufy('ova', xpos, { id })).toEqual(conllufy('ov', xpos, { id }));
    expect(conllufy('ovo', xpos, { id })).toEqual(conllufy('ov', xpos, { id }));

    // onoj (ona, ono)
    // 'ona'/'ono' here are Demonstrative (DET), so they shouldn't resolve to Personal (PRON) 'ona'/'ono'
    expect(conllufy('ona', xpos, { id })).toEqual(
      conllufy('onoj', xpos, { id }),
    );
    expect(conllufy('ono', xpos, { id })).toEqual(
      conllufy('onoj', xpos, { id }),
    );

    // sėj (śa, se)
    expect(conllufy('śa', xpos, { id })).toEqual(conllufy('sėj', xpos, { id }));
    expect(conllufy('se', xpos, { id })).toEqual(conllufy('sėj', xpos, { id }));

    // tamtȯj (tamta, tamto)
    expect(conllufy('tamta', xpos, { id })).toEqual(
      conllufy('tamtȯj', xpos, { id }),
    );
    expect(conllufy('tamto', xpos, { id })).toEqual(
      conllufy('tamtȯj', xpos, { id }),
    );

    // tutȯj (tuta, tuto)
    expect(conllufy('tuta', xpos, { id })).toEqual(
      conllufy('tutȯj', xpos, { id }),
    );
    expect(conllufy('tuto', xpos, { id })).toEqual(
      conllufy('tutȯj', xpos, { id }),
    );
  });
});
