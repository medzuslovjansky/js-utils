/*
 * @link http://steen.free.fr/interslavic/adjectivator.html
 */

import { ALL_CONSONANTS, VOWELS } from '../substitutions';

export function declensionAdjectiveFlat(
  adj: string,
  postfix: string,
  partOfSpeech?: string,
): string[] {
  return getDeclensionAdjectiveFlat(
    declensionAdjective(adj, postfix, partOfSpeech),
  );
}

function getDeclensionAdjectiveFlat(result: any): string[] {
  const forms = [];

  for (const key of Object.keys(result)) {
    const value = result[key];
    if (typeof value === 'string') {
      forms.push(value);
    } else if (value !== undefined) {
      const notFlat: any = Object.values(value);
      const flatArr = notFlat
        .flat()
        .map((word: string) => word.replace(/ /g, '').split('/'))
        .flat();
      forms.push(...flatArr);
    }
  }

  return Array.from(new Set(forms.filter(Boolean)));
}

/** @deprecated */
export type SteenAdjectiveParadigm = {
  singular: SteenAdjectiveParadigm$Case;
  plural: SteenAdjectiveParadigm$Case;
  short: string | undefined;
  comparison: SteenAdjectiveParadigm$Comparison;
};

type SteenAdjectiveParadigm$Case = {
  nom: string[];
  acc: string[];
  gen: string[];
  loc: string[];
  dat: string[];
  ins: string[];
};

type SteenAdjectiveParadigm$Comparison = {
  positive: string[];
  comparative: string[];
  superlative: string[];
};

const LOOKS_LIKE_ADJECTIVE = /[yij]$/;

function looksLikeAdjective(word: string) {
  return LOOKS_LIKE_ADJECTIVE.test(word);
}

export function declensionAdjective(
  adj: string,
  postfix = '',
  partOfSpeech = 'adj.',
): SteenAdjectiveParadigm {
  const isCompound = adj.includes(' ');
  if (isCompound) {
    const words = adj.split(' ');
    const index = words.findIndex(looksLikeAdjective);
    if (0 <= index && index < words.length - 1) {
      postfix = ' ' + words.slice(index + 1).join(' ') + postfix;
      adj = words.slice(0, index + 1).join(' ');
    }
  }

  const root = establish_root(adj);
  const short = short_form(adj, root, partOfSpeech);
  const m_nom_sg = m_nominative_sg(adj, root);
  const m_acc_sg = m_accusative_sg(adj, root);
  const f_nom_sg = f_nominative_sg(root);
  const n_nom_sg = n_nominative_sg(root);
  const mn_gen_sg = mn_genitive_sg(root);
  const mn_dat_sg = mn_dative_sg(root);
  const mn_ins_sg = mn_instrumental_sg(root);
  const mn_loc_sg = mn_locative_sg(root);
  const f_acc_sg = f_accusative_sg(root);
  const f_gdl_sg = f_gendatloc_sg(root);
  const f_ins_sg = f_instrumental_sg(root);

  const m_nom_pl = m_nominative_pl(root);
  const m_acc_pl = m_accusative_pl(root);
  const fn_nom_pl = fn_nominative_pl(root);
  const glo_pl = genloc_pl(root);
  const dat_pl = dative_pl(root);
  const ins_pl = instrumental_pl(root);

  return {
    singular: {
      nom: applyRules([m_nom_sg, n_nom_sg, f_nom_sg], postfix),
      acc: applyRules([m_acc_sg, n_nom_sg, f_acc_sg], postfix),
      gen: applyRules([mn_gen_sg, f_gdl_sg], postfix),
      loc: applyRules([mn_loc_sg, f_gdl_sg], postfix),
      dat: applyRules([mn_dat_sg, f_gdl_sg], postfix),
      ins: applyRules([mn_ins_sg, f_ins_sg], postfix),
    },
    plural: {
      nom: applyRules([m_nom_pl, fn_nom_pl], postfix),
      acc: applyRules([m_acc_pl, fn_nom_pl], postfix),
      gen: applyRules([glo_pl], postfix),
      loc: applyRules([glo_pl], postfix),
      dat: applyRules([dat_pl], postfix),
      ins: applyRules([ins_pl], postfix),
    },
    short,
    comparison: isCompound
      ? { positive: [], comparative: [], superlative: [] }
      : deriveComparison(root, adj, postfix, partOfSpeech),
  };
}

