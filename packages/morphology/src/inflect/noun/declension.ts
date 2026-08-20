/*
 * @source http://steen.free.fr/interslavic/declinator.html
 */

import type {
  AdapterResult,
  Features,
  Misc,
  TokenFeatures,
  XPOS,
} from '@interslavic/conllu';
import { SOFT_CONSONANTS, VOWELS } from '@interslavic/translit/phonology';

import { declineAdjective } from '../adjective/index.ts';
import {
  inferFleetingVowel,
  markFleetingVowel,
} from '../../orthography/index.ts';
import { type Noun, parsePos } from '../../partOfSpeech/index.ts';
import { parseXPos } from '../../steen/index.ts';
import { removeBrackets, replaceStringAt } from '../utils/index.ts';
import { establishGender } from './establishGender.ts';

// endings like -i, -u are not declinable usually
const AEEO$ = /[aeęo]$/;
// should omit words like: obUv, žOLv
const XV$ = /(?:[^aåeęěėioȯuųyl]|[^oȯ]l)v$/;

/**
 * One slot of a paradigm. Most hold a single form; the athematic classes hold
 * two, and then one belongs to the archaic declension and the other to the
 * ordinary one. Which is which follows from the branch that built the pair, so
 * the branch records it and nothing downstream has to work it out from the
 * forms.
 */
export type NounCell = Array<{ form: string; feats?: TokenFeatures }>;

/** The cases a noun paradigm holds, in the order the tables below build them. */
const CASES = {
  nom: 'Nom',
  acc: 'Acc',
  gen: 'Gen',
  loc: 'Loc',
  dat: 'Dat',
  ins: 'Ins',
  voc: 'Voc',
} as const satisfies Record<string, Features.Case>;

export type NounParadigm = {
  /**
   * Set when the lemma is an adjective used as a noun and the forms come from
   * `declineAdjective`. Surfaces on the tokens as `Declension=Adj` in MISC,
   * which is the only place it is still visible once UPOS says `NOUN`.
   */
  substantivized?: true;
  nom: [NounCell | null, NounCell | null];
  acc: [NounCell | null, NounCell | null];
  gen: [NounCell | null, NounCell | null];
  loc: [NounCell | null, NounCell | null];
  dat: [NounCell | null, NounCell | null];
  ins: [NounCell | null, NounCell | null];
  voc: [NounCell | null, NounCell | null];
};

/**
 * Where the archaic form sits when a slot holds two. `telę`, `kamen` and
 * `crkȯv` lead with it and follow with the ordinary declension; the es-stems
 * take their second stem from the dictionary and print it after the plain form,
 * `oka`, then `očese`.
 */
type Archaic = 'none' | 'first' | 'second';

function cell(forms: string[], archaic: Archaic = 'none'): NounCell {
  const index = archaic === 'first' ? 0 : forms.length - 1;

  return forms.map((form, at) =>
    archaic !== 'none' && forms.length > 1 && at === index
      ? { form, feats: { Variant: 'Athematic' as const } }
      : { form },
  );
}

