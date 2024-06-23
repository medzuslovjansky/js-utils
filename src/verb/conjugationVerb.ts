/*
 * @source http://steen.free.fr/interslavic/conjugator.html
 */

import { compactArray } from '../utils';
import { parsePos, Verb } from '../partOfSpeech';
import { BIG_YUS, IOTATED_SMALL_YUS, SMALL_YUS } from '../substitutions';

const _SE = /. s[eę]$/;
const SE_ = /s[eę] $/;
const EVA_OVA = /[eo]va$/;
const NUU = /..n[uų]$/;
const OUEE = /^..?[eěou]$/;
const BDSZE = /[bdsz]ję$/;
const AEE = /[aeě]$/;
const MEUU = /[meuų-]$/;

const PREFIXES = [
  'prědpo',
  'razpro',
  'råzpro',
  'izpo',
  'odpo',
  'nad',
  'pod',
  'pre',
  'pri',
  'pro',
  'prě',
  'raz',
  'råz',
  'voz',
  'vȯz',
  'do',
  'iz',
  'na',
  'ne',
  'ob',
  'od',
  'po',
  'sȯ',
  'vo',
  'vy',
  'vȯ',
  'za',
  'o',
  's',
  'u',
  'v',
];

const NON_REGULAR_VERBS = /(v[eě]d[eě]ti|j[eě]sti|d[aų]ti|byti|žegti)$/;

const irregular_stems = { da: 1, je: 1, jě: 1, ja: 1, vě: 1 };

export function conjugationVerbFlat(
  inf: string,
  rawPts: string,
  partOfSpeech?: string,
): string[] {
  return getConjugationVerbFlat(conjugationVerb(inf, rawPts, partOfSpeech));
}

function getConjugationVerbFlat(result: SteenVerbParadigm | null): string[] {
  if (!result) {
    return [];
  }

  const forms = [
    ...compactArray(result.conditional).map((item) =>
      item.split(' ')[1].replace(/[()]/g, ''),
    ),
    result.gerund,
    ...result.imperative.replace(/ /g, '').split(','),
    ...result.imperfect,
    result.infinitive,
    ...compactArray([
      result.pfap,
      result.pfpp,
      result.prap,
      result.prpp,
    ]).flatMap((item) => item.replace(/[(),]/g, '').split(' ')),
    ...result.present.join(',').replace(/ /g, '').split(','),
  ]
    .filter(Boolean)
    .filter((item) => item.indexOf('-') === -1);
  return Array.from(new Set(forms));
}

/** @deprecated */
export type SteenVerbParadigm = {
  infinitive: string;
  present: [string, string, string, string, string, string, string?];
  imperfect: [string, string, string, string, string, string];
  perfect: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string?,
  ];
  pluperfect: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string?,
  ];
  future: [string, string, string, string, string, string];
  conditional: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string?,
  ];
  imperative: string;
  /**
   * Present active participle, derived from imperfective verbs.
   * @example 'dělajući'
   */
  prap?: string;
  /**
   * Present passive participle (uncommon)
   * @example 'dělajemy'
   */
  prpp?: string;
  /**
   * Past active participle, derived from perfective verbs.
   * @example 'sdělavši'
   */
  pfap?: string;
  /**
   * Past passive participle (bookish)
   * @example 'dělany'
   */
  pfpp?: string;
  gerund: string;
};

