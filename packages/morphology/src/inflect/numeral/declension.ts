import type {
  AdapterResult,
  Features,
  TokenFeatures,
  XPOS,
} from '@interslavic/conllu';
import { parseXPos } from '../../steen/index.ts';
import { declineAdjective, type AdjectiveCell } from '../adjective/index.ts';
import { stripDiacritics } from '../../orthography/index.ts';
import { CASES, declineNoun } from '../noun/index.ts';
import { type Noun, parsePos } from '../../partOfSpeech/index.ts';
import { transliterate } from '@interslavic/translit';

/** One column of one case: the forms that fill it and what they differ in. */
export type NumeralCell = Array<{ form: string; feats?: TokenFeatures }>;

export interface NumeralParadigm {
  type: string;
  columns?: string[];
  cases?: Record<string, NumeralCell[]>;
  casesSingular?: Record<string, AdjectiveCell[]>;
  casesPlural?: Record<string, AdjectiveCell[]>;
}

/**
 * A slash in the table below means one of two things, and the table is not
 * consistent about the order, so each word says which it is rather than
 * leaving it to be worked out from the forms.
 *
 * `dva` prints its inanimate accusative first and `tri` its animate one — no
 * rule, just how the list was written. `tysęć` is different again: it is a
 * masculine and a feminine noun sharing a lemma, so its slash separates
 * genders and does so in every case, not only the accusative.
 */
const ANIMATE_FIRST = [
  { Animacy: 'Anim' },
  { Animacy: 'Inan' },
] as const satisfies readonly [TokenFeatures, TokenFeatures];

const INANIMATE_FIRST = [
  { Animacy: 'Inan' },
  { Animacy: 'Anim' },
] as const satisfies readonly [TokenFeatures, TokenFeatures];

const BY_GENDER = [
  { Gender: 'Masc' },
  { Gender: 'Fem' },
] as const satisfies readonly [TokenFeatures, TokenFeatures];

type Pair = readonly [TokenFeatures, TokenFeatures];

/** Keyed by word, then by the case index used in `exclusionList`. */
const EXCLUSION_PAIRS: Record<string, Record<number, Pair>> = {
  dva: { 1: INANIMATE_FIRST },
  oba: { 1: INANIMATE_FIRST },
  obadva: { 1: INANIMATE_FIRST },
  obydva: { 1: INANIMATE_FIRST },
  tri: { 1: ANIMATE_FIRST },
  cetyri: { 1: ANIMATE_FIRST },
  tysec: {
    0: BY_GENDER,
    1: BY_GENDER,
    2: BY_GENDER,
    3: BY_GENDER,
    4: BY_GENDER,
    5: BY_GENDER,
  },
};

function numeralCell(rendered: string, pair?: Pair): NumeralCell {
  const forms = rendered.split('/').map((part) => part.trim());
  return forms.map((form, index) =>
    pair && forms.length === 2 ? { form, feats: pair[index] } : { form },
  );
}