export function declineNoun(
  rawNoun: string,
  rawAdd: string,
  originGender: Noun['gender'],
  animated: boolean,
  isPlural: boolean,
  isSingular: boolean,
  isIndeclinable: boolean,
): NounParadigm | null {
  // remove square brackets
  let noun = removeBrackets(rawNoun, '[', ']');
  // now we don't know how to decline the phrases
  if (noun.includes(' ')) {
    return null;
  }
  //indeclinable
  if (isIndeclinable) {
    const both: [NounCell, NounCell] = [cell([noun]), cell([noun])];
    return {
      nom: [...both],
      acc: [...both],
      gen: [...both],
      loc: [...both],
      dat: [...both],
      ins: [...both],
      voc: [...both],
    };
  }
  //plural nouns
  const add = rawAdd.replace(/[()]/g, '');
  if (isPlural) {
    return declensionPluralNoun(noun, add, originGender);
  }
  //substantivized adjectives
  if (
    add &&
    ['-ogo', '-ego', '-oj', '-ej'].indexOf(
      add.replace(noun.slice(0, -1), '-'),
    ) !== -1
  ) {
    return declensionSubstAdj(
      noun,
      add.replace(noun.slice(0, -1), '-'),
      originGender,
      animated,
    );
  }

  if (add && noun !== add) {
    noun = markFleetingVowel(noun, add);
  } else if (originGender === 'masculine') {
    noun = inferFleetingVowel(noun);
  }

  const rawGender = prepareGender(originGender, animated);

  noun = noun.replace(/[ńň]$/, 'nj');
  noun = noun.replace(/[ľĺ]$/, 'lj');
  noun =
    noun.slice(0, -2) + noun.slice(-2).replace(/([cšžčćńľŕťďśźđj])/g, '$1ь');

  const nounWithoutFleeting = noun.replace(/\([oe]\)/, '');

  noun = noun.replace('(e)', 'ė').replace('(o)', 'ȯ');

  let gender = establishGender(noun, rawGender);
  let root = establish_root(nounWithoutFleeting, gender);

  const hinted = fitGenitiveHint(
    add,
    gender,
    rootCandidates(nounWithoutFleeting, gender),
  );
  if (hinted) {
    gender = hinted.gender;
    root = hinted.root;
  }

  const plroot = establish_plural_root(root);
  const plgen = establishPluralGender(root, plroot, gender, rawGender);

  //singular forms
  const nom_sg = nominative_sg(noun, root, gender);
  const gen_sg = genitive_sg(root, gender);
  const dat_sg = dative_sg(root, gender);
  const acc_sg = accusative_sg(nom_sg, root, gender);
  const ins_sg = instrumental_sg(root, gender);
  const loc_sg = locative_sg(root, gender);
  const voc_sg = vocative_sg(nom_sg, root, gender);

  //only singular
  if (isSingular) {
    return {
      nom: [nom_sg, null],
      acc: [acc_sg, null],
      gen: [gen_sg, null],
      loc: [loc_sg, null],
      dat: [dat_sg, null],
      ins: [ins_sg, null],
      voc: [voc_sg, null],
    };
  }

  //plural forms
  const nom_pl = nominative_pl(plroot, plgen);
  const gen_pl = genitive_pl(plroot, plgen);
  const dat_pl = dative_pl(plroot, gender);
  const acc_pl = accusative_pl(nom_pl, gen_pl, plgen);
  const ins_pl = instrumental_pl(plroot, gender);
  const loc_pl = locative_pl(plroot, gender);

  return {
    nom: [nom_sg, nom_pl],
    acc: [acc_sg, acc_pl],
    gen: [gen_sg, gen_pl],
    loc: [loc_sg, loc_pl],
    dat: [dat_sg, dat_pl],
    ins: [ins_sg, ins_pl],
    voc: [voc_sg, nom_pl],
  };
}

function prepareGender(gender: string, animated: boolean): string {
  if (gender === 'feminine') {
    return 'f';
  }
  if (gender === 'neuter') {
    return 'n';
  }
  if (gender === 'masculine') {
    return animated ? 'm1' : 'm2';
  }

  throw new Error(`Invalid gender value: ${gender}`);
}

function establish_root(noun: string, gender: string, dropFleeting = true) {
  let result = '';
  /*if ((noun == 'den') || (noun == 'dėn') || (noun == 'denjь') || (noun == 'dėnjь')) {
        result = 'dn';
    }*/

  const fleetingVowelIndex = Math.max(
    noun.lastIndexOf('ė'),
    noun.lastIndexOf('ȯ'),
  );

  const hasVowelEnding = AEEO$.test(noun);

  if (noun === 'ľv') {
    result = 'ljv';
  } else if (noun == 'Ľv') {
    result = 'Ljv';
  } else if (noun == 'ľn') {
    result = 'ljn';
  } else if (gender == 'm3') {
    result = noun + '%';
    result = result.replace('jь%', '%');
    result = result.replace('%', '');
  } else if (noun == 'mati' || noun == 'dočьi' || noun == 'doćьi') {
    result = noun.slice(0, -1) + 'er';
  } else if (gender == 'f3' && noun.endsWith('ov')) {
    result = noun.slice(0, -2) + 'v';
  } else if (gender == 'f3') {
    result = noun;
  } else if (gender == 'n2' && noun.slice(-2, -1) === 'm') {
    result = noun.slice(0, -1) + 'en';
  } else if (gender == 'n2') {
    result = noun.slice(0, -1) + 'ęt';
  } else if (gender == 'f1' && (noun === 'pani' || noun.slice(-3) == 'yni')) {
    result = noun.slice(0, -1) + 'jь';
  } else if (noun.slice(-1) === 'i') {
    result = noun.slice(0, -1) + 'ь';
  } else if (hasVowelEnding) {
    result = noun.slice(0, -1);
  } else {
    result = noun;
  }

  if (
    dropFleeting &&
    !hasVowelEnding &&
    fleetingVowelIndex > result.length - 3
  ) {
    result = replaceStringAt(result, fleetingVowelIndex, '');
  }

  return result;
}