export function conjugationVerb(
  rawInf: string,
  rawPts: string,
  partOfSpeech = 'v.tr. ipf./pf.',
): SteenVerbParadigm | null {
  // eslint-disable-next-line prefer-const
  let [inf, refl] = splitReflexive(rawInf);

  // special cases
  if (inf.includes('/')) {
    return null;
  }
  if (inf === 'sųt' || inf === 'je' || inf === 'jest') {
    inf = 'byti';
  }
  const pref = prefix(inf);
  const pts = rawPts
    .replace(/\) \(/g, ')(')
    .replace(/[()]/g, '')
    .split(/[;,/]/)[0]
    .replace(/\+\d/, '');
  const is = infinitive_stem(pref, inf, pts);
  const ps = present_tense_stem(pref, pts, is);
  const psi = secondary_present_tense_stem(ps);
  const lpa = l_participle(pref, is);

  const infinitive = build_infinitive(
    pref,
    is,
    refl,
  ) as SteenVerbParadigm['infinitive'];
  const present = buildPresent(
    pref,
    ps,
    psi,
    refl,
  ) as SteenVerbParadigm['present'];
  const imperfect = build_imperfect(
    pref,
    is,
    refl,
  ) as SteenVerbParadigm['imperfect'];
  const perfect = buildPerfect(lpa, refl) as SteenVerbParadigm['perfect'];
  const pluperfect = buildPluralPerfect(
    lpa,
    refl,
  ) as SteenVerbParadigm['pluperfect'];
  const future = buildFuture(infinitive, ps) as SteenVerbParadigm['future'];
  const conditional = buildConditional(
    lpa,
    refl,
  ) as SteenVerbParadigm['conditional'];
  const imperative = build_imperative(
    pref,
    psi,
    refl,
  ) as SteenVerbParadigm['imperative'];

  const { imperfective, transitive } = parsePos(partOfSpeech) as Verb;
  const prap = imperfective ? build_prap(pref, ps, refl) : undefined;
  const prpp =
    imperfective && transitive ? build_prpp(pref, ps, psi) : undefined;
  const pfap = build_pfap(lpa, refl);
  const pfpp = transitive ? build_pfpp(pref, is, psi) : undefined;
  const gerund = build_gerund(pfpp ?? build_pfpp(pref, is, psi));

  return {
    infinitive,
    present,
    imperfect,
    perfect,
    pluperfect,
    future,
    conditional,
    imperative,
    prap,
    prpp,
    pfap,
    pfpp,
    gerund,
  };
}

function splitReflexive(inf: string) {
  const hasNE = inf.startsWith('ne ');
  const spaceIndex = inf.indexOf(' ', hasNE ? 3 : 0);
  const maybeSE =
    spaceIndex > 0 ? inf.slice(spaceIndex + 1, spaceIndex + 3) : '';
  const se = maybeSE === 'se' || maybeSE === 'sę' ? ' sę' : '';
  const verb = spaceIndex > 0 ? inf.slice(0, spaceIndex) : inf;
  return [verb, se];
}

function prefix(inf: string) {
  // get prefixes for some non-regular verbs
  const match = inf.match(NON_REGULAR_VERBS);
  if (match) {
    const maybePrefix = inf.slice(0, -match[1].length);
    if (PREFIXES.includes(maybePrefix)) {
      return maybePrefix;
    }
  }

  // get prefix separated with '-'
  const kreska = inf.indexOf('-');
  if (kreska != -1) {
    return inf.substring(0, kreska + 1);
  }

  // get prefix 'ne '
  if (inf.startsWith('ne ')) {
    return 'ne ';
  }

  /*	else if ((inf.substring (0, 4) == 'pred') || (inf.substring (0, 4) == 'prėd'))
        {	result = inf.substring (0, 4); 	}
    else if ((inf.substring (0, 3) == 'pre') || (inf.substring (0, 3) == 'prė'))
        {	result = inf.substring (0, 3); 	}
    else if ((inf.substring (0, 3) == 'pri') || (inf.substring (0, 3) == 'pro'))
        {	result = inf.substring (0, 3); 	}
    else if ((inf.substring (0, 3) == 'raz') || (inf.substring (0, 3) == 'råz'))
        {	result = inf.substring (0, 3); 	}
    else if ((inf.substring (0, 3) == 'pod') || (inf.substring (0, 3) == 'nad'))
        {	result = inf.substring (0, 3); 	}
    else if ((inf.substring (0, 2) == 'po') || (inf.substring (0, 2) == 'na'))
        {	result = inf.substring (0, 2); 	}
    else if ((inf.substring (0, 2) == 'do') || (inf.substring (0, 2) == 'za'))
        {	result = inf.substring (0, 2); 	}
    else if ((inf.substring (0, 2) == 'iz') || (inf.substring (0, 2) == 'od'))
        {	result = inf.substring (0, 2); 	}
    else if ((inf.substring (0, 2) == 'vy') || (inf.substring (0, 2) == 'ob'))
        {	result = inf.substring (0, 2); 	}
    */

  return '';
}