function deriveComparison(
  root: string,
  adj: string,
  postfix: string,
  partOfSpeech: string,
): SteenAdjectiveParadigm['comparison'] {
  const { isPositive, isComparative, isSuperlative } =
    parseComparisionModifiers(partOfSpeech);

  const adv = adverb(root);
  const m_nom_sg = m_nominative_sg(adj, root);
  const comp_adj = isComparative ? m_nom_sg : comparative_adj(root);
  const comp_adv = isComparative ? adv : comparative_adv(root);
  const sup_adj = isSuperlative ? m_nom_sg : superlative(root, comp_adj, 'adj');
  const sup_adv = isSuperlative ? adv : superlative(root, comp_adv, 'adv');

  return {
    positive: isPositive ? applyRules([m_nom_sg, adv], postfix) : [],
    comparative: isSuperlative ? [] : applyRules([comp_adj, comp_adv], postfix),
    superlative: applyRules([sup_adj, sup_adv], postfix),
  };
}

function parseComparisionModifiers(partOfSpeech: string) {
  const isComparative = partOfSpeech.endsWith('comp.');
  const isSuperlative = partOfSpeech.endsWith('sup.');

  return {
    isPositive: !isComparative && !isSuperlative,
    isComparative,
    isSuperlative,
  };
}

function applyRules(arr: string[], postfix: string) {
  return arr.map(rules).map((item) => {
    return item.replace(/$/, postfix).replace(/( *\/ *)/g, postfix + '$1');
  });
}

const ROOT_ESTABLISHER_RULES: [RegExp, string][] = [
  [/^(?:s[eė]j|sjej)$/, 's|^'],
  [/^v[eė][sś]$/, 'vs|^'],
  [/^(o[vn])(?:oj)?$/, '$1|'],
  [/^(.*)jedin$/, '$1jedn|'],
  [/^(.*)[ėȯ]j$/, '$1|'],
  [/^(.*)[ėȯ](.|[ln]j)$/, '$1$2|'],
  [/^(.*)en$/, '$1n|'],
  [/^.*(?:rad|in|[oe]v)$/, '$&|'],
  [/^(.*t)[oȯ]j$/, '$1|'],
  [/^(?:naš|vaš|.*čij|.*oj)$/, '$&|^'],
  [/^(.*)(?:ij?)$/, '$1^'],
  [/^(.*)(?:yj?)$/, '$1'],
];

const KGH_CARET = /[kgh]\^/g;

function establish_root(adj: string) {
  for (const [pattern, replacement] of ROOT_ESTABLISHER_RULES) {
    if (pattern.test(adj)) {
      const result = adj.replace(pattern, replacement);
      return result.replace(KGH_CARET, (match) => match[0]);
    }
  }

  return '';
}

// TODO: should these words have PoS like "pron.indef." instead of just "adj."?
const NO_SHORT_FORM = /(^in|ktor|seksi|sk|[čj]\^|\|)$/;
const NJI_ENDING = /[^aåeęěijrŕouųy]nj\^$/;

const SIMPLEST_FORM_EXCEPTIONS = /(sinj)$/;
const SHORT_O_ENDING = /(z[gk]|[mz]l|[^jcćčšžŕĺľťśď]k)$/;
const SHORT_E_ENDING = /(bl|[^l][kn])$/;
const MAYBE_COMPARATIVE = /[ćš]\^$/;
const TWO_LETTER_ENDING = /^.[^č]$/; // "věth/trězv/dobr", but not "rabotč/izkonavč"
const SYLLABIC_ENDING_REGEX = new RegExp(
  `([${VOWELS}]st[ŕrl]|tv[rŕ]d|lst|č[rŕ]stv|m[rŕ]tv|brz)$`,
); // ostr, bystr, črstv, tvrd, mrtv, brz
const CONSONANTS_ENDING = new RegExp(`[j${ALL_CONSONANTS}]*$`);