const exclusionList = {
  /* N A G D I L */
  dva: [
    'dva|dvě',
    'dva / dvoh|dvě',
    'dvoh',
    'dvom',
    'dvoma',
    'dvoh',
    ['masculine', 'feminine/neuter'],
  ],
  oba: [
    'oba|obě',
    'oba / oboh|obě',
    'oboh',
    'obom',
    'oboma',
    'oboh',
    ['masculine', 'feminine/neuter'],
  ],
  obadva: [
    'obadva|obadvě',
    'obadva / obadvoh|obadvě',
    'obadvoh',
    'obadvom',
    'obadvoma',
    'obadvoh',
    ['masculine', 'feminine/neuter'],
  ],
  obydva: [
    'obydva|obydvě',
    'obydva / obydvoh|obydvě',
    'obydvoh',
    'obydvom',
    'obydvoma',
    'obydvoh',
    ['masculine', 'feminine/neuter'],
  ],
  tri: ['tri', 'trěh / tri', 'trěh', 'trěm', 'trěmi', 'trěh', ['plural']],
  cetyri: [
    'četyri',
    'četyrěh / četyri',
    'četyrěh',
    'četyrěm',
    'četyrěmi',
    'četyrěh',
    ['plural'],
  ],
  dveste: [
    'dvěstě',
    'dvěstě',
    'dvohsȯt',
    'dvomstam',
    'dvomastami',
    'dvohstah',
    ['plural'],
  ],
  trista: [
    'trista',
    'trista',
    'trěhsȯt',
    'trěmstam',
    'trěmistami',
    'trěhstah',
    ['plural'],
  ],
  cetyrista: [
    'četyrista',
    'četyrista',
    'četyrěhsȯt',
    'četyrěmstam',
    'četyrěmistami',
    'četyrěhstah',
    ['plural'],
  ],
  petsot: [
    'pęťsȯt',
    'pęťsȯt',
    'pętisȯt',
    'pętistam',
    'pęťjųstami',
    'pętistah',
    ['plural'],
  ],
  sestsot: [
    'šesťsȯt',
    'šesťsȯt',
    'šesťsȯt',
    'šestistam',
    'šesťjųstami',
    'šestistah',
    ['plural'],
  ],
  sedmsot: [
    'sedmsȯt',
    'sedmsȯt',
    'sedmsȯt',
    'sedmistam',
    'sedmjųstami',
    'sedmistah',
    ['plural'],
  ],
  osmsot: [
    'osmsȯt',
    'osmsȯt',
    'osmsȯt',
    'osmistam',
    'osmjųstami',
    'osmistah',
    ['plural'],
  ],
  devetsot: [
    'devęťsȯt',
    'devęťsȯt',
    'devęťsȯt',
    'devętistam',
    'devęťjųstami',
    'devętistah',
    ['plural'],
  ],
  tysec: [
    'tysęć|tysęće / tysęći',
    'tysęć|tysęće / tysęći',
    'tysęća / tysęći|tysęćev / tysęćij',
    'tysęću / tysęći|tysęćam',
    'tysęćem / tysęćjų|tysęćami',
    'tysęću / tysęći|tysęćah',
    ['singular (m./f.)', 'plural (m./f.)'],
  ],
} as Record<
  string,
  [
    nom: string,
    acc: string,
    gen: string,
    dat: string,
    ins: string,
    loc: string,
    columns: string[],
  ]
>;

function getExclusionForm(
  rawWord: string,
  caseIndex: number,
  formColumns: number,
): NumeralCell[] {
  const wordForms = exclusionList[rawWord][caseIndex as 0].split('|');
  const pair = EXCLUSION_PAIRS[rawWord]?.[caseIndex];
  const resForms: NumeralCell[] = [];
  for (let i = 0; i < formColumns; i++) {
    resForms.push(
      numeralCell(
        wordForms[i < wordForms.length ? i : wordForms.length - 1],
        pair,
      ),
    );
  }
  return resForms;
}

