/*
 * @source http://steen.free.fr/interslavic/declinator.html
 */

import { declensionAdjective } from '../adjective';
import { inferFluentVowel, markFluentVowel } from '../common';
import type { Noun } from '../partOfSpeech';
import { VOWELS } from '../substitutions';
import { removeBrackets, replaceStringAt } from '../utils';
import { establishGender } from './establishGender';

// endings like -i, -u are not declinable usually
const AEEO$ = /[aeęo]$/;

export function declensionNounFlat(
  rawNoun: string,
  rawAdd: string,
  originGender: Noun['gender'],
  animated: boolean,
  isPlural: boolean,
  isSingular: boolean,
  isIndeclinable: boolean,
): string[] {
  return getDeclensionNounFlat(
    declensionNoun(
      rawNoun,
      rawAdd,
      originGender,
      animated,
      isPlural,
      isSingular,
      isIndeclinable,
    ),
  );
}

function getDeclensionNounFlat(result: any): string[] {
  if (!result) {
    return [];
  }

  const notFlat: any = Object.values(result);
  return Array.from(new Set(notFlat.flat().filter(Boolean)));
}

/** @deprecated */
export type SteenNounParadigm = {
  nom: [string | null, string | null];
  acc: [string | null, string | null];
  gen: [string | null, string | null];
  loc: [string | null, string | null];
  dat: [string | null, string | null];
  ins: [string | null, string | null];
  voc: [string | null, string | null];
};