/** Everything the genitive singular can end in, per declension class. */
const GENITIVE_SG_ENDINGS: Record<string, string[]> = {
  m1: ['a'],
  m2: ['a'],
  m3: ['ja', 'e'],
  f1: ['y'],
  f2: ['i'],
  f3: ['i', 'e'],
  n1: ['a'],
  n2: ['a', 'e'],
  n3: ['a'],
};

/** A hint is a stem only when it is one plain form: `oka/očese; pl. oči` is not. */
const ONE_FORM = /^[^\s/,;]+$/;

function genitiveVariants(root: string, gender: string): string[] {
  return genitive_sg(root, gender).map(({ form }) => form);
}

/**
 * Stems the nominative could be hiding, best guess first: as established, with
 * the fleeting vowel kept, and with any one vowel dropped — `veś` spells its
 * fleeting `e` like an ordinary one, so only the hint can tell them apart.
 * Dropping it here rather than taking the stem off the hint keeps the softness
 * that `rules()` has already flattened out of the hint: `plť`, not `plt`.
 */
function rootCandidates(noun: string, gender: string): string[] {
  const kept = establish_root(noun, gender, false);
  const candidates = [establish_root(noun, gender), kept];

  for (let i = 0; i < kept.length; i++) {
    if (VOWELS.has(kept[i])) {
      candidates.push(kept.slice(0, i) + kept.slice(i + 1));
    }
  }

  return candidates;
}

/**
 * The parenthesised hint is the genitive singular — `dȯći (dȯćere)`,
 * `veś (vsi)`, `šėpȯt (šėpȯta)` — the one form that shows the oblique stem the
 * nominative hides. Take the first stem that reproduces it, and if none does,
 * the hint minus its ending: an r-stem like `dȯćer` cannot be guessed from the
 * nominative at all. Neighbouring classes of the same gender are tried too, in
 * case the hint is saying the class was wrong as well.
 */
function fitGenitiveHint(
  add: string,
  gender: string,
  roots: string[],
): { gender: string; root: string } | undefined {
  if (!add || !ONE_FORM.test(add)) {
    return undefined;
  }

  if (genitiveVariants(roots[0], gender).includes(add)) {
    return undefined;
  }

  const classes = Object.keys(GENITIVE_SG_ENDINGS)
    .filter((candidate) => candidate[0] === gender[0])
    .sort((a, b) => Number(b === gender) - Number(a === gender));

  for (const candidate of classes) {
    const stems = [...roots];

    for (const ending of GENITIVE_SG_ENDINGS[candidate]) {
      if (add.endsWith(ending) && add.length > ending.length) {
        stems.push(add.slice(0, -ending.length));
      }
    }

    for (const stem of stems) {
      if (genitiveVariants(stem, candidate).includes(add)) {
        return { gender: candidate, root: stem };
      }
    }
  }

  return undefined;
}

function establish_plural_root(root: string) {
  let result = '';
  if (
    root == 'dětęt' ||
    root == 'detet' ||
    root == 'dětet' ||
    root == 'detęt'
  ) {
    result = 'dětь';
  } else if (root == 'človek' || root == 'člověk') {
    result = 'ljudь';
  } else if (root == 'ok') {
    result = 'očь';
  } else if (root == 'uh') {
    result = 'ušь';
  } else if (root.substring(root.length - 4, root.length) == 'anin') {
    result = root.substring(0, root.length - 2);
  } else {
    result = root;
  }
  return result;
}