function infinitive_stem(pref: string, inf: string, pts: string) {
  let result = '';
  const trunc = inf.replace(pref, '');

  if (trunc.length == 0) {
    return 'ERROR-1';
  }

  if (trunc == '') {
    return 'ERROR-2';
  }

  const valid_endings = ['ti', 'tì', 't', 'ť'];
  for (const element of valid_endings) {
    const len = element.length;
    if (trunc.slice(-len) == element) {
      result = trunc.substring(0, trunc.length - len);
      break;
    }
  }

  if (result == '') {
    return 'ERROR-2';
  }

  if (result.slice(-1) === 's') {
    // *jesti
    if (result === 'jes') {
      result = 'jed';
    }
    // stem based on present tense stem
    else if (pts) {
      result = pts.slice(0, -1);
    }
    /*result = result.substring(0, result.length - 1) + 'd';
        if (result == 'ned') {
            result = 'nes';
        }
        else if (result.lastIndexOf('gned') == (result.length - 4)) {
            result = result.replace(/gned/, 'gnet');
        }
        else if (result.lastIndexOf('pled') == (result.length - 4)) {
            result = result.replace(/pled/, 'plet');
        }
        else if (result.lastIndexOf('strěd') == (result.length - 5)) {
            result = result.replace(/strěd/, 'strět');
        }
        else if (result.lastIndexOf('stred') == (result.length - 5)) {
            result = result.replace(/stred/, 'stret');
        }
        else if (result.lastIndexOf('tręd') == (result.length - 4)) {
            result = result.replace(/tręd/, 'tręs');
        }
        else if (result.lastIndexOf('tred') == (result.length - 4)) {
            result = result.replace(/tred/, 'tres');
        }
        else if (result.lastIndexOf('ned') == (result.length - 3)) {
            result = result.replace(/ned/, 'nes');
        }*/
  }
  return result;
}

function derive_present_tense_stem(infinitive_stem_string: string): string {
  // Note that sometimes a special character ĵ is inserted into the string
  // Naučny Medžuslovjanski uses...
  // ...ĵ in cases where most Slavic languages have contraction -aje- > -a-
  let result = infinitive_stem_string;

  if (result === 'vzę') {
    result = 'vȯzm';
  } else if (result === 'umě') {
    result = 'uměĵ';
  } else if (result === 'hova') {
    result = 'hovaĵ';
  } else if (EVA_OVA.test(result)) {
    result = result.slice(0, -3) + 'uj';
  } else if (NUU.test(result)) {
    result = result.slice(0, -1);
  } else if (OUEE.test(result)) {
    result = result + 'j';
  } else if (BDSZE.test(result)) {
    result = result.slice(0, -2) + 'ȯjm';
  } else if (result.endsWith(IOTATED_SMALL_YUS)) {
    result = result.slice(0, -1) + 'm';
  } else if (result.endsWith(SMALL_YUS)) {
    result = result.slice(0, -1) + 'n';
  } else if (result.endsWith(BIG_YUS)) {
    result = result.slice(0, -1) /*+ 'm'*/;
  } else if (result.endsWith('y')) {
    result = result + 'j';
  } else if (AEE.test(result)) {
    result = result + 'ĵ';
  }
  return result;
}

function present_tense_stem(pref: string, pts: string, is: string) {
  let result = is;

  if (pts.length == 0) {
    result = derive_present_tense_stem(is);
  } else {
    if (_SE.test(pts)) {
      pts = pts.slice(0, -3);
    } else if (SE_.test(pts)) {
      pts = pts.slice(3);
    }

    if (pref.length !== 0) {
      if (pts.indexOf(pref) !== -1) {
        pts = pts.slice(pref.length);
      } else {
        pts = pts.slice(pref.length - 1);
      }
    }

    if (MEUU.test(pts)) {
      result = pts.slice(0, -1);
    } else {
      result = pts;
    }
  }

  result = process_present_tense_stem_exceptions(pref, is, result);
  return result;
}