export function declensionNoun(
  rawNoun: string,
  rawAdd: string,
  originGender: Noun['gender'],
  animated: boolean,
  isPlural: boolean,
  isSingular: boolean,
  isIndeclinable: boolean,
): SteenNounParadigm | null {
  // remove square brackets
  let noun = removeBrackets(rawNoun, '[', ']');
  // now we don't know how to decline the phrases
  if (noun.includes(' ')) {
    return null;
  }
  //indeclinable
  if (isIndeclinable) {
    return {
      nom: [noun, noun],
      acc: [noun, noun],
      gen: [noun, noun],
      loc: [noun, noun],
      dat: [noun, noun],
      ins: [noun, noun],
      voc: [noun, noun],
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
  } else if (add && ['-ogo', '-ego', '-oj', '-ej'].indexOf(add) !== -1) {
    return declensionSubstAdj(noun, add, originGender, animated);
  }

  if (add && noun !== add) {
    noun = markFluentVowel(noun, add);
  } else if (originGender === 'masculine') {
    noun = inferFluentVowel(noun);
  }

  const rawGender = prepareGender(originGender, animated);

  noun = noun.replace(/[ńň]$/, 'nj');
  noun = noun.replace(/[ľĺ]$/, 'lj');
  noun =
    noun.slice(0, -2) + noun.slice(-2).replace(/([cšžčćńľŕťďśźj])/g, '$1ь');

  const nounWithoutFluent = noun.replace(/\([oe]\)/, '');

  noun = noun.replace('(e)', 'ė').replace('(o)', 'ȯ');

  const gender = establishGender(noun, rawGender);
  const root = establish_root(nounWithoutFluent, gender);
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

function establish_root(noun: string, gender: string) {
  let result = '';
  /*if ((noun == 'den') || (noun == 'dėn') || (noun == 'denjь') || (noun == 'dėnjь')) {
        result = 'dn';
    }*/

  const fluentVowelIndex = Math.max(
    noun.lastIndexOf('ė'),
    noun.lastIndexOf('ȯ'),
  );

  const hasVowelEnding = AEEO$.test(noun);

  if (noun == 'lėv' || noun == 'lev') {
    result = 'ljv';
  } else if (noun == 'Lėv' || noun == 'Lev') {
    result = 'Ljv';
  } else if (
    gender.charAt(0) == 'm' &&
    noun.match(/[eė]cь$/) &&
    (noun.slice(-5, -4).match(/[aeiouyęųåėěȯrŕ]/) ||
      noun.slice(-4, -3).match(/[jdtc]/))
  ) {
    result = noun.slice(0, -3) + 'cь';
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
  } else if (gender == 'f2' && noun.slice(-1) === 'ь') {
    /*else if (noun.slice(-2) === 'um') {
        result = (noun.substring(0, noun.length - 2));
    }*/
    /*	else if ((gender == 'f2') && (noun.lastIndexOf('ь') == noun.length - 1))
            { result = (noun.substring (0, noun.length - 1)); } */
    result = noun + 'ь';
  } else {
    result = noun;
  }

  if (!hasVowelEnding && fluentVowelIndex > result.length - 3) {
    result = replaceStringAt(result, fluentVowelIndex, '');
  }

  return result;
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

function nominative_sg(noun: string, root: string, gender: string) {
  let result = '';
  if (gender == 'f2') {
    result = root;
  }
  if (gender == 'f3') {
    result = noun;
  } else if (gender == 'm3' && root == 'dn') {
    result = 'den / denj';
  } else if (gender == 'm3') {
    result = root + ' / ' + root + 'j';
  } else {
    result = noun;
  }
  result = rules(result);
  return result;
}

function accusative_sg(noun: string, root: string, gender: string) {
  let result = '';
  if (gender == 'm1') {
    result = root + 'a';
  } else if (gender == 'f1') {
    result = root + 'ų';
  } else {
    result = noun;
  }
  result = rules(result);
  return result;
}

function genitive_sg(root: string, gender: string) {
  let result = '';
  if (gender == 'm1' || gender == 'm2' || gender == 'n1') {
    result = root + 'a';
  } else if (gender == 'f1') {
    result = root + 'y';
  } else if (gender == 'f2') {
    result = root + 'i';
  } else if (gender == 'f3') {
    result = root + 'e / ' + root + 'i';
  } else if (gender == 'm3') {
    result = root + 'e / ' + root + 'ja';
  } else if (gender == 'n2') {
    result = root + 'e / ' + root + 'a';
  } else if (gender == 'n3') {
    result = root + 'a / ' + palatalizationEnding(root) + 'ese';
  }
  result = rules(result);
  return result;
}

function dative_sg(root: string, gender: string) {
  let result = '';
  if (gender == 'm1' || gender == 'm2' || gender == 'n1') {
    result = root + 'u';
  } else if (gender == 'f1') {
    result = root + 'ě';
  } else if (gender == 'f2') {
    result = root + 'i';
  } else if (gender == 'f3') {
    result = root + 'i';
  } else if (gender == 'm3') {
    result = root + 'i / ' + root + 'ju';
  } else if (gender == 'n2') {
    result = root + 'i / ' + root + 'u';
  } else if (gender == 'n3') {
    result = root + 'u / ' + palatalizationEnding(root) + 'esi';
  }
  result = rules(result);
  return result;
}

function instrumental_sg(root: string, gender: string) {
  let result = '';
  if (gender == 'm1' || gender == 'm2' || gender == 'n1') {
    result = root + 'om';
  } else if (gender == 'f1') {
    result = root + 'ojų';
  } else if (gender == 'f2') {
    result = root + 'jų';
  } else if (
    gender == 'f3' &&
    root.endsWith('v') &&
    !VOWELS.has(root.slice(-2, -1))
  ) {
    result = root.substring(0, root.length - 1) + 'ȯvjų';
  } else if (gender == 'f3') {
    result = root + 'jų';
  } else if (gender == 'm3') {
    result = root + 'em / ' + root + 'jem';
  } else if (gender == 'n2') {
    result = root + 'em / ' + root + 'om';
  } else if (gender == 'n3') {
    result = root + 'om / ' + palatalizationEnding(root) + 'esem';
  }
  result = rules(result);
  return result;
}

function locative_sg(root: string, gender: string) {
  let result = '';
  if (gender == 'm1' || gender == 'm2' || gender == 'n1') {
    result = root + 'u';
  } else if (gender == 'f1') {
    result = root + 'ě';
  } else if (gender == 'f2') {
    result = root + 'i';
  } else if (gender == 'f3') {
    result = root + 'i';
  } else if (gender == 'm3') {
    result = root + 'i / ' + root + 'ju';
  } else if (gender == 'n2') {
    result = root + 'i / ' + root + 'u';
  } else if (gender == 'n3') {
    result = root + 'u / ' + palatalizationEnding(root) + 'esi';
  }
  result = rules(result);
  return result;
}

function vocative_sg(nom_sg: string, root: string, gender: string) {
  let result = '';
  if (gender == 'm1' || gender == 'm2') {
    if (nom_sg.lastIndexOf('ec') == nom_sg.length - 2) {
      result = root.substring(0, root.length - 2) + 'če';
    } else if (root.lastIndexOf('ь') == root.length - 1) {
      result = root + 'u';
    } else if (root.lastIndexOf('k') == root.length - 1) {
      result = root.substring(0, root.length - 1) + 'če';
    } else if (root.lastIndexOf('g') == root.length - 1) {
      result = root.substring(0, root.length - 1) + 'že';
    } else if (root.lastIndexOf('h') == root.length - 1) {
      result = root.substring(0, root.length - 1) + 'še';
    } else {
      result = root + 'e';
    }
  } else if (gender == 'f1') {
    result = root + '#o';
  } else if (gender == 'f2') {
    result = root + '#i';
  } else if (root == 'dn') {
    result = 'den / dnju';
  } else if (gender == 'm3') {
    result = root + ' / ' + root + 'ju';
  } else {
    result = nom_sg;
    return result;
  }
  result = rules(result);
  return result;
}

function nominative_pl(root: string, gender: string) {
  let result = '';
  if (gender == 'n3') {
    result = root + 'a / ' + palatalizationEnding(root) + 'esa';
  } else if (root == 'očь' || root == 'ušь') {
    result = root + 'i / ' + root + 'esa';
  } else if (gender.charAt(0) == 'n') {
    result = root + 'a';
  } else if (gender == 'm1') {
    result = root + 'i';
  } else if (gender == 'f1' || gender == 'm2') {
    result = root + 'y';
  } else if (gender == 'm3') {
    result = root + 'i / ' + root + 'je';
  } else {
    result = root + 'i';
  }
  result = rules(result);
  return result;
}

function accusative_pl(nom_pl: string, gen_pl: string, gender: string) {
  let result = '';
  if (gender == 'm1') {
    result = gen_pl;
  } else {
    result = nom_pl;
  }
  return result;
}

function genitive_pl(root: string, gender: string) {
  let result = '';
  if (gender == 'f1' || root == 'morjь' || root == 'poljь') {
    result = root.replace('ь', '%');
    result = result.replace(/([pbvfmlnr])j%/, '$1ej');
    result = result + '%';
  } else if (root === 'st') {
    result = 'sȯt';
  } else if (gender.charAt(0) == 'n') {
    result =
      root.replace('ь', '%').replace(/([pbvfmlnrszńľŕťďśźščž])j%/, '$1ij') +
      '%';
    if (gender == 'n3') {
      result = result + ' / ' + palatalizationEnding(root) + 'es';
    }
  } else if (gender == 'm3') {
    result = root + 'ev / ' + root + 'jev';
  } else if (gender.charAt(0) == 'm') {
    result = root + 'ov';
  } else if (root == 'očь' || root == 'ušь') {
    result = root + 'ij / ' + root + 'es';
  } else {
    result = root + 'ij';
  }
  return rules(plural_gen_ending(result));
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

function dative_pl(root: string, gender: string) {
  let result = '';
  if (gender == 'm3') {
    result = root + 'am / ' + root + 'jam';
  } else if (gender == 'n3') {
    result = root + 'am / ' + palatalizationEnding(root) + 'esam';
  } else {
    result = root + 'am';
  }
  result = rules(result);
  return result;
}

function instrumental_pl(root: string, gender: string) {
  let result = '';
  if (gender == 'm3') {
    result = root + 'ami / ' + root + 'jami';
  } else if (gender == 'n3') {
    result = root + 'ami / ' + palatalizationEnding(root) + 'esami';
  } else {
    result = root + 'ami';
  }
  result = rules(result);
  return result;
}

function locative_pl(root: string, gender: string) {
  let result = '';
  if (gender == 'm3') {
    result = root + 'ah / ' + root + 'jah';
  } else if (gender == 'n3') {
    result = root + 'ah / ' + palatalizationEnding(root) + 'esah';
  } else {
    result = root + 'ah';
  }
  result = rules(result);
  return result;
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
    .replace('cy', 'ci');
}

function declensionPluralNoun(
  word: string,
  add: string,
  gender: string,
): SteenNounParadigm | null {
  const wordWithoutLast = word.slice(0, -1);
  if (add.slice(-2) === 'yh' || add.slice(-2) === 'ih') {
    const iOrY = add.slice(-2) === 'yh' ? 'y' : 'i';

    return {
      nom: [null, word],
      acc: [null, word],
      gen: [null, wordWithoutLast + iOrY + 'h'],
      loc: [null, wordWithoutLast + iOrY + 'h'],
      dat: [null, wordWithoutLast + iOrY + 'm'],
      ins: [null, wordWithoutLast + iOrY + 'mi'],
      voc: [null, word],
    };
  } else if (add) {
    return null;
  } else if (gender === 'masculine' && word.match(/[iye]$/)) {
    return {
      nom: [null, word],
      acc: [null, word],
      gen: [null, wordWithoutLast + 'ov'],
      loc: [null, wordWithoutLast + 'ah'],
      dat: [null, wordWithoutLast + 'am'],
      ins: [null, wordWithoutLast + 'ami'],
      voc: [null, word],
    };
  } else if (
    (gender === 'feminine' && word.match(/[ye]$/)) ||
    (gender === 'neuter' && word.match(/[a]$/))
  ) {
    return {
      nom: [null, word],
      acc: [null, word],
      gen: [null, rules(plural_gen_ending(wordWithoutLast + '%'))],
      loc: [null, wordWithoutLast + 'ah'],
      dat: [null, wordWithoutLast + 'am'],
      ins: [null, wordWithoutLast + 'ami'],
      voc: [null, word],
    };
  } else if (gender === 'feminine' && word.match(/[i]$/)) {
    return {
      nom: [null, word],
      acc: [null, word],
      gen: [null, wordWithoutLast + 'ij'],
      loc: [null, wordWithoutLast + 'ah'],
      dat: [null, wordWithoutLast + 'am'],
      ins: [null, wordWithoutLast + 'ami'],
      voc: [null, word],
    };
  }
  return null;
}

function declensionSubstAdj(
  word: string,
  add: string,
  gender: Noun['gender'],
  animated: boolean,
): SteenNounParadigm | null {
  if (gender === 'masculine' || gender === 'neuter') {
    const adjectiveParadigm = declensionAdjective(
      word.slice(0, -1) + (add === '-ogo' ? 'y' : 'i'),
      '',
    );
    const animatedCol = animated ? 0 : 1;

    return {
      nom: [
        word,
        adjectiveParadigm.plural.nom[0].split('/')[animatedCol].trim(),
      ],
      acc: [
        adjectiveParadigm.singular.acc[0].split('/')[animatedCol].trim(),
        adjectiveParadigm.plural.acc[0].split('/')[animatedCol].trim(),
      ],
      gen: [adjectiveParadigm.singular.gen[0], adjectiveParadigm.plural.gen[0]],
      loc: [adjectiveParadigm.singular.loc[0], adjectiveParadigm.plural.loc[0]],
      dat: [adjectiveParadigm.singular.dat[0], adjectiveParadigm.plural.dat[0]],
      ins: [adjectiveParadigm.singular.ins[0], adjectiveParadigm.plural.ins[0]],
      voc: [
        word,
        adjectiveParadigm.plural.nom[0].split('/')[animatedCol].trim(),
      ],
    };
  } else {
    const adjectiveParadigm = declensionAdjective(
      word.slice(0, -1) + (add === '-oj' ? 'y' : 'i'),
      '',
    );

    return {
      nom: [word, adjectiveParadigm.plural.nom[1]],
      acc: [adjectiveParadigm.singular.acc[1], adjectiveParadigm.plural.acc[1]],
      gen: [adjectiveParadigm.singular.gen[1], adjectiveParadigm.plural.gen[0]],
      loc: [adjectiveParadigm.singular.loc[1], adjectiveParadigm.plural.loc[0]],
      dat: [adjectiveParadigm.singular.dat[1], adjectiveParadigm.plural.dat[0]],
      ins: [adjectiveParadigm.singular.ins[1], adjectiveParadigm.plural.ins[0]],
      voc: [word, adjectiveParadigm.plural.nom[1]],
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