function establishPluralGender(
  root: string,
  plroot: string,
  gender: string,
  rawGender: string,
): string {
  if (root !== plroot && plroot.indexOf('n') === -1) {
    return 'f2';
  }
  if (gender === 'f1' && rawGender === 'm1') {
    return 'm1';
  }
  return gender;
}

function nominative_sg(noun: string, root: string, gender: string): NounCell {
  let result: string[] = [];
  let archaic: Archaic = 'none';
  if (gender == 'f2') {
    result = [root];
  }
  if (gender == 'f3' && XV$.test(root)) {
    result = [root.slice(0, root.length - 1) + 'ȯv'];
  } else if (gender == 'f3') {
    result = [noun];
  } else if (gender == 'm3' && root == 'dn') {
    result = ['den', 'denj'];
    archaic = 'first';
  } else if (gender == 'm3') {
    result = [root, root + 'j'];
    archaic = 'first';
  } else {
    result = [noun];
  }
  return cell(result.map(rules), archaic);
}

function accusative_sg(nom: NounCell, root: string, gender: string): NounCell {
  if (gender == 'm1') return cell([rules(root + 'a')]);
  if (gender == 'f1') return cell([rules(root + 'ų')]);
  return nom;
}

function genitive_sg(root: string, gender: string): NounCell {
  let result: string[] = [];
  let archaic: Archaic = 'none';
  if (gender == 'm1' || gender == 'm2' || gender == 'n1') {
    result = [root + 'a'];
  } else if (gender == 'f1') {
    result = [root + 'y'];
  } else if (gender == 'f2') {
    result = [root + 'i'];
  } else if (gender == 'f3') {
    result = [root + 'e', root + 'i'];
    archaic = 'first';
  } else if (gender == 'm3') {
    result = [root + 'e', root + 'ja'];
    archaic = 'first';
  } else if (gender == 'n2') {
    result = [root + 'e', root + 'a'];
    archaic = 'first';
  } else if (gender == 'n3') {
    result = [root + 'a', palatalizationEnding(root) + 'ese'];
    archaic = 'second';
  }
  return cell(result.map(rules), archaic);
}

function dative_sg(root: string, gender: string): NounCell {
  let result: string[] = [];
  let archaic: Archaic = 'none';
  if (gender == 'm1' || gender == 'm2' || gender == 'n1') {
    result = [root + 'u'];
  } else if (gender == 'f1') {
    result = [root + 'ě'];
  } else if (gender == 'f2') {
    result = [root + 'i'];
  } else if (gender == 'f3') {
    result = [root + 'i'];
  } else if (gender == 'm3') {
    result = [root + 'i', root + 'ju'];
    archaic = 'first';
  } else if (gender == 'n2') {
    result = [root + 'i', root + 'u'];
    archaic = 'first';
  } else if (gender == 'n3') {
    result = [root + 'u', palatalizationEnding(root) + 'esi'];
    archaic = 'second';
  }
  return cell(result.map(rules), archaic);
}

function instrumental_sg(root: string, gender: string): NounCell {
  let result: string[] = [];
  let archaic: Archaic = 'none';
  if (gender == 'm1' || gender == 'm2' || gender == 'n1') {
    result = [root + 'om'];
  } else if (gender == 'f1') {
    result = [root + 'ojų'];
  } else if (gender == 'f2') {
    result = [root + 'jų'];
  } else if (gender == 'f3' && XV$.test(root)) {
    result = [root.substring(0, root.length - 1) + 'ȯvjų'];
  } else if (gender == 'f3') {
    result = [root + 'jų'];
  } else if (gender == 'm3') {
    result = [root + 'em', root + 'jem'];
    archaic = 'first';
  } else if (gender == 'n2') {
    result = [root + 'em', root + 'om'];
    archaic = 'first';
  } else if (gender == 'n3') {
    result = [root + 'om', palatalizationEnding(root) + 'esem'];
    archaic = 'second';
  }
  return cell(result.map(rules), archaic);
}