export function declineNumeral(
  rawWord: string,
  numeralType: string,
): NumeralParadigm | null {
  // now we don't know how to decline the phrases
  if (rawWord.includes(' ')) {
    return null;
  }
  const word = getLatin(rawWord);
  let declensionType = '';
  let details = '';
  if (numeralType === 'cardinal') {
    // work with exclusion list
    if (exclusionList[word]) {
      const columns = exclusionList[word][6];
      return {
        type: 'noun',
        columns: exclusionList[word][6],
        cases: {
          nom: getExclusionForm(word, 0, columns.length),
          acc: getExclusionForm(word, 1, columns.length),
          gen: getExclusionForm(word, 2, columns.length),
          loc: getExclusionForm(word, 5, columns.length),
          dat: getExclusionForm(word, 3, columns.length),
          ins: getExclusionForm(word, 4, columns.length),
        },
      };
    } else if (word === 'jedin') {
      declensionType = 'adjective';
    } else if (word.match(/[tm]$/)) {
      declensionType = 'noun';
      details = 'f.sg.';
    } else if (word === 'nula') {
      declensionType = 'noun';
      details = 'f.';
    } else if (word.match(/[nd]$/)) {
      declensionType = 'noun';
      details = 'm.';
    } else if (word === 'sto') {
      declensionType = 'noun';
      details = 'n.';
    } else if (word.match(/sto$/)) {
      // indeclinable
      return {
        type: 'noun',
        columns: ['plural'],
        cases: {
          nom: [numeralCell(rawWord)],
          acc: [numeralCell(rawWord)],
          gen: [numeralCell(rawWord)],
          loc: [numeralCell(rawWord)],
          dat: [numeralCell(rawWord)],
          ins: [numeralCell(rawWord)],
        },
      };
    }
  } else if (numeralType === 'collective') {
    const iOrY = rawWord.slice(-1) === 'o' ? 'y' : 'i';
    const stem = rawWord.slice(0, -1) + iOrY;
    return {
      type: 'noun',
      columns: ['plural'],
      cases: {
        nom: [numeralCell(rawWord)],
        // `četveryh` borrowed from the genitive for an animate, `četvero` from
        // the nominative for anything else.
        acc: [numeralCell(`${stem}h / ${rawWord}`, ANIMATE_FIRST)],
        gen: [numeralCell(stem + 'h')],
        loc: [numeralCell(stem + 'h')],
        dat: [numeralCell(stem + 'm')],
        ins: [numeralCell(stem + 'mi')],
      },
    };
  } else if (numeralType === 'fractional' || numeralType === 'substantivized') {
    declensionType = 'noun';
    details = 'f.';
  } else if (
    numeralType === 'differential' ||
    numeralType === 'multiplicative' ||
    numeralType === 'ordinal'
  ) {
    declensionType = 'adjective';
  }

  const substantival =
    numeralType === 'fractional' || numeralType === 'substantivized';

  if (declensionType === 'noun') {
    // `details` is one of the four tags set above, and none of them is plural.
    const { gender, singular } = parsePos(details) as Noun;
    const nounParadigm = declineNoun(
      rawWord,
      '',
      gender,
      false,
      false,
      singular,
      false,
    )!;

    // Only a cardinal is declined in the singular alone (`pęť`, `šesť`), and a
    // cardinal is the one kind that gets no vocative, so this table has six
    // cases where the one below has seven.
    if (singular) {
      return {
        type: 'noun',
        columns: ['singular'],
        cases: {
          nom: [numeralCell(rawWord)],
          acc: [nounParadigm.acc[0]!],
          gen: [nounParadigm.gen[0]!],
          loc: [nounParadigm.loc[0]!],
          dat: [nounParadigm.dat[0]!],
          ins: [nounParadigm.ins[0]!],
        },
      };
    } else {
      return {
        type: 'noun',
        columns: ['singular', 'plural'],
        cases: {
          nom: [numeralCell(rawWord), nounParadigm.nom[1]!],
          acc: [nounParadigm.acc[0]!, nounParadigm.acc[1]!],
          gen: [nounParadigm.gen[0]!, nounParadigm.gen[1]!],
          loc: [nounParadigm.loc[0]!, nounParadigm.loc[1]!],
          dat: [nounParadigm.dat[0]!, nounParadigm.dat[1]!],
          ins: [nounParadigm.ins[0]!, nounParadigm.ins[1]!],
          // A vocative belongs to the numerals that are nouns and can be
          // addressed: `četverko`, `četvŕtino`. A cardinal declines like the
          // i-stem `kosť` in the oblique cases but stays a quantifier, so it
          // gets none.
          ...(substantival
            ? { voc: [nounParadigm.voc[0]!, nounParadigm.voc[1]!] }
            : {}),
        },
      };
    }
  } else if (declensionType === 'adjective') {
    const adjectiveParadigm = declineAdjective(rawWord, '');
    return {
      type: 'adjective',
      casesSingular: adjectiveParadigm.singular,
      casesPlural: adjectiveParadigm.plural,
    };
  }

  return null;
}

function getLatin(word: string): string {
  const latin = transliterate(word, 'isv-Latn');
  return stripDiacritics(latin);
}

/**
 * The gender of a cardinal is not in its paradigm — `pęť` is declined as a
 * feminine noun and `sto` as a neuter one without ever saying so — so it is
 * read back off the ending, which is what decides the declension in the first
 * place.
 */
