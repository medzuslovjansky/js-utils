/*
 * @source http://steen.free.fr/interslavic/conjugator.html
 */

import type { AdapterResult, TokenFeatures, XPOS } from '@interslavic/conllu';
import { parseXPos } from '../../steen/index.ts';
import { parsePos, type Verb } from '../../partOfSpeech/index.ts';
import {
  BIG_YUS,
  IOTATED_SMALL_YUS,
  SMALL_YUS,
} from '@interslavic/translit/phonology';

// The reflexive particle can sit on either side of a present-tense hint, and
// either way it is the infinitive that carries it. `SE_` used to be anchored at
// the end while the body strips its three characters off the front, so it could
// only ever fire on a hint that had a trailing space, and then it ate the head.
const _SE = /. s[eę]$/;
const SE_ = /^s[eę] /;
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

/**
 * One person of the present tense, with what its readings differ in already
 * named. Everything else in a verb's paradigm is still a display string; those
 * cells have no alternatives to tell apart.
 */
export type VerbCell = Array<{ form: string; feats?: TokenFeatures }>;

/**
 * A tense the tables print as a phrase: the six persons, then the feminine and
 * neuter repeats, and for a reflexive verb the tail that carries `sę`.
 */
type Compound = [
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

export type VerbParadigm = {
  infinitive: VerbCell;
  present: VerbCell[];
  imperfect: VerbCell[];
  imperative: VerbCell[];
  /**
   * The `-l` participle on its own, which the compound past, the pluperfect
   * and the conditional all build on. The tables only ever print it inside those
   * phrases — `(je) dělal`, `byh dělal(a)` — so a consumer that wants the
   * participle had to cut it back out of the sentence.
   */
  lparticiple: VerbCell;
  perfect: Compound;
  pluperfect: Compound;
  conditional: Compound;
  future: [string, string, string, string, string, string];
  /** Present active participle, derived from imperfective verbs. */
  prap: Participle | undefined;
  /** Present passive participle (uncommon). */
  prpp: Participle | undefined;
  /** Past active participle, derived from perfective verbs. */
  pfap: Participle | undefined;
  /** Past passive participle (bookish). */
  pfpp: Participle | undefined;
  gerund: string;
};

export function conjugateVerb(
  rawInf: string,
  rawPts: string,
  partOfSpeech = 'v.tr. ipf./pf.',
): VerbParadigm | null {
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
    .replace(/\+\d/, '')
    // a government marker inside the same brackets, `(boji sę +2)`, leaves the
    // space it was written with behind
    .trim();
  const is = infinitive_stem(pref, inf, pts);
  const ps = present_tense_stem(pref, pts, is);
  const psi = secondary_present_tense_stem(ps);
  const lpa = l_participle(pref, is);

  const infinitive = build_infinitive(pref, is, refl);
  const present = buildPresentCells(pref, ps, psi, refl);
  const imperfect = build_imperfect(pref, is, refl);
  const perfect = buildPerfect(lpa, refl) as Compound;
  const lparticiple = buildLParticiple(lpa);
  const pluperfect = buildPluralPerfect(lpa, refl) as Compound;
  const future = buildFuture(infinitive[0].form) as VerbParadigm['future'];
  const conditional = buildConditional(lpa, refl) as Compound;
  const imperative = build_imperative(pref, psi, refl);

  const { imperfective, transitive } = parsePos(partOfSpeech) as Verb;
  const prap = imperfective ? build_prap(pref, ps, refl) : undefined;
  const prpp =
    imperfective && transitive ? build_prpp(pref, ps, psi) : undefined;
  const pfap = build_pfap(lpa, refl);
  const passiveStem = pfppStem(pref, is, psi);
  const pfpp = transitive ? build_pfpp(passiveStem) : undefined;
  const gerund = build_gerund(passiveStem);

  return {
    infinitive,
    present,
    lparticiple,
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

  return '';
}

function infinitive_stem(pref: string, inf: string, pts: string) {
  let result = '';
  const trunc = inf.replace(pref, '');

  if (trunc.length == 0) {
    return 'ERROR-1';
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
    result = result.slice(0, -1); /*+ 'm'*/
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

function build_infinitive(pref: string, is: string, refl: string): VerbCell {
  if (is.slice(-2) === 'st') {
    is = is.slice(0, -1);
  } else if (is.slice(-1) === 't' || is.match(/[^ij]d$/)) {
    is = is.slice(0, -1) + 's';
  }
  return [{ form: transliterateBack(pref + is + 'tì' + refl) }];
}

/**
 * The present tense, one cell per person, each already saying what its two
 * readings differ in.
 *
 * Two alternations live here and they are unrelated. The `-m` of the first
 * person singular is the ending of `jesm`, `dam`, `jem` and `věm`, and every
 * verb offers it beside the thematic `-ų`; that is `Variant=Athematic`, and it
 * touches one cell. Contraction is the other: the ĵ-stems run a full paradigm
 * beside a contracted one, `dělaješ` beside `dělaš`, four cells of it, and the
 * third person plural is the same either way. Marking both by which form is
 * longer used to work only because `dělam` happens to be both at once.
 */
function buildPresentCells(
  pref: string,
  ps: string,
  psi: string,
  refl: string,
): VerbCell[] {
  // see: irregular_stems
  const plain = (words: string[]) =>
    words.map((word) => plainCell(transliterateBack(`${pref}${word}${refl}`)));

  switch (ps) {
    case 'jes':
      // The copula's third person has a full `jest` and a bare `je`, which is
      // the only place a short form turns up in the present tense.
      return [
        plainCell(transliterateBack('jesm')),
        plainCell(transliterateBack('jesi')),
        [
          { form: transliterateBack('jest') },
          { form: transliterateBack('je'), feats: { Variant: 'Short' } },
        ],
        plainCell(transliterateBack('jesmo')),
        plainCell(transliterateBack('jeste')),
        plainCell(transliterateBack('sųt')),
      ];
    case 'da':
      return plain(['dam', 'daš', 'da', 'damo', 'date', 'dadųt']);
    case 'vě':
      return plain(['věm', 'věš', 'vě', 'věmo', 'věte', 'vědųt']);
    case 'jě':
      return plain(['jěm', 'jěš', 'jě', 'jěmo', 'jěte', 'jědųt']);
    case 'je':
      return plain(['jem', 'ješ', 'je', 'jemo', 'jete', 'jedųt']);
    case 'ja':
      return plain(['jam', 'jaš', 'ja', 'jamo', 'jate', 'jadųt']);
  }

  switch (ps.slice(-1)) {
    case 'ĵ': {
      // Naučny Medžuslovjanski uses...
      // ...ĵ in cases where most Slavic languages have contraction -aje- > -a-
      const cut = ps.slice(0, -1);
      const pps = `${cut}j`;
      return [
        athematicEnding(`${pref}${pps}ų${refl}`, `${pref}${cut}m${refl}`),
        contraction(`${pref}${pps}eš${refl}`, `${pref}${cut}š${refl}`),
        contraction(`${pref}${pps}e${refl}`, `${pref}${cut}${refl}`),
        contraction(`${pref}${pps}emo${refl}`, `${pref}${cut}mo${refl}`),
        contraction(`${pref}${pps}ete${refl}`, `${pref}${cut}te${refl}`),
        plainCell(transliterateBack(`${pref}${pps}ųt${refl}`)),
      ];
    }
    case 'i': {
      const cut = ps.slice(0, -1);
      return [
        athematicEnding(`${pref}${cut}xų${refl}`, `${pref}${ps}m${refl}`),
        plainCell(transliterateBack(`${pref}${ps}š${refl}`)),
        plainCell(transliterateBack(`${pref}${ps}${refl}`)),
        plainCell(transliterateBack(`${pref}${ps}mo${refl}`)),
        plainCell(transliterateBack(`${pref}${ps}te${refl}`)),
        plainCell(transliterateBack(`${pref}${cut}ęt${refl}`)),
      ];
    }
    default:
      return [
        athematicEnding(`${pref}${ps}ų${refl}`, `${pref}${psi}em${refl}`),
        plainCell(transliterateBack(`${pref}${psi}eš${refl}`)),
        plainCell(transliterateBack(`${pref}${psi}e${refl}`)),
        plainCell(transliterateBack(`${pref}${psi}emo${refl}`)),
        plainCell(transliterateBack(`${pref}${psi}ete${refl}`)),
        plainCell(transliterateBack(`${pref}${ps}ųt${refl}`)),
        [],
      ];
  }
}

function plainCell(form: string): VerbCell {
  return [{ form }];
}

/** `nesų` beside `nesem`: the ending of `jesm`, offered by every verb. */
function athematicEnding(thematic: string, athematic: string): VerbCell {
  return [
    { form: transliterateBack(thematic) },
    { form: transliterateBack(athematic), feats: { Variant: 'Athematic' } },
  ];
}

/** `dělaješ` beside `dělaš`: the third conjugation, contracted out of `-aje-`. */
function contraction(full: string, contracted: string): VerbCell {
  return [
    { form: transliterateBack(full), feats: { Variant: 'Long' } },
    { form: transliterateBack(contracted), feats: { Variant: 'Short' } },
  ];
}

function build_imperfect(pref: string, is: string, refl: string): VerbCell[] {
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
    `${pref}${impst}hmo${refl}`,
    `${pref}${impst}ste${refl}`,
    `${pref}${impst}hų${refl}`,
  ].map((form) => [{ form: transliterateBack(form) }]);
}

function buildFuture(infinitive: string): string[] {
  // `bųdų byti` would be a tautology, so the copula drops out of its own
  // future. `build_infinitive` always ends the lemma in `tì`, which is why the
  // `biti`, `byti` and Cyrillic spellings the original also tested for are
  // gone: nothing that reaches here can be spelled any of those ways.
  if (infinitive == 'bytì') {
    infinitive = '';
  }
  const verb = transliterateBack(infinitive);
  return [
    `bųdų ${verb}`,
    `bųdeš ${verb}`,
    `bųde ${verb}`,
    `bųdemo ${verb}`,
    `bųdete ${verb}`,
    `bųdųt ${verb}`,
  ];
}

/**
 * The `-l` participle in the four shapes the compound tenses use it in. The
 * repairs are the ones `buildPerfect` makes below, applied to the participle
 * alone rather than to the phrase it sits in.
 */
function buildLParticiple(lpa: string): VerbCell {
  const shapes = [
    ['', { Gender: 'Masc', Number: 'Sing' }],
    ['a', { Gender: 'Fem', Number: 'Sing' }],
    ['o', { Gender: 'Neut', Number: 'Sing' }],
    ['i', { Number: 'Plur' }],
  ] as const;

  return shapes.map(([ending, feats]) => {
    let form = `${lpa}${ending}`;
    form = form.includes('šėl') ? idti(form) : form;
    form = form.includes('žegl') ? zegti(form) : form;
    return { form: transliterateBack(form), feats };
  });
}

function buildPerfect(lpa: string, refl: string): string[] {
  const result = [
    `jesm ${lpa}(a)${refl}`,
    `jesi ${lpa}(a)${refl}`,
    `(je) ${lpa}${refl}`,
    `(je) ${lpa}a${refl}`,
    `(je) ${lpa}o${refl}`,
    `jesmo ${lpa}i${refl}`,
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
    `byhmo ${lpa}i${refl}`,
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

/** Second person singular, first and second person plural, in that order. */
function build_imperative(pref: string, ps: string, refl: string): VerbCell[] {
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

  let result = p2s + refl + ', ' + p2s + 'mo' + refl + ', ' + p2s + 'te' + refl;
  result = result.replace(/jij/g, 'j');
  result = result.replace(/ĵij/g, 'ĵ');
  result = transliterateBack(result);

  return result.split(', ').map((form) => [{ form }]);
}

/**
 * Every participle is one stem plus a gendered ending, and both the display
 * cell and the lemma fall out of the same three forms.
 */
export interface Participle {
  display: string;
  citation: string;
}

function participle(
  masculine: string,
  feminine: string,
  neuter: string,
  refl: string,
): Participle {
  const [m, f, n, r] = [masculine, feminine, neuter, refl].map(
    transliterateBack,
  );

  return { display: `${m} (${f}, ${n})${r}`, citation: `${m}${r}` };
}

function build_prap(pref: string, ps: string, refl: string): Participle {
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

  return participle(ps + 'ćí', ps + 'ćá', ps + 'ćé', refl);
}

function build_prpp(pref: string, ps: string, psi: string): Participle {
  // Present Participle Passive (napr., izslědujemy)
  if (ps in irregular_stems) {
    ps = ps + 'do';
  }

  const i = ps.length - 1;
  let cut = '';
  if (ps.charAt(i) == 'ĵ') {
    // The contracted stem gives a second reading, and the tables leave the two
    // oblique genders as dashes in both of them.
    cut = ps.substring(0, i);
    ps = cut + 'j';
    const full = transliterateBack(pref + ps + 'emý');
    const short = transliterateBack(pref + cut + 'mý');
    // The oblique genders are printed as dashes rather than spelled out, in
    // both readings.
    const oblique = transliterateBack('(—á, —œ)');
    return {
      display: `${full} ${oblique}, ${short} ${oblique}`,
      citation: `${full}, ${short}`,
    };
  }
  if (ps.charAt(i) == 'j') {
    return participle(
      pref + psi + 'emý',
      pref + psi + 'emá',
      pref + psi + 'emœ',
      '',
    );
  }
  if (
    ps.charAt(i) == 's' ||
    ps.charAt(i) == 'z' ||
    ps.charAt(i) == 't' ||
    ps.charAt(i) == 'd' ||
    ps.charAt(i) == 'l'
  ) {
    return participle(
      pref + ps + 'omý',
      pref + ps + 'omá',
      pref + ps + 'omœ',
      '',
    );
  }
  if (ps.charAt(i) == 'i' || ps.charAt(i) == 'o') {
    return participle(pref + ps + 'mý', pref + ps + 'má', pref + ps + 'mœ', '');
  }

  return participle(
    pref + psi + 'emý',
    pref + psi + 'emá',
    pref + psi + 'emœ',
    '',
  );
}

function build_pfap(lpa: string, refl: string): Participle {
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
  return participle(
    result,
    result.slice(0, -1) + 'á',
    result.slice(0, -1) + 'é',
    refl,
  );
}

function pfppStem(pref: string, is: string, psi: string): string {
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
  } else if (is.charAt(i) == 'r' || is.charAt(i) == 'ŕ') {
    ppps = pref + is + 't';
  } else {
    ppps = pref + is + 'en';
  }

  return ppps;
}

function build_pfpp(stem: string): Participle {
  return participle(stem + 'ý', stem + 'á', stem + 'ó', '');
}

/** The verbal noun is the passive participle's stem with `-ıje` on it. */
function build_gerund(stem: string): string {
  return transliterateBack(stem + 'ıje').replace('ne ', 'ne');
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

export function inflectVerb(
  word: string,
  xpos: XPOS,
  irregular?: string,
): AdapterResult<'VERB' | 'AUX'> {
  const variants = parseXPos(word, xpos);
  const results: AdapterResult<'VERB' | 'AUX'> = [];

  for (const [upos, baseFeats] of variants) {
    if (upos !== 'VERB' && upos !== 'AUX') continue;

    const paradigm = conjugateVerb(word, irregular || '', xpos);

    if (!paradigm) {
      results.push({
        form: word,
        upos,
        feats: baseFeats,
      });
      continue;
    }

    /** The present tense already knows what its readings differ in. */
    const addCell = (cell: VerbCell, feats: TokenFeatures) => {
      for (const form of cell) {
        results.push({
          form: form.form,
          upos,
          feats: { ...baseFeats, ...feats, ...form.feats },
        });
      }
    };

    addCell(paradigm.infinitive, { VerbForm: 'Inf' });

    if (paradigm.present) {
      const [p1s, p2s, p3s, p1p, p2p, p3p] = paradigm.present;
      addCell(p1s, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Pres',
        Number: 'Sing',
        Person: '1',
      });
      addCell(p2s, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Pres',
        Number: 'Sing',
        Person: '2',
      });
      addCell(p3s, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Pres',
        Number: 'Sing',
        Person: '3',
      });
      addCell(p1p, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Pres',
        Number: 'Plur',
        Person: '1',
      });
      addCell(p2p, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Pres',
        Number: 'Plur',
        Person: '2',
      });
      addCell(p3p, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Pres',
        Number: 'Plur',
        Person: '3',
      });
    }

    if (paradigm.imperfect) {
      const [i1s, i2s, i3s, i1p, i2p, i3p] = paradigm.imperfect;
      addCell(i1s, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Past',
        Number: 'Sing',
        Person: '1',
      });
      addCell(i2s, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Past',
        Number: 'Sing',
        Person: '2',
      });
      addCell(i3s, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Past',
        Number: 'Sing',
        Person: '3',
      });
      addCell(i1p, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Past',
        Number: 'Plur',
        Person: '1',
      });
      addCell(i2p, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Past',
        Number: 'Plur',
        Person: '2',
      });
      addCell(i3p, {
        VerbForm: 'Fin',
        Mood: 'Ind',
        Tense: 'Past',
        Number: 'Plur',
        Person: '3',
      });
    }

    const [imp2s, imp1p, imp2p] = paradigm.imperative;
    addCell(imp2s, {
      VerbForm: 'Fin',
      Mood: 'Imp',
      Number: 'Sing',
      Person: '2',
    });
    addCell(imp1p, {
      VerbForm: 'Fin',
      Mood: 'Imp',
      Number: 'Plur',
      Person: '1',
    });
    addCell(imp2p, {
      VerbForm: 'Fin',
      Mood: 'Imp',
      Number: 'Plur',
      Person: '2',
    });

    addCell(paradigm.lparticiple, {
      VerbForm: 'Part',
      Tense: 'Past',
      Voice: 'Act',
    });
  }

  return results;
}