function locative_sg(root: string, gender: string): NounCell {
  let result: string[] = [];
  let archaic: Archaic = 'none';
  if (gender == 'm1' || gender == 'm2' || gender == 'n1') {
    result = [root + 'u'];
  } else if (gender == 'f1') {
    result = [root + 'ě'];
  } else if (gender == 'f2') {
    result = [root + 'i'];
  } else if (gender == 'f3') {
    result = [root + 'i'];
  } else if (gender == 'm3') {
    result = [root + 'i', root + 'ju'];
    archaic = 'first';
  } else if (gender == 'n2') {
    result = [root + 'i', root + 'u'];
    archaic = 'first';
  } else if (gender == 'n3') {
    result = [root + 'u', palatalizationEnding(root) + 'esi'];
    archaic = 'second';
  }
  return cell(result.map(rules), archaic);
}

const EC_ENDING = /[eėè]c$/;

function vocative_sg(nom: NounCell, root: string, gender: string): NounCell {
  let result: string[] = [];
  let archaic: Archaic = 'none';
  if (gender == 'm1' || gender == 'm2') {
    if (nom.some(({ form }) => EC_ENDING.test(form))) {
      result = [root.substring(0, root.length - 2) + 'če'];
    } else if (root.lastIndexOf('ь') == root.length - 1) {
      result = [root + 'u'];
    } else if (root.lastIndexOf('čk') == root.length - 2) {
      result = [root + 'u'];
    } else if (root.lastIndexOf('k') == root.length - 1) {
      result = [root.substring(0, root.length - 1) + 'če'];
    } else if (root.lastIndexOf('g') == root.length - 1) {
      result = [root.substring(0, root.length - 1) + 'že'];
    } else if (root.lastIndexOf('h') == root.length - 1) {
      result = [root.substring(0, root.length - 1) + 'še'];
    } else {
      result = [root + 'e'];
    }
  } else if (gender == 'f1') {
    result = [root + '#o'];
  } else if (gender == 'f2') {
    result = [root + '#i'];
  } else if (gender == 'm3' && root == 'dn') {
    // `dėnj` spells its fleeting vowel back in here. Without the gender in the
    // test the branch also caught neuter `dno`, whose vocative came out as the
    // day's rather than the bottom's.
    result = ['den', 'dnju'];
    archaic = 'first';
  } else if (gender == 'm3') {
    result = [root, root + 'ju'];
    archaic = 'first';
  } else {
    return nom;
  }
  return cell(result.map(rules), archaic);
}

function nominative_pl(root: string, gender: string): NounCell {
  let result: string[] = [];
  let archaic: Archaic = 'none';
  if (gender == 'n3') {
    result = [root + 'a', palatalizationEnding(root) + 'esa'];
    archaic = 'second';
  } else if (root == 'očь' || root == 'ušь') {
    result = [root + 'i', root + 'esa'];
    archaic = 'second';
  } else if (gender.charAt(0) == 'n') {
    result = [root + 'a'];
  } else if (gender == 'm1') {
    result = [root + 'i'];
  } else if (gender == 'f1' || gender == 'm2') {
    result = [root + 'y'];
  } else if (gender == 'm3') {
    result = [root + 'i', root + 'je'];
    archaic = 'first';
  } else {
    result = [root + 'i'];
  }
  return cell(result.map(rules), archaic);
}

function accusative_pl(nom: NounCell, gen: NounCell, gender: string): NounCell {
  return gender == 'm1' ? gen : nom;
}

function genitive_pl(root: string, gender: string): NounCell {
  let result: string[] = [];
  let archaic: Archaic = 'none';
  if (gender == 'f1' || root == 'morjь' || root == 'poljь') {
    result = [root.replace('ь', '%').replace(/([pbvfmlnr])j%/, '$1ej') + '%'];
  } else if (root === 'st') {
    result = ['sȯt'];
  } else if (gender.charAt(0) == 'n') {
    const stem =
      root.replace('ь', '%').replace(/([pbvfmlnrszńľŕťďśźščžđ])j%/, '$1ij') +
      '%';
    if (gender == 'n3') {
      result = [stem, palatalizationEnding(root) + 'es'];
      archaic = 'second';
    } else {
      result = [stem];
    }
  } else if (gender == 'm3') {
    result = [root + 'ev', root + 'jev'];
    archaic = 'first';
  } else if (gender.charAt(0) == 'm') {
    result = [root + 'ov'];
  } else if (root == 'očь' || root == 'ušь') {
    result = [root + 'ij', root + 'es'];
    archaic = 'second';
  } else {
    result = [root + 'ij'];
  }
  return cell(result.map(plural_gen_ending).map(rules), archaic);
}