function short_form(
  adj: string,
  root: string,
  partOfSpeech: string,
): string | undefined {
  if (!adj.endsWith('y') && !adj.endsWith('i')) {
    return;
  }

  const simplestForm = adj.slice(0, -1);
  if (SIMPLEST_FORM_EXCEPTIONS.test(root)) {
    return simplestForm; // simplestForm;
  }

  if (NJI_ENDING.test(root)) {
    root = root.slice(0, -2);
  }

  if (NO_SHORT_FORM.test(root)) {
    return;
  }

  if (MAYBE_COMPARATIVE.test(root)) {
    const modifiers = parseComparisionModifiers(partOfSpeech);
    return modifiers.isComparative || modifiers.isSuperlative
      ? undefined
      : simplestForm;
  }

  if (root.endsWith('^')) {
    return simplestForm;
  }

  // should we add yers?
  const [consEnding] = root.match(CONSONANTS_ENDING)!;
  if (consEnding.length === 1) {
    return root;
  }

  if (SHORT_O_ENDING.test(root)) {
    return root.slice(0, -1) + 'ȯ' + root.slice(-1); // zl -> zȯl
  }
  if (SHORT_E_ENDING.test(root)) {
    return root.slice(0, -1) + 'ė' + root.slice(-1); // mekky -> mekek
  }
  if (TWO_LETTER_ENDING.test(consEnding) || SYLLABIC_ENDING_REGEX.test(root)) {
    return root;
  }

  return;
}

function m_nominative_sg(adj: string, root: string) {
  if (root.indexOf('|') !== -1) {
    return adj;
  } else {
    return root + 'y';
  }
}

function f_nominative_sg(root: string) {
  return root + 'a';
}

function n_nominative_sg(root: string) {
  return root + 'o';
}

function mn_genitive_sg(root: string) {
  return root + 'ogo';
}

function mn_dative_sg(root: string) {
  return root + 'omu';
}

function m_accusative_sg(adj: string, root: string) {
  return root + 'ogo / ' + adj;
}

function mn_instrumental_sg(root: string) {
  return root + 'ym';
}

function mn_locative_sg(root: string) {
  return root + 'om';
}

function f_accusative_sg(root: string) {
  return root + 'ų';
}

function f_gendatloc_sg(root: string) {
  return root + 'oj';
}

function f_instrumental_sg(root: string) {
  return root + 'ojų';
}

function m_nominative_pl(root: string) {
  return root + 'i / ' + root + 'e';
}

function m_accusative_pl(root: string) {
  return root + 'yh / ' + root + 'e';
}

function fn_nominative_pl(root: string) {
  return root + 'e';
}

function genloc_pl(root: string) {
  return root + 'yh';
}

function dative_pl(root: string) {
  return root + 'ym';
}

function instrumental_pl(root: string) {
  return root + 'ymi';
}

function adverb(root: string) {
  if (root.charAt(root.length - 2) == 'ć') {
    return root + 'i';
  } else {
    return root + 'o';
  }
}

function comparative_adj(root: string) {
  let result = '';
  const hacek = root.indexOf('^');
  const lastchar = hacek !== -1 ? root.length - 2 : root.length - 1;
  const vowel = /[aåeěęėioȯuųy]/;
  // const liquid = /[lrŕ]/;
  // const nasal = /[nm]/;

  if (root == 'velik') {
    result = 'vęčši';
  } else if (root == 'mal') {
    result = 'menši';
  } else if (root == 'dobr') {
    result = 'lěpši, lučši';
  } else if (root == 'zl') {
    result = 'gorši';
  } else if (root == 'mnog') {
    result = 'boľši';
  } else if (root == 'blåg' || root == 'blag') {
    result = 'unši, ' + root.substring(0, root.length - 1) + 'žejši';
  } else if (root.lastIndexOf('sk') == root.length - 2) {
    result = 'bolje ' + root + 'i';
  } else if (
    root.lastIndexOf('ok') == root.length - 2 ||
    root.lastIndexOf('ek') == root.length - 2
  ) {
    result = root.substring(0, root.length - 2) + 'ši';
  } else if (
    root.lastIndexOf('k') == root.length - 1 &&
    vowel.test(root.charAt(lastchar - 1)) == false
  ) {
    result = root.substring(0, root.length - 1) + 'ši';
  } else {
    if (hacek == -1) {
      result = root + '%ějši';
    } else {
      result = root + '%ejši';
    }
  }
  result = result
    .replace(/k%/, 'č')
    .replace(/g%/, 'ž')
    .replace(/h%/, 'š')
    .replace(/lši/, 'ľši')
    .replace(/gši/, 'žši')
    .replace(/ležši/, 'legši')
    .replace(/%/, '');

  return result;
}