function cardinalGender(word: string): Features.Gender | undefined {
  const latin = transliterate(word, 'isv-Latn');
  if (latin === 'nula') return 'Fem';
  if (latin === 'sto' || latin.endsWith('sto')) return 'Neut';
  if (/[tm]$/.test(latin)) return 'Fem';
  if (/[nd]$/.test(latin)) return 'Masc';
  return undefined;
}

export function inflectNumeral(
  word: string,
  xpos: XPOS,
): AdapterResult<'NUM' | 'ADJ' | 'NOUN'> {
  const variants = parseXPos(word, xpos);
  const results: AdapterResult<'NUM' | 'ADJ' | 'NOUN'> = [];

  for (const [upos, baseFeats] of variants) {
    if (upos !== 'NUM' && upos !== 'ADJ' && upos !== 'NOUN') continue;

    const posInfo = parsePos(xpos);
    if (posInfo.name !== 'numeral') continue;

    const paradigm = declineNumeral(word, posInfo.type);

    if (!paradigm) {
      results.push({ form: word, upos, feats: baseFeats });
      continue;
    }

    const push = (cell: NumeralCell, feats: TokenFeatures) => {
      for (const form of cell) {
        results.push({
          form: form.form,
          upos,
          feats: { ...baseFeats, ...feats, ...form.feats },
        });
      }
    };

    if (paradigm.type === 'noun' && paradigm.cases) {
      const columns = paradigm.columns!;
      const hasBoth =
        columns.includes('singular') && columns.includes('plural');
      const isPluralOnly = columns.length === 1 && columns[0] === 'plural';

      const gender =
        posInfo.type === 'fractional' || posInfo.type === 'substantivized'
          ? ('Fem' as const)
          : posInfo.type === 'cardinal'
            ? cardinalGender(word)
            : undefined;
      const genderFeat = gender ? { Gender: gender } : {};

      // Every noun table above names its cases and its columns, so both
      // lookups answer.
      for (const [caseName, cells] of Object.entries(paradigm.cases)) {
        const Case = CASES[caseName as keyof typeof CASES];

        if (hasBoth) {
          push(cells[0], { Case, Number: 'Sing', ...genderFeat });
          push(cells[1], { Case, Number: 'Plur', ...genderFeat });
          continue;
        }

        const number = isPluralOnly
          ? { Number: 'Plur' as const }
          : columns.includes('singular')
            ? { Number: 'Sing' as const }
            : {};

        for (const cell of cells)
          push(cell, { Case, ...number, ...genderFeat });
      }
    } else if (paradigm.type === 'adjective') {
      // Same layout as an adjective: three genders in the singular nominative
      // and accusative, masculine and neuter merged elsewhere, and a plural
      // that keeps the masculine apart only where animacy shows.
      for (const [caseName, slots] of Object.entries(
        paradigm.casesSingular ?? {},
      )) {
        const Case = CASES[caseName as keyof typeof CASES];
        if (!Case) continue;

        const merged = caseName !== 'nom' && caseName !== 'acc';
        push(slots[0], { Case, Number: 'Sing', Gender: 'Masc' });
        push(merged ? slots[0] : slots[1], {
          Case,
          Number: 'Sing',
          Gender: 'Neut',
        });
        push(merged ? slots[1] : slots[2], {
          Case,
          Number: 'Sing',
          Gender: 'Fem',
        });
      }

      for (const [caseName, slots] of Object.entries(
        paradigm.casesPlural ?? {},
      )) {
        const Case = CASES[caseName as keyof typeof CASES];
        if (!Case) continue;

        if (caseName === 'nom' || caseName === 'acc') {
          push(slots[0], { Case, Number: 'Plur', Gender: 'Masc' });
          push(slots[1], { Case, Number: 'Plur', Gender: 'Neut' });
          push(slots[1], { Case, Number: 'Plur', Gender: 'Fem' });
        } else {
          push(slots[0], { Case, Number: 'Plur' });
        }
      }
    }
  }

  return results;
}