function plural_gen_ending(word: string) {
  word = word
    .replace('jsk%', 'jsk')
    .replace('mš%', 'meš')
    .replace('zl%', 'zȯl')
    .replace('tl%', 'tȯl')
    .replace('mgl%', 'mgȯl')
    .replace('ńj%', 'nij')
    .replace(/([jśźďťľŕńčšžćđc])(k)%/, '$1e$2')
    .replace(/([pbfvmlnrtdszkgh])(k)%/, '$1ȯ$2')
    .replace(/([vmpzšžt])(n)%/, '$1e$2')
    .replace(/(k)([nl])%/, '$1ȯ$2')
    .replace(/(s)([nl])%/, '$1e$2')
    .replace(/^dn%/, 'dȯn')
    .replace(/pismo%/, 'pisem')
    .replace(/^ťm%/, 'tem')
    .replace(/^sto%/, 'sȯt')
    .replace(/%/g, '');
  return word;
}

function dative_pl(root: string, gender: string): NounCell {
  let result: string[] = [];
  let archaic: Archaic = 'none';
  if (gender == 'm3') {
    result = [root + 'am', root + 'jam'];
    archaic = 'first';
  } else if (gender == 'n3') {
    result = [root + 'am', palatalizationEnding(root) + 'esam'];
    archaic = 'second';
  } else {
    result = [root + 'am'];
  }
  return cell(result.map(rules), archaic);
}

function instrumental_pl(root: string, gender: string): NounCell {
  let result: string[] = [];
  let archaic: Archaic = 'none';
  if (gender == 'm3') {
    result = [root + 'ami', root + 'jami'];
    archaic = 'first';
  } else if (gender == 'n3') {
    result = [root + 'ami', palatalizationEnding(root) + 'esami'];
    archaic = 'second';
  } else {
    result = [root + 'ami'];
  }
  return cell(result.map(rules), archaic);
}

function locative_pl(root: string, gender: string): NounCell {
  let result: string[] = [];
  let archaic: Archaic = 'none';
  if (gender == 'm3') {
    result = [root + 'ah', root + 'jah'];
    archaic = 'first';
  } else if (gender == 'n3') {
    result = [root + 'ah', palatalizationEnding(root) + 'esah'];
    archaic = 'second';
  } else {
    result = [root + 'ah'];
  }
  return cell(result.map(rules), archaic);
}

function rules(word: string): string {
  return word
    .replace('ьo', 'ьe')
    .replace('ьy', 'ьe')
    .replace('ьě', 'i')
    .replace('#', '')
    .replace('tь', 'ť')
    .replace('dь', 'ď')
    .replace('sь', 'ś')
    .replace('zь', 'ź')
    .replace(/ь/g, '')
    .replace('ťi', 'ti')
    .replace('ďi', 'di')
    .replace('śi', 'si')
    .replace('źi', 'zi')
    .replace(/ľi/g, 'li')
    .replace('ńi', 'ni')
    .replace('ŕi', 'ri')
    .replace('jy', 'ji')
    .replace('cy', 'ci')
    .replace('ľė', 'lė')
    .replace('ńė', 'nė')
    .replace('ljj', 'ľj')
    .replace('njj', 'ńj');
}