function process_present_tense_stem_exceptions(
  pref: string,
  is: string,
  result: string,
): string {
  if (
    (is == 'by' && pref == '') ||
    ((result == 'je' || result == 'j') && is == 'bi')
  ) {
    result = 'jes';
  }
  // see: irregular_stems
  else if (result == 'věděĵ') {
    result = 'vě';
  } else if (result == 'jed' || (result == 'j' && is == 'jed')) {
    result = 'je';
  } else if (result == 'jěd' || (result == 'j' && is == 'jěd')) {
    result = 'jě';
  } else if (result == 'jad' || (result == 'j' && is == 'jad')) {
    result = 'ja';
  } else if (result == 'daĵ') {
    result = 'da';
  } else if (result == 'žeg' || result == 'žž') {
    result = 'žg';
  } else if (result.endsWith('maj')) {
    result = result.slice(0, -1) + 'ĵ';
  }
  if (result == 'jěhaĵ' || (result == 'jě' && is == 'jěha')) {
    result = 'jěd';
  }
  if (result == 'jehaĵ' || (result == 'je' && is == 'jeha')) {
    result = 'jed';
  }
  if (result == 'jahaĵ' || (result == 'ja' && is == 'jaha')) {
    result = 'jad';
  }
  return result;
}

function secondary_present_tense_stem(ps: string): string {
  return ps.replace(/g$/, 'ž').replace(/k$/, 'č');
}

function l_participle(pref: string, is: string): string {
  let result = '';
  if (is == 'vojd' || is == 'vȯjd') {
    result = 'všėl';
  } else if (is == 'id' || is == 'jd') {
    result = pref + 'šėl';
  } else if (is.slice(-2) == 'id' || is.slice(-2) == 'jd') {
    result = pref + is.slice(0, -2) + 'šėl';
  } else {
    result = pref + is + 'l';
  }
  return result;
}

function build_infinitive(pref: string, is: string, refl: string): string {
  if (is.slice(-2) === 'st') {
    is = is.slice(0, -1);
  } else if (is.slice(-1) === 't' || is.match(/[^ij]d$/)) {
    is = is.slice(0, -1) + 's';
  }
  return transliterateBack(pref + is + 'tì' + refl);
}

function buildPresent(
  pref: string,
  ps: string,
  psi: string,
  refl: string,
): string[] {
  // see: irregular_stems
  switch (ps) {
    case 'jes':
      return ['jesm', 'jesi', 'jest (je)', 'jesmȯ', 'jeste', 'sųt'].map(
        transliterateBack,
      );
    case 'da':
      return ['dam', 'daš', 'da', 'damȯ', 'date', 'dadųt'].map((word) =>
        transliterateBack(`${pref}${word}${refl}`),
      );
    case 'vě':
      return ['věm', 'věš', 'vě', 'věmȯ', 'věte', 'vědųt'].map((word) =>
        transliterateBack(`${pref}${word}${refl}`),
      );
    case 'jě':
      return ['jěm', 'jěš', 'jě', 'jěmȯ', 'jěte', 'jědųt'].map((word) =>
        transliterateBack(`${pref}${word}${refl}`),
      );
    case 'je':
      return ['jem', 'ješ', 'je', 'jemȯ', 'jete', 'jedųt'].map((word) =>
        transliterateBack(`${pref}${word}${refl}`),
      );
    case 'ja':
      return ['jam', 'jaš', 'ja', 'jamȯ', 'jate', 'jadųt'].map((word) =>
        transliterateBack(`${pref}${word}${refl}`),
      );
  }

  switch (ps.slice(-1)) {
    case 'ĵ': {
      // Naučny Medžuslovjanski uses...
      // ...ĵ in cases where most Slavic languages have contraction -aje- > -a-
      const cut = ps.slice(0, -1);
      const pps = `${cut}j`;
      return [
        `${pref}${pps}ų${refl}, ${pref}${cut}m${refl}`,
        `${pref}${pps}eš${refl}, ${pref}${cut}š${refl}`,
        `${pref}${pps}e${refl}, ${pref}${cut}${refl}`,
        `${pref}${pps}emȯ${refl}, ${pref}${cut}mo${refl}`,
        `${pref}${pps}ete${refl}, ${pref}${cut}te${refl}`,
        `${pref}${pps}ųt${refl}`,
      ].map(transliterateBack);
    }
    case 'i': {
      const cut = ps.slice(0, -1);
      return [
        `${pref}${cut}xų${refl}, ${pref}${ps}m${refl}`,
        `${pref}${ps}š${refl}`,
        `${pref}${ps}${refl}`,
        `${pref}${ps}mȯ${refl}`,
        `${pref}${ps}te${refl}`,
        `${pref}${cut}ęt${refl}`,
      ].map(transliterateBack);
    }
    default:
      return [
        `${pref}${ps}ų${refl}, ${pref}${psi}em${refl}`,
        `${pref}${psi}eš${refl}`,
        `${pref}${psi}e${refl}`,
        `${pref}${psi}emȯ${refl}`,
        `${pref}${psi}ete${refl}`,
        `${pref}${ps}ųt${refl}`,
        '',
      ].map(transliterateBack);
  }
}

