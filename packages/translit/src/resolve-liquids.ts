/**
 * Where a liquid is syllabic, and a few spelling markers.
 *
 * The one phase that is not a table. `r` and `ŕ` are syllabic between
 * consonants and not otherwise, and the spelling only says so indirectly, so
 * this reads positions rather than substrings: the first `ř` and the first `r`
 * in the word, and what stands either side of them. Resolving it up front lets
 * every later phase read `ŕ`, `ř` and `ṙ` as three separate letters.
 *
 * The rest is housekeeping the tables downstream rely on: `x` becomes `ks`, a
 * soft consonant before `j` gets the `ı` marker, and a `j` that is not a
 * softener gets the `#` delimiter in front of it. Moved here unchanged from the
 * original engine.
 */

const VOWEL = /[aeiouyąęųåėȯèòěê]/;

export function resolveLiquids(__iW: string): string {
  let iW = __iW;
  // 'ŕ' remains between two consonants, in other cases is replaced by 'ř'
  iW = iW.replace(/ŕ/g, 'ř');
  const aPos = iW.indexOf('ř');
  if (
    aPos > 1 &&
    iW.charAt(aPos - 1) != '%' &&
    VOWEL.test(iW.charAt(aPos - 1)) == false &&
    VOWEL.test(iW.charAt(aPos + 1)) == false
  ) {
    iW = iW.substring(0, aPos) + 'ŕ' + iW.substring(aPos + 1, iW.length);
  }

  // 'r' is replaced by 'ŕ' or 'ṙ' between two consonants except 'j': 'ŕ' after [šžčc], 'ṙ' in other cases
  iW = iW.replace(/rj/g, 'Rj');
  iW = iW.replace(/jr/g, 'jR');
  const rPos = iW.indexOf('r');
  if (
    rPos > 1 &&
    iW.charAt(rPos - 1) != '%' &&
    VOWEL.test(iW.charAt(rPos - 1)) == false &&
    VOWEL.test(iW.charAt(rPos + 1)) == false
  ) {
    iW = iW.substring(0, rPos) + 'ṙ' + iW.substring(rPos + 1, iW.length);
    // iW = iW.replace (/’ṙ/, "ṙ");
    // iW = iW.replace (/jṙ/, "ŕ");
    iW = iW.replace(/([šžčc])ṙ/g, '$1ŕ');
  }
  iW = iW.replace(/R/g, 'r');
  // 'x' is replaced by 'ks'
  iW = iW.replace(/x/g, 'ks');
  // inserting auxiliary symbol 'ı' after soft consonants
  iW = iW.replace(/([ńľřťďśź])j/g, '$1ıj');
  // interting delimiter # in some cases
  iW = iW.replace(/([dsz])j/g, '$1#j');
  iW = iW.replace(/%obj/g, 'ob#j');
  iW = iW.replace(/%neobj/g, 'neob#j');
  iW = iW.replace(/%vj/g, 'v#j');

  return iW;
}