function declensionPluralNoun(
  word: string,
  add: string,
  gender: string,
): NounParadigm | null {
  const wordWithoutLast = word.slice(0, -1);
  if (add.slice(-2) === 'yh' || add.slice(-2) === 'ih') {
    const iOrY = add.slice(-2) === 'yh' ? 'y' : 'i';

    return {
      nom: [null, cell([word])],
      acc: [null, cell([word])],
      gen: [null, cell([wordWithoutLast + iOrY + 'h'])],
      loc: [null, cell([wordWithoutLast + iOrY + 'h'])],
      dat: [null, cell([wordWithoutLast + iOrY + 'm'])],
      ins: [null, cell([wordWithoutLast + iOrY + 'mi'])],
      voc: [null, cell([word])],
    };
  } else if (add) {
    return null;
  } else if (gender === 'masculine' && word.match(/[iye]$/)) {
    return {
      nom: [null, cell([word])],
      acc: [null, cell([word])],
      gen: [null, cell([wordWithoutLast + 'ov'])],
      loc: [null, cell([wordWithoutLast + 'ah'])],
      dat: [null, cell([wordWithoutLast + 'am'])],
      ins: [null, cell([wordWithoutLast + 'ami'])],
      voc: [null, cell([word])],
    };
  } else if (
    (gender === 'feminine' && word.match(/[ye]$/)) ||
    (gender === 'neuter' && word.match(/[a]$/))
  ) {
    return {
      nom: [null, cell([word])],
      acc: [null, cell([word])],
      gen: [null, cell([rules(plural_gen_ending(wordWithoutLast + '%'))])],
      loc: [null, cell([wordWithoutLast + 'ah'])],
      dat: [null, cell([wordWithoutLast + 'am'])],
      ins: [null, cell([wordWithoutLast + 'ami'])],
      voc: [null, cell([word])],
    };
  } else if (gender === 'feminine' && word.match(/[i]$/)) {
    return {
      nom: [null, cell([word])],
      acc: [null, cell([word])],
      gen: [null, cell([wordWithoutLast + 'ij'])],
      loc: [null, cell([wordWithoutLast + 'ah'])],
      dat: [null, cell([wordWithoutLast + 'am'])],
      ins: [null, cell([wordWithoutLast + 'ami'])],
      voc: [null, cell([word])],
    };
  }
  return null;
}

function declensionSubstAdj(
  word: string,
  add: string,
  gender: Noun['gender'],
  animated: boolean,
): NounParadigm | null {
  if (gender === 'masculine' || gender === 'neuter') {
    const adjectiveParadigm = declineAdjective(
      word.slice(0, -1) + (add === '-ogo' ? 'y' : 'i'),
      '',
    );
    // A noun has one accusative, not an animate and an inanimate one, so the
    // adjective's pair collapses to whichever the entry's own animacy picks.
    const animatedCol = animated ? 0 : 1;
    const column = (slot: NounCell) => [{ form: slot[animatedCol].form }];

    return {
      substantivized: true,
      nom: [cell([word]), column(adjectiveParadigm.plural.nom[0])],
      acc: [
        // A neuter accusative repeats the nominative, and the nominative of a
        // substantivized adjective is the lemma itself.
        gender === 'neuter'
          ? cell([word])
          : column(adjectiveParadigm.singular.acc[0]),
        column(adjectiveParadigm.plural.acc[0]),
      ],
      gen: [adjectiveParadigm.singular.gen[0], adjectiveParadigm.plural.gen[0]],
      loc: [adjectiveParadigm.singular.loc[0], adjectiveParadigm.plural.loc[0]],
      dat: [adjectiveParadigm.singular.dat[0], adjectiveParadigm.plural.dat[0]],
      ins: [adjectiveParadigm.singular.ins[0], adjectiveParadigm.plural.ins[0]],
      voc: [cell([word]), column(adjectiveParadigm.plural.nom[0])],
    };
  } else {
    const adjectiveParadigm = declineAdjective(
      word.slice(0, -1) + (add === '-oj' ? 'y' : 'i'),
      '',
    );

    return {
      substantivized: true,
      nom: [cell([word]), adjectiveParadigm.plural.nom[1]],
      // The singular accusative keeps the three genders apart — masculine,
      // neuter, feminine — where every other case merges masculine with neuter
      // and leaves the feminine second.
      acc: [adjectiveParadigm.singular.acc[2], adjectiveParadigm.plural.acc[1]],
      gen: [adjectiveParadigm.singular.gen[1], adjectiveParadigm.plural.gen[0]],
      loc: [adjectiveParadigm.singular.loc[1], adjectiveParadigm.plural.loc[0]],
      dat: [adjectiveParadigm.singular.dat[1], adjectiveParadigm.plural.dat[0]],
      ins: [adjectiveParadigm.singular.ins[1], adjectiveParadigm.plural.ins[0]],
      voc: [cell([word]), adjectiveParadigm.plural.nom[1]],
    };
  }
}