function build_imperfect(pref: string, is: string, refl: string): string[] {
  let impst = '';
  const i = is.length - 1;
  if (!is.charAt(i).match(/[aeiouyęųåěėȯ)]/)) {
    if (is.charAt(i) == 'k') {
      impst = is.substring(0, i) + 'če';
    } else if (is.slice(-3) === 'žeg') {
      impst = 'žže';
    } else if (is.charAt(i) == 'g') {
      impst = is.substring(0, i) + 'že';
    } else {
      impst = is + 'e';
    }
  } else if (is == 'by' && pref == '') {
    impst = 'bě';
  } else {
    impst = is;
  }

  return [
    `${pref}${impst}h${refl}`,
    `${pref}${impst}še${refl}`,
    `${pref}${impst}še${refl}`,
    `${pref}${impst}hmȯ${refl}`,
    `${pref}${impst}ste${refl}`,
    `${pref}${impst}hų${refl}`,
  ].map(transliterateBack);
}

function buildFuture(infinitive: string, ps: string): string[] {
  if (
    ((infinitive == 'biti' || infinitive == 'бити') &&
      (ps == 'j' || ps == 'je' || ps == 'jes')) ||
    infinitive == 'byti' ||
    infinitive == 'bytì' ||
    infinitive == 'быти'
  ) {
    infinitive = '';
  }
  const verb = transliterateBack(infinitive);
  return [
    `bųdų ${verb}`,
    `bųdeš ${verb}`,
    `bųde ${verb}`,
    `bųdemȯ ${verb}`,
    `bųdete ${verb}`,
    `bųdųt ${verb}`,
  ];
}

function buildPerfect(lpa: string, refl: string): string[] {
  const result = [
    `jesm ${lpa}(a)${refl}`,
    `jesi ${lpa}(a)${refl}`,
    `(je) ${lpa}${refl}`,
    `(je) ${lpa}a${refl}`,
    `(je) ${lpa}o${refl}`,
    `jesmȯ ${lpa}i${refl}`,
    `jeste ${lpa}i${refl}`,
    `(sųt) ${lpa}i${refl}`,
    '',
  ];

  return result.map((line) => {
    let res = line.includes('šėl') ? idti(line) : line;
    res = res.includes('žegl') ? zegti(res) : res;
    return transliterateBack(res);
  });
}

function buildPluralPerfect(lpa: string, refl: string): string[] {
  const result = [
    `běh ${lpa}(a)${refl}`,
    `běše ${lpa}(a)${refl}`,
    `běše ${lpa}${refl}`,
    `běše ${lpa}a${refl}`,
    `běše ${lpa}o${refl}`,
    `běhmo ${lpa}i${refl}`,
    `běste ${lpa}i${refl}`,
    `běhų ${lpa}i${refl}`,
    '',
  ];

  return result.map((line) => {
    let res = line.indexOf('šėl') !== -1 ? idti(line) : line;
    res = res.includes('žegl') ? zegti(res) : res;
    return transliterateBack(res);
  });
}

function buildConditional(lpa: string, refl: string): string[] {
  const result = [
    `byh ${lpa}(a)${refl}`,
    `bys ${lpa}(a)${refl}`,
    `by ${lpa}${refl}`,
    `by ${lpa}a${refl}`,
    `by ${lpa}o${refl}`,
    `byhmȯ ${lpa}i${refl}`,
    `byste ${lpa}i${refl}`,
    `by ${lpa}i${refl}`,
    '',
  ];

  return result.map((line) => {
    let res = line.indexOf('šėl') !== -1 ? idti(line) : line;
    res = res.includes('žegl') ? zegti(res) : res;
    return transliterateBack(res);
  });
}

