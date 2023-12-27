import { declensionAdjective } from '../adjective';
import { stripDiacritics } from '../common';
import transliterate from '../transliterate';

/** @deprecated */
export interface SteenPronounParadigm {
  type: string;
  columns?: string[];
  cases?: Record<string, any>;
  casesSingular?: Record<string, any>;
  casesPlural?: Record<string, any>;
}

export function declensionPronounFlat(rawWord: string, pronounType: string) {
  const paradigm = declensionPronoun(rawWord, pronounType);
  return paradigm ? getDeclensionPronounFlat(paradigm) : [];
}

function getDeclensionPronounFlat(result: SteenPronounParadigm): string[] {
  if (!result) {
    return [];
  }
  const forms: any = [];
  if (result.cases) {
    forms.push(...Object.values(result.cases));
  }
  if (result.casesSingular) {
    forms.push(...Object.values(result.casesSingular));
  }
  if (result.casesPlural) {
    forms.push(...Object.values(result.casesPlural));
  }
  const dirty: string[] = forms
    .flat()
    .join('/')
    .replace(/ /g, '')
    .split('/')
    .filter(Boolean)
    .reduce((acc: string[], item: string) => {
      if (item.indexOf('(') !== -1 || item.indexOf(')') !== -1) {
        acc.push(item.replace(/[()]/g, ''));
        acc.push(item.replace(/\(.*\)/, ''));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
  return Array.from(new Set(dirty));
}

export function declensionPronoun(
  rawWord: string,
  pronounType: string,
): SteenPronounParadigm | null {
  // now we don't know how to decline the phrases
  if (rawWord.includes(' ')) {
    return null;
  }

  const word = stripDiacritics(transliterate(rawWord, 'art-Latn-x-interslv'));
  if (pronounType === 'personal' || pronounType === 'reflexive') {
    if (
      [
        'ja',
        'mene',
        'me',
        'mne',
        'mi',
        'mnoju',
        'my',
        'nas',
        'nam',
        'nami',
      ].includes(word)
    ) {
      return {
        type: 'noun',
        columns: ['singular', 'plural'],
        cases: {
          nom: ['ja', 'my'],
          acc: ['mene (mę)', 'nas'],
          gen: ['mene', 'nas'],
          loc: ['mně', 'nas'],
          dat: ['mně (mi)', 'nam'],
          ins: ['mnojų', 'nami'],
        },
      };
    } else if (
      [
        'ty',
        'tebe',
        'te',
        'tobe',
        'ti',
        'toboju',
        'vy',
        'vas',
        'vam',
        'vami',
      ].includes(word)
    ) {
      return {
        type: 'noun',
        columns: ['singular', 'plural'],
        cases: {
          nom: ['ty', 'vy'],
          acc: ['tebe (tę)', 'vas'],
          gen: ['tebe', 'vas'],
          loc: ['tobě', 'vas'],
          dat: ['tobě (ti)', 'vam'],
          ins: ['tobojų', 'vami'],
        },
      };
    } else if (
      [
        'on',
        'jego',
        'go',
        'je',
        'jemu',
        'mu',
        'njim',
        'ona',
        'ju',
        'jej',
        'jeju',
        'njeju',
        'oni',
        'one',
        'jih',
        'jim',
        'njimi',
      ].includes(word)
    ) {
      return {
        type: 'adjective',
        casesSingular: {
          nom: ['on', 'ono', 'ona'],
          acc: ['(n)jego (go)', '(n)jego (go)', '(n)jų'],
          gen: ['(n)jego', '(n)jej'],
          loc: ['(n)jem', '(n)jej'],
          dat: ['(n)jemu (mu)', '(n)jej'],
          ins: ['(n)jim', '(n)jejų'],
        },
        casesPlural: {
          nom: ['oni / one', 'one'],
          acc: ['(n)jih / (n)je', '(n)je'],
          gen: ['(n)jih'],
          loc: ['(n)jih'],
          dat: ['(n)jim'],
          ins: ['(n)jimi'],
        },
      };
    } else if (['sebe', 'se', 'sobe', 'si', 'soboju'].includes(word)) {
      return {
        type: 'noun',
        columns: ['wordForm'],
        cases: {
          nom: [null],
          acc: ['sebę (sę)'],
          gen: ['sebe'],
          loc: ['sobě'],
          dat: ['sobě (si)'],
          ins: ['sobojų'],
        },
      };
    }
  } else if (
    pronounType === 'possessive' &&
    ['jih', 'jej', 'jego'].includes(word)
  ) {
    return {
      type: 'noun',
      columns: ['wordForm'],
      cases: {
        nom: [rawWord],
        acc: [rawWord],
        gen: [rawWord],
        loc: [rawWord],
        dat: [rawWord],
        ins: [rawWord],
      },
    };
  } else if (
    ['indefinite', 'interrogative', 'negative', 'relative'].includes(
      pronounType,
    ) &&
    (rawWord.includes('čto') ||
      rawWord.includes('kto') ||
      rawWord === 'kogo') &&
    !rawWord.includes('ktory')
  ) {
    let prefix = '';
    let postfix = '';
    let origWord = rawWord;
    if (rawWord === 'kogo') {
      origWord = 'kto';
    } else if (word.match(/koli$/)) {
      postfix = 'koli';
    } else if (word.match(/nebud$/)) {
      postfix = '-nebųď';
    } else if (word.match(/libo$/)) {
      postfix = '-libo';
    } else if (word.match(/^ino/)) {
      prefix = 'ino';
    } else if (word.match(/^ne/)) {
      prefix = 'ně';
    } else if (word.match(/^ni/)) {
      prefix = 'ni';
    } else if (word.match(/^vse/)) {
      prefix = 'vse';
    }
    if (origWord.match(/čto/)) {
      return {
        type: 'noun',
        columns: ['Word Form'],
        cases: {
          nom: [prefix + 'čto' + postfix],
          acc: [prefix + 'čego' + postfix],
          gen: [prefix + 'čego' + postfix],
          loc: [prefix + 'čem' + postfix],
          dat: [prefix + 'čemu' + postfix],
          ins: [prefix + 'čim' + postfix],
        },
      };
    } else if (origWord.match(/kto/)) {
      return {
        type: 'noun',
        columns: ['Word Form'],
        cases: {
          nom: [prefix + 'kto' + postfix],
          acc: [prefix + 'kogo' + postfix],
          gen: [prefix + 'kogo' + postfix],
          loc: [prefix + 'kom' + postfix],
          dat: [prefix + 'komu' + postfix],
          ins: [prefix + 'kym' + postfix],
        },
      };
    } else {
      return null;
    }
  } else if (pronounType === 'relative' && rawWord === 'iže') {
    return {
      type: 'adjective',
      casesSingular: {
        nom: ['iže', 'iže', 'iže'],
        acc: ['(n)jegože', '(n)jegože', '(n)jųže'],
        gen: ['(n)jegože', '(n)jejže'],
        loc: ['(n)jemže', '(n)jejže'],
        dat: ['(n)jemuže', '(n)jejže'],
        ins: ['(n)jimže', '(n)jejųže'],
      },
      casesPlural: {
        nom: ['iže', 'iže'],
        acc: ['(n)jihže / (n)ježe', '(n)ježe'],
        gen: ['(n)jihže'],
        loc: ['(n)jihže'],
        dat: ['(n)jimže'],
        ins: ['(n)jimiže'],
      },
    };
  } else if (
    [
      'demonstrative',
      'indefinite',
      'interrogative',
      'relative',
      'possessive',
      'negative',
      'universal',
    ].includes(pronounType)
  ) {
    const [origWord, postfix] = splitPostfix(rawWord, word);
    const adjectiveParadigm = declensionAdjective(origWord, postfix);
    return {
      type: 'adjective',
      casesSingular: adjectiveParadigm.singular,
      casesPlural: adjectiveParadigm.plural,
    };
  }
  return null;
}

const DEMONSTRATIVE_PRONOUNS: Record<string, string> = {
  ona: 'onoj',
  ono: 'onoj',
  ota: 'otoj',
  oto: 'otoj',
  ova: 'ov',
  ovo: 'ov',
  sa: 'sej',
  se: 'sej',
  tamta: 'tamtoj',
  tamto: 'tamtoj',
  tuta: 'tutoj',
  tuto: 'tutoj',
  ta: 'toj',
  to: 'toj',
  te: 'toj',
  vsi: 'veś',
  vse: 'veś',
};

const DEMONSTRATIVE_POSTFIXES: Record<string, string> = {
  ze: 'že',
  koli: 'koli',
  libo: '-libo',
  nebud: '-nebųď',
};

function splitPostfix(original: string, standard: string) {
  const [match = '', postfix = ''] =
    standard.match(/-?(nebud|koli|libo|ze)$/) || [];
  const main = original.slice(0, -match.length || undefined);

  return [
    DEMONSTRATIVE_PRONOUNS[main] || main,
    DEMONSTRATIVE_POSTFIXES[postfix] || postfix,
  ];
}
