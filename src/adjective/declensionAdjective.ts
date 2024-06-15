/*
 * @link http://steen.free.fr/interslavic/adjectivator.html
 */

const SOFT_CONSONANTS = 'jcćčšž' + 'ŕĺľťśď';
const VOWELS = 'aeiouųåėęěȯy';
const CONSONANTS = 'bcdfghjklmnprstvzćčďľńŕśšťźžʒđ';
// const liquid = /[lrŕ]/;
// const nasal = /[nm]/;

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

  for (const key in result) {
    if (result[key] !== undefined) {
      const notFlat: any = Object.values(result[key]);
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
  comparison: SteenAdjectiveParadigm$Comparison;
  short: string[];
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

export function declensionAdjective(
  adj: string,
  postfix = '',
  partOfSpeech = 'adj.',
): SteenAdjectiveParadigm {
  if ([' na', ' od', ' za'].includes(adj.slice(-3))) {
    // FIXME: I think we can re-use the 'postfix' logic, originaly written for stuff like "kogo-libo" in declensionPronoun
    // but it doesn't work for `applyRules(['osnovany', 'osnovano', 'osnovana'], " na")` for some reason
    // postfix = adj.slice(-3);
    adj = adj.slice(0, -3);
  }

  const root = establish_root(adj);
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
  const short_adj = makeShortAdj(adj);

  // for debug:
  // if (short_adj != adj) {
  //  console.log(adj, "->", short_adj);
  // }

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
    comparison: deriveComparison(root, adj, postfix, partOfSpeech),
    short: applyRules([short_adj], postfix),
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

function getConsonantsEnding(word: string): string {
  if (!word.endsWith('y') && !word.endsWith('i')) {
    return word;
  }
  word = word.slice(0, -1);

  // copy ending while it is made of consonants
  let cons = '';
  for (let i = word.length - 1; i >= 0; i--) {
    if (CONSONANTS.includes(word[i])) {
      cons = word[i] + cons;
    } else {
      break;
    }
  }
  return cons;
}

function makeShortAdj(longAdj: string): string {
  const simplestForm = longAdj.slice(0, -1);

  if (['sinji', 'obći'].includes(longAdj)) {
    return simplestForm;
  }
  if (longAdj === 'dȯlgy') {
    return 'dȯlȯg';
  }
  // TODO: should these words have PoS like "pron.indef." instead of just "adj."?
  if (longAdj === 'iny' || longAdj === 'drugy' || longAdj === 'něktory') {
    return '-';
  }
  // short form is awkward for these
  if (longAdj.endsWith('ji')) {
    return longAdj;
  }
  // is it already in a short form?
  for (const ending of ['ov', 'ev', 'in', 'en', 'ėn', 'ȯk', 'ėk', 'rad']) {
    if (longAdj.endsWith(ending)) {
      return longAdj;
    }
  }
  // is it a comparative, relative or participle in a disguise?
  for (const ending of ['ši', 'ći', 'sky']) {
    if (longAdj.endsWith(ending)) {
      return longAdj;
    }
  }
  // should we add yers?
  const consEnding = getConsonantsEnding(longAdj);

  if (consEnding.length === 1) {
    return simplestForm;
  }
  if (longAdj.endsWith('ny')) {
    if (longAdj.slice(-3, -2) === 'l') {
      return longAdj.slice(0, -2) + 'ȯn'; // pȯlny -> pȯlȯn
    }
    if (longAdj.slice(-3, -2) === 'ĺ' || longAdj.slice(-3, -2) === 'ľ') {
      return longAdj.slice(0, -3) + 'lėn'; // siĺny -> silėn
    }
    return longAdj.slice(0, -2) + 'ėn';
  }
  if (longAdj.endsWith('zly') || longAdj.endsWith('mly')) {
    return longAdj.slice(0, -2) + 'ȯl';
  }

  // uncomment for Southern flavorization:
  // if (longAdj.endsWith("ry")) { return longAdj.slice(0, -2) + "ėr"; }
  // if (longAdj.endsWith("ly")) { return longAdj.slice(0, -2) + "ėl"; }

  // https://en.wiktionary.org/wiki/Reconstruction:Proto-Slavic/obьlъ
  // HR obao, BG объл, MK обол, SL obel; but RU обл
  if (longAdj.endsWith('bly')) {
    return longAdj.slice(0, -2) + 'ėl';
  }
  if (longAdj.endsWith('ky')) {
    if (SOFT_CONSONANTS.includes(longAdj.slice(-3, -2))) {
      return longAdj.slice(0, -2) + 'ėk';
    } else {
      return longAdj.slice(0, -2) + 'ȯk';
    }
  }

  // we can handle "věth/trězv/dobr", but not "rabotč/izkonavč"
  if (consEnding.length === 2 && !consEnding.includes('č')) {
    return simplestForm;
  }
  // I don't use native JS /regex/ syntax here because it has no string interpolation
  const syllabicRegex = new RegExp(`.*[${VOWELS}]st[ŕrl]?y$`); // ostr, bystr
  // const syllabicRegex2 = new RegExp(`.*[${VOWELS}][${CONSONANTS}][ŕrl][${CONSONANTS}]y$`);  // brzy

  // Is ending consonant cluster pronounceable? Does it have any syllabic RLs?
  const syllabicEndingSet = new Set([
    'tvŕd',
    'lst',
    'čŕstv',
    'črstv',
    'mŕtv',
    'brz',
  ]);
  if (syllabicRegex.test(longAdj) || syllabicEndingSet.has(consEnding)) {
    return simplestForm;
  }
  return '-';
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
    return item.replace(/$/, postfix).replace(/([^/]) /g, '$1' + postfix + ' ');
  });
}

function establish_root(adj: string) {
  let result = '';
  if (adj == 'naš' || adj == 'vaš') {
    result = adj + '|^';
  } else if (adj == 'rad') {
    result = adj + '|';
  } else if (adj.slice(-3) == 'čij') {
    result = adj + '|^';
  } else if (adj == 'sej' || adj == 'sjej') {
    result = adj.slice(0, -2) + '|^';
  } else if (adj == 'veś' || adj == 'ves') {
    result = 'vs|^';
  } else if (adj == 'onoj') {
    result = 'on|';
  } else if (adj == 'ovoj' || adj == 'ov') {
    result = 'ov|';
  } else if (adj == 'jedin') {
    result = 'jedn|';
  } else if (adj == 'nijedin') {
    result = 'nijedn|';
  } else if (adj.slice(-2) == 'ov') {
    result = adj + '|';
  } else if (adj.slice(-2) == 'ev') {
    result = adj + '|';
  } else if (adj.slice(-2) == 'in') {
    result = adj + '|';
  } else if (adj.slice(-3) == 'toj') {
    result = adj.slice(0, -2) + '|';
  } else if (adj.slice(-2) == 'oj') {
    result = adj + '|^';
  } else if (adj.slice(-2) == 'en') {
    result = adj.slice(0, -2) + 'n|';
  } else if (adj.slice(-2) == 'yj') {
    result = adj.slice(0, -2);
  } else if (adj.slice(-2) == 'ij') {
    result = adj.slice(0, -2) + '^';
  } else if (adj.slice(-1) == 'y') {
    result = adj.slice(0, -1);
  } else if (adj.slice(-1) == 'i') {
    result = adj.slice(0, -1) + '^';
  } else {
    result = '';
  }

  return result.replace('k^', 'k').replace('g^', 'g').replace('h^', 'h');
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
    !VOWELS.includes(root.charAt(lastchar - 1))
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
    !VOWELS.includes(root.charAt(lastchar - 1))
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