function build_imperative(pref: string, ps: string, refl: string): string {
  let p2s = '';
  const i = ps.length - 1;
  const last = ps[i];
  const penultimate = ps[i - 1];

  if (ps == 'jes') {
    p2s = 'bųď';
  } else if (ps == 'da') {
    // this irregular stem is handled slightly differently
    p2s = pref + ps + 'j';
  } else if (ps in irregular_stems) {
    p2s = pref + ps + 'ď';
  } else if (
    (last == 'ĵ' || last == 'j') &&
    !(penultimate === 'l' || penultimate === 'n')
  ) {
    p2s = pref + ps;
  } else if (last == 'a' || last == 'e' || last == 'ě') {
    p2s = pref + ps + 'j';
  } else if (last == 'i') {
    p2s = pref + ps;
  } else {
    p2s = pref + ps + 'i';
  }

  let result = p2s + refl + ', ' + p2s + 'mȯ' + refl + ', ' + p2s + 'te' + refl;
  result = result.replace(/jij/g, 'j');
  result = result.replace(/ĵij/g, 'ĵ');
  result = transliterateBack(result);
  return result;
}

function build_prap(pref: string, ps: string, refl: string): string {
  // Present Participle Active (napr., izslědujuči)
  let cut = '';
  const i = ps.length - 1;

  if (ps == 'jes') {
    ps = pref + 'sų';
  } else if (ps in irregular_stems) {
    ps = pref + ps + 'dų';
  } else if (
    ps.charAt(i) == 'a' ||
    ps.charAt(i) == 'e' ||
    ps.charAt(i) == 'ě'
  ) {
    ps = pref + ps + 'jų';
  } else if (ps.charAt(i) == 'i') {
    cut = ps.substring(0, ps.length - 1);
    ps = pref + cut + 'ę';
  } else {
    ps = pref + ps + 'ų';
  }

  return transliterateBack(ps + 'ćí (' + ps + 'ćá, ' + ps + 'ćé)' + refl);
}

function build_prpp(pref: string, ps: string, psi: string) {
  // Present Participle Passive (napr., izslědujemy)
  let result = '';

  if (ps == 'jes') {
    result = '—';
  } else if (ps in irregular_stems) {
    ps = ps + 'do';
  }

  const i = ps.length - 1;
  let cut = '';
  if (ps.charAt(i) == 'ĵ') {
    cut = ps.substring(0, i);
    ps = cut + 'j';
    result = pref + ps + 'emý (—á, —œ)' + ', ' + pref + cut + 'mý (—á, —œ)';
  } else if (ps.charAt(i) == 'j') {
    result = pref + psi + 'emý (' + pref + psi + 'emá, ' + pref + psi + 'emœ)';
  } else if (
    ps.charAt(i) == 's' ||
    ps.charAt(i) == 'z' ||
    ps.charAt(i) == 't' ||
    ps.charAt(i) == 'd' ||
    ps.charAt(i) == 'l'
  ) {
    result = pref + ps + 'omý (' + pref + ps + 'omá, ' + pref + ps + 'omœ)';
  } else if (ps.charAt(i) == 'i' || ps.charAt(i) == 'o') {
    result = pref + ps + 'mý (' + pref + ps + 'má, ' + pref + ps + 'mœ)';
  } else if (result != '—') {
    result = pref + psi + 'emý (' + pref + psi + 'emá, ' + pref + psi + 'emœ)';
  }

  result = transliterateBack(result);
  return result;
}

function build_pfap(lpa: string, refl: string): string {
  // Past Participle Active (napr., izslědovavši)
  let result = '';
  if (lpa.slice(-2, -1).match(/[aeiouyęųåěėȯ)]/)) {
    result = lpa.substring(0, lpa.length - 1) + 'vši';
  } else {
    result = lpa.substring(0, lpa.length - 1) + 'ši';
  }
  if (result.indexOf('šėv') != -1) {
    result = idti(result);
  }
  result =
    result +
    ' (' +
    result.slice(0, -1) +
    'á, ' +
    result.slice(0, -1) +
    'é)' +
    refl;
  result = transliterateBack(result);
  return result;
}