function palatalizationEnding(root: string): string {
  const rootOneLast = root.slice(-1);
  const rootWithoutLast = root.slice(0, -1);

  if (rootOneLast === 'g') {
    return rootWithoutLast + 'žь';
  }
  if (rootOneLast === 'h') {
    return rootWithoutLast + 'šь';
  }
  if (rootOneLast === 'k') {
    return rootWithoutLast + 'čь';
  }
  if (root.slice(-2) === 'cь') {
    return root.slice(0, -2) + 'čь';
  }

  return root;
}

type Gender = 'masculine' | 'feminine';

function nounArgs(
  lemma: string,
  morphology: string,
  extra: string,
  genderOverride?: Gender,
) {
  const pos = parsePos(morphology);
  if (pos.name !== 'noun') throw new Error('not a noun');

  let gender = pos.gender;
  if (gender === 'masculineOrFeminine') {
    gender = genderOverride ?? gender;
  }

  return [
    lemma,
    extra || (pos.substantivized ? genitiveHint(lemma, gender) : ''),
    gender,
    pos.animate,
    pos.plural,
    pos.singular,
    pos.indeclinable,
  ] as const;
}

/**
 * A `*.subst.` tag says the word is an adjective used as a noun but not which
 * of the two adjective declensions it takes; the dictionary says that with a
 * bracketed genitive, `dežurny (-ogo)`. Where the tag comes without one, the
 * genitive is spelled out from the lemma: the masculine and the neuter wear
 * their softness in the ending, `pųtujųći` and `srědnje` against `dežurny` and
 * `dobro`, and the feminine, whose `-a` is the same either way, wears it on the
 * last consonant of the stem.
 */
function genitiveHint(lemma: string, gender: Noun['gender']): string {
  const stem = lemma.slice(0, -1);
  const soft =
    gender === 'feminine'
      ? SOFT_CONSONANTS.has(stem.slice(-1))
      : /[ie]$/.test(lemma);

  return gender === 'feminine'
    ? stem + (soft ? 'ej' : 'oj')
    : stem + (soft ? 'ego' : 'ogo');
}

export function declineNounSimple(
  lemma: string,
  morphology: string,
  extra = '',
  genderOverride?: Gender,
) {
  return declineNoun(...nounArgs(lemma, morphology, extra, genderOverride));
}

export function inflectNoun(
  word: string,
  xpos: XPOS,
  irregular?: string,
): AdapterResult<'NOUN' | 'PROPN'> {
  const variants = parseXPos(word, xpos);
  const results: AdapterResult<'NOUN' | 'PROPN'> = [];

  for (const [upos, baseFeats] of variants) {
    if (upos !== 'NOUN' && upos !== 'PROPN') continue;
    const nounUpos = upos as 'NOUN' | 'PROPN';

    const isPlural = baseFeats.Number === 'Plur' || baseFeats.Number === 'Ptan';
    const isSingular = baseFeats.Number === 'Sing';

    const genderOverride =
      baseFeats.Gender === 'Fem'
        ? ('feminine' as const)
        : baseFeats.Gender === 'Masc'
          ? ('masculine' as const)
          : undefined;

    const paradigm = declineNounSimple(
      word,
      xpos,
      irregular || '',
      genderOverride,
    );

    if (!paradigm) {
      results.push({
        form: word,
        upos: nounUpos,
        feats: baseFeats,
      });
      continue;
    }

    const misc: Misc | undefined = paradigm.substantivized
      ? { Declension: 'Adj' }
      : undefined;

    for (const [caseName, conlluCase] of Object.entries(CASES)) {
      const [singular, plural] = paradigm[caseName as keyof typeof CASES];

      if (singular && !isPlural) {
        for (const { form, feats } of singular) {
          results.push({
            form,
            upos: nounUpos,
            feats: {
              ...baseFeats,
              ...feats,
              Case: conlluCase,
              Number: 'Sing' as Features.Number,
            },
            ...(misc && { misc }),
          });
        }
      }

      if (plural && !isSingular) {
        for (const { form, feats } of plural) {
          results.push({
            form,
            upos: nounUpos,
            feats: {
              ...baseFeats,
              ...feats,
              Case: conlluCase,
              Number: (baseFeats.Number === 'Ptan'
                ? 'Ptan'
                : 'Plur') as Features.Number,
            },
            ...(misc && { misc }),
          });
        }
      }
    }
  }

  return results;
}