function comparative_adv(root: string) {
  let result = '';
  const hacek = root.indexOf('^');
  const lastchar = hacek !== -1 ? root.length - 2 : root.length - 1;
  const vowel = /[aåeěęėioȯuųy]/;
  // const liquid = /[lrŕ]/;

  if (root == 'velik') {
    result = 'vęče';
  } else if (root == 'mal') {
    result = 'menje';
  } else if (root == 'dobr') {
    result = 'lěpje, lučše';
  } else if (root == 'zl') {
    result = 'gorje';
  } else if (root == 'mnog') {
    result = 'bolje';
  } else if (root == 'blåg' || root == 'blag') {
    result = 'unje, ' + root.substring(0, root.length - 1) + 'žeje';
  } else if (root.lastIndexOf('sk') == root.length - 2) {
    result = 'bolje ' + root + 'o';
  } else if (
    root.lastIndexOf('ok') == root.length - 2 ||
    root.lastIndexOf('ek') == root.length - 2
  ) {
    result = root.substring(0, root.length - 2) + '%je';
  } else if (
    root.lastIndexOf('k') == root.length - 1 &&
    vowel.test(root.charAt(lastchar - 1)) == false
  ) {
    result = root.substring(0, root.length - 1) + '%je';
  } else if (root.indexOf('^') != -1) {
    result = root + 'eje';
  } else {
    result = root + '%ěje';
  }
  result = result
    .replace(/k%ě/, 'če')
    .replace(/g%ě/, 'že')
    .replace(/h%ě/, 'še')
    .replace(/k%j/, 'kš')
    .replace(/g%j/, 'gš')
    .replace(/st%j/, 'šč')
    .replace(/s%j/, 'š')
    .replace(/z%j/, 'ž')
    .replace(/t%j/, 'č')
    .replace(/d%j/, 'dž')
    .replace(/%/, '');

  return result;
}

function superlative(root: string, comp: unknown, srt: string) {
  if (root === 'dobr' && srt === 'adj') {
    return 'najlěpši, najlučši';
  }
  if (root === 'dobr' && srt === 'adv') {
    return 'najlěpje, najlučše';
  }
  if (root === 'blåg' && srt === 'adj') {
    return 'najunši, najblåžejši';
  }
  if (root === 'blag' && srt === 'adj') {
    return 'najunši, najblažejši';
  }
  if (root === 'blåg' && srt === 'adv') {
    return 'najunje, najblåžeje';
  }
  if (root === 'blag' && srt === 'adv') {
    return 'najunje, najblažeje';
  }

  return 'naj' + comp;
}

function rules(word: string): string {
  return (
    word
      .replace(/\^o/g, '^e')
      .replace(/\^y/g, '^i')
      .replace(/s\|\^e/g, 'se')
      .replace(/s\|\^i/g, 'si')
      .replace(/\|/g, '')
      /*.replace('č^', 'č')
        .replace('š^', 'š')
        .replace('ž^', 'ž')
        .replace('ć^', 'ć')
        .replace('c^', 'c')*/
      .replace(/l\^/g, 'lj')
      .replace(/n\^/g, 'ń')
      .replace(/r\^/g, 'ŕ')
      .replace(/j\^/g, 'j')
      .replace(/t\^/g, 'ť')
      .replace(/d\^/g, 'ď')
      .replace(/s\^/g, 'ś')
      .replace(/z\^/g, 'ź')
      .replace(/\^/g, '')
      .replace(/jy/g, 'ji')
      .replace(/cy/g, 'ci')
  );
}