function build_pfpp(pref: string, is: string, psi: string): string {
  // Past Participle Passive (napr., izslědovany)
  let ppps = '';
  const i = is.length - 1;
  /* old rule for -t
    if (((is.charAt(i) != 'j') && ((psi.charAt(psi.length - 1) == 'j') && (i < 4) && (is.charAt(0) != 'u')) || (is == 'by')) || (is.charAt(i) == 'ę')) {
        ppps = pref + is + 't';
    }*/
  if (
    (is.match(/[iyuě]$/) && psi.match(/[jvn]$/) && psi !== 'imaj') ||
    is.match(/[ęuųå]$/) ||
    is === 'by' ||
    (is.match(/lě$/) && psi.match(/lj$/))
  ) {
    ppps = pref + is + 't';
  }
  // end rule for -t
  /*else if (((is.charAt(i) == 'ų') || (is.charAt(i) == 'u')) && (is.charAt(i - 1) == 'n')) {
        ppps = pref + psi + 'en';
    }
    else if ((is.charAt(i) == 'ų') || (is.charAt(i) == 'u')) {
        ppps = pref + is + 't';
    }*/
  else if (is.charAt(i) == 'a' || is.charAt(i) == 'e' || is.charAt(i) == 'ě') {
    ppps = pref + is + 'n';
  } else if (is.charAt(i) == 'i') {
    ppps = pref + is + 'Xen';
    ppps = ppps.replace(/stiX/g, 'šćX');
    ppps = ppps.replace(/zdiX/g, 'žđX');
    ppps = ppps.replace(/siX/g, 'šX');
    ppps = ppps.replace(/ziX/g, 'žX');
    ppps = ppps.replace(/tiX/g, 'ćX');
    ppps = ppps.replace(/diX/g, 'đX');
    ppps = ppps.replace(/jiX/g, 'jX');
    ppps = ppps.replace(/šiX/g, 'šX');
    ppps = ppps.replace(/žiX/g, 'žX');
    ppps = ppps.replace(/čiX/g, 'čX');
    ppps = ppps.replace(/iX/g, 'jX');
    ppps = ppps.replace(/X/g, '');
  } else if (is.charAt(i) == 'k' || is.charAt(i) == 'g') {
    if (psi.slice(-1) === 'i') {
      ppps = pref + psi.slice(0, -1) + 'en';
    } else {
      ppps = pref + psi + 'en';
    }
  } else {
    ppps = pref + is + 'en';
  }

  return transliterateBack(ppps + 'ý (' + ppps + 'á, ' + ppps + 'ó)');
}

function build_gerund(pfpp: string): string {
  const ppps = pfpp.indexOf('(') - 2;
  return transliterateBack(pfpp.substring(0, ppps) + 'ıje' /*+ refl*/).replace(
    'ne ',
    'ne',
  );
}

function idti(sel: string): string {
  return sel
    .replace('šėl(a)', 'šėl/šla')
    .replace('šėl(a)', 'šėl/šla')
    .replace('všėl/šla', 'všėl/vȯšla')
    .replace('všėl/šla', 'všėl/vȯšla')
    .replace(/šėla/g, 'šla')
    .replace(/šėlo/g, 'šlo')
    .replace(/šėli/g, 'šli')
    .replace(/všl/g, 'vȯšl')
    .replace(/iz[oȯ]š/g, 'izš')
    .replace(/ob[oȯ]š/g, 'obš')
    .replace(/od[oȯ]š/g, 'odš')
    .replace(/pod[oȯ]š/g, 'podš')
    .replace(/nad[oȯ]š/g, 'nadš');
}

function zegti(zeg: string): string {
  return zeg
    .replace(/žegl\(a\)$/g, 'žegl/žgla')
    .replace(/žegla$/g, 'žgla')
    .replace(/žeglo$/g, 'žglo')
    .replace(/žegli$/g, 'žgli');
}

function transliterateBack(iW: string): string {
  return (
    iW
      .replace(/stx/, 'šć')
      .replace(/zdx/, 'žđ')
      .replace(/sx/, 'š')
      .replace(/šx/, 'š')
      .replace(/zx/, 'ž')
      .replace(/žx/, 'ž')
      .replace(/cx/, 'č')
      .replace(/čx/, 'č')
      .replace(/tx/, 'ć')
      .replace(/dx/, 'đ')
      .replace(/jx/, 'j')
      .replace(/x/, 'j')
      .replace(/-/g, '')
      .replace(/—/g, '-')
      //
      .replace(/lı/g, 'ľ')
      .replace(/nı/g, 'ń')
      .replace(/rı/g, 'ŕ')
      .replace(/tı/g, 'ť')
      .replace(/dı/g, 'ď')
      .replace(/sı/g, 'ś')
      .replace(/zı/g, 'ź')
      .replace(/ı/g, '')
  );
}
