/**
 * Havlík's law and what follows from it: a word written with yers `ъ` `ь`
 * (`krъvь`, `dьržati`, `konь`) read as the etymological spelling (`krȯv`,
 * `dŕžati`, `konj`).
 *
 * Counting yers from the end of the word, the last is weak, the one before it
 * strong, and so on; a full vowel starts the count again. A strong yer is
 * vocalized (`ъ` is `ȯ`, `ь` is `ė`); a weak `ъ` is gone; a weak `ь` is gone
 * but leaves its softness on the consonant before it.
 *
 * Ported from `packages/reconstruct` (the `havlik` step and the steps after
 * `syllabic-ьr-hard` of the yer notation reader), where it is written as
 * `Step` objects; here it is the same rules as plain pairs, so that the
 * reader of yers in `translit` does not depend on `reconstruct`, which can
 * then use this one.
 *
 * A literal `ȯ` or `ė` is a mark, not a yer: it is a vowel and stays.
 */

// consonants, plus the ć đ that j and tj, dj turn into
const C = 'bcčdďfghklľmnňpřrsśštťvxzźžćđ';
// full vowels for the law: syllabic ŕ and the placeholder ṛ count as vowels
const VOWELS = 'aeiouyěęǫųåȯŕṛ';

/** Havlík's law over the yers of a word; a weak ь leaves a `'` for softness. */
function havlik(word: string): string {
  const chars = [...word];
  let nextIsWeak = false;

  for (let i = chars.length - 1; i >= 0; i--) {
    const c = chars[i];
    if (c === 'ъ' || c === 'ь') {
      chars[i] = nextIsWeak ? (c === 'ъ' ? 'ȯ' : 'ė') : c === 'ъ' ? '' : "'";
      nextIsWeak = !nextIsWeak;
    } else if (VOWELS.includes(c)) {
      nextIsWeak = false;
    }
  }

  return chars.join('');
}

const g = (source: string): RegExp => new RegExp(source, 'gu');
const u = (source: string): RegExp => new RegExp(source, 'u');

type Rule = readonly [RegExp, string];

// before the law: the vowels that no yer is needed for
const BEFORE: readonly Rule[] = [
  // the prefix vъz- is vocalized whatever the law says: vъzduhъ is vȯzduh
  [/^vъz/u, 'vȯz'],
  // syllabic liquids: ьr is ŕ (vьrhъ), ъr is r (kъrčьma), ьl and ъl are ȯl
  [g(`(?<=[čšžj])ьr(?=[${C}])`), 'ṛ'],
  [g(`ьr(?=[${C}])`), 'ŕ'],
  [g(`ъr(?=[${C}])`), 'ṛ'],
  [g(`[ъь]l(?=[${C}])`), 'ȯl'],
  // a yer after a liquid in an initial cluster is a vowel: grьměti, blъha
  [u(`^([${C}])rь(?=[${C}])`), '$1rė'],
  [g(`(?<=[${C}])lъ(?=[${C}])`), 'lȯ'],
];

// after the law: softness left by a weak ь, and the letters of the result
const AFTER: readonly Rule[] = [
  // a tense yer before j in a root without another vowel: čьjь is čij
  [u(`^([${C}]+)ėj`), '$1ij'],
  // softness already carried by the consonant before it is not written twice
  [g("(?<=[ľňřćđśźčšžcj])'"), ''],
  [g("l'"), 'ľ'],
  // n before n stays hard (konьnica), elsewhere soft
  [g("n'(?!n)"), 'ň'],
  // r is soft except before n, c, č, l: zvěrь is zvěŕ, but mirьnъ is mirny
  [g("r'(?![ncčl])"), 'ř'],
  [g("s'(?=j|$)"), 'ś'],
  [g("z'(?=j|$)"), 'ź'],
  [g("t'(?=j|$)"), 'ť'],
  [g("d'(?=j|$)"), 'ď'],
  [g("'"), ''],
  // soft sonorants before a vowel or at the end are lj, nj, rj; before a
  // consonant ľ ń ŕ
  [g('ľ(?=[aeiouyěęǫåų]|$)'), 'lj'],
  // ň before i is plain unless after a vowel: ňiva is niva, but siňь is sinji
  [g('(?<![aeiouyěęǫ])ň(?=i)'), 'n'],
  [g('ň(?=[aeiouyěęǫåų]|$)'), 'nj'],
  [g('ř(?=[aeiouyěęǫåų])'), 'rj'],
  [g('ň'), 'ń'],
  [g('ř'), 'ŕ'],
  [g('x'), 'h'],
  [g('ǫ'), 'ų'],
  [g('ṛ'), 'r'],
];

const apply = (word: string, rules: readonly Rule[]): string =>
  rules.reduce((w, [from, to]) => w.replace(from, to), word);

// a literal ė is a mark, not a law-made vowel: a dotted ȯ stands in for it so
// that the law counts it as a vowel and the rule for ėj leaves it alone
const MARK = 'ȯ̇';

/**
 * Reads a lowercase word written with the yers `ъ` `ь` as the etymological
 * spelling. A word without yers comes back as it was (`ǫ` and `x` aside).
 */
export function readHavlik(word: string): string {
  // a final consonant implies the weak ъ the notation leaves out: hrьbьt
  const full = /[^aeiouyěęųåȯėъь]$/u.test(word) ? `${word}ъ` : word;
  const marked = apply(full.replaceAll('ė', MARK), BEFORE);
  let read = havlik(marked);

  // a word with no vowel but a yer (vъ, sъ, kъ) is a word because the yer is
  // one: the last yer is strong
  if (
    /[ъь]/u.test(word) &&
    ![...read].some((c) => VOWELS.includes(c) || c === 'ė')
  ) {
    read = havlik(
      marked.replace(/[ъь](?=[^ъь]*$)/u, (yer) => (yer === 'ъ' ? 'ȯ' : MARK)),
    );
  }

  return apply(read, AFTER).replaceAll(MARK, 'ė');
}
