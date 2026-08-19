import type {
  AdapterResult,
  Features,
  TokenFeatures,
  XPOS,
} from '@interslavic/conllu';
import { parseXPos } from '../../steen/index.ts';
import { parsePos } from '../../partOfSpeech/index.ts';
import {
  POSSESSOR_FEATURES,
  PRONOUN_FEATURE_OVERRIDES,
} from './pronoun-features.ts';
import { declineAdjective } from '../adjective/index.ts';
import { stripDiacritics } from '../../orthography/index.ts';
import { transliterate } from '@interslavic/translit';
import {
  ALONE,
  FIRST_PERSON,
  POSSESSIVE,
  REFLEXIVE,
  SECOND_PERSON,
  THIRD_PERSON,
} from './lookups.ts';

/** One slot of a pronoun's paradigm: the forms in it and what tells them apart. */
export type PronounCell = Array<{ form: string; feats?: TokenFeatures }>;

export interface PronounParadigm {
  type: string;
  columns?: string[];
  cases?: Record<string, Array<PronounCell | null>>;
  casesSingular?: Record<string, Array<PronounCell | null>>;
  casesPlural?: Record<string, Array<PronounCell | null>>;
}

/**
 * Which person a personal pronoun belongs to. The dictionary tag says only
 * `pron.pers.`, and every oblique form is its own entry — `jemu`, `mu`, `jih` —
 * so the person has to come from the same lists that pick the table. Only ask
 * for a `pron.pers.` lemma: `te` is the clitic accusative of `ty` and also the
 * plural of the demonstrative `tȯj`, and the demonstrative has no person.
 */
function personOf(rawWord: string): Features.Person | undefined {
  const word = stripDiacritics(transliterate(rawWord, 'isv-Latn'));
  if (FIRST_PERSON.includes(word)) return '1';
  if (SECOND_PERSON.includes(word)) return '2';
  if (THIRD_PERSON.includes(word)) return '3';
  return undefined;
}

/** A form with nothing in its slot to tell it apart from. */
function one(form: string): PronounCell {
  return [{ form }];
}

/**
 * A third-person form and the shape it takes after a preposition: `jego` on
 * its own, `njego` in `do njego`, and the same `n-` on `njej`, `njim`, `njih`.
 * One word, two environments, and neither form works in the other's — so both
 * readings sit in one slot and both say which environment they belong to.
 */
function afterPreposition(form: string): PronounCell {
  return [
    { form, feats: { PrepCase: 'Npr' } },
    { form: `n${form}`, feats: { PrepCase: 'Pre' } },
  ];
}

/**
 * The locative is the one case that is always governed by a preposition, so the
 * bare form of it never occurs — the grammar says so outright. Only the `n-`
 * shape exists, and it is still the after-preposition form, so it still says so.
 */
function onlyAfterPreposition(form: string): PronounCell {
  return [{ form: `n${form}`, feats: { PrepCase: 'Pre' } }];
}

/**
 * The clitic beside the full form — `mene (mę)`, `jemu (mu)`. It cannot be
 * stressed and cannot stand alone, which is what `Variant=Short` records.
 */
function withClitic(cell: PronounCell, clitic: string): PronounCell {
  return [...cell, { form: clitic, feats: { Variant: 'Short' } }];
}

/** Animate reading first, then inanimate; both keep whatever else they carry. */
function byAnimacy(animate: PronounCell, inanimate: PronounCell): PronounCell {
  const mark =
    (animacy: Features.Animacy) =>
    (reading: PronounCell[number]): PronounCell[number] => ({
      ...reading,
      feats: { Animacy: animacy, ...reading.feats },
    });

  return [...animate.map(mark('Anim')), ...inanimate.map(mark('Inan'))];
}

export function declinePronoun(
  rawWord: string,
  pronounType: string,
): PronounParadigm | null {
  // now we don't know how to decline the phrases
  if (rawWord.includes(' ')) {
    return null;
  }

  const word = stripDiacritics(transliterate(rawWord, 'isv-Latn'));
  if (pronounType === 'personal' || pronounType === 'reflexive') {
    if (FIRST_PERSON.includes(word)) {
      return {
        type: 'noun',
        columns: ['singular', 'plural'],
        cases: {
          nom: [one('ja'), one('my')],
          acc: [withClitic(one('mene'), 'mę'), one('nas')],
          gen: [one('mene'), one('nas')],
          loc: [one('mně'), one('nas')],
          dat: [withClitic(one('mně'), 'mi'), one('nam')],
          ins: [one('mnojų'), one('nami')],
        },
      };
    } else if (SECOND_PERSON.includes(word)) {
      return {
        type: 'noun',
        columns: ['singular', 'plural'],
        cases: {
          nom: [one('ty'), one('vy')],
          acc: [withClitic(one('tebe'), 'tę'), one('vas')],
          gen: [one('tebe'), one('vas')],
          loc: [one('tobě'), one('vas')],
          dat: [withClitic(one('tobě'), 'ti'), one('vam')],
          ins: [one('tobojų'), one('vami')],
        },
      };
    } else if (THIRD_PERSON.includes(word)) {
      return {
        type: 'adjective',
        casesSingular: {
          nom: [one('on'), one('ono'), one('ona')],
          acc: [
            withClitic(afterPreposition('jego'), 'go'),
            withClitic(afterPreposition('jego'), 'go'),
            afterPreposition('jų'),
          ],
          gen: [afterPreposition('jego'), afterPreposition('jej')],
          loc: [onlyAfterPreposition('jem'), onlyAfterPreposition('jej')],
          dat: [
            withClitic(afterPreposition('jemu'), 'mu'),
            afterPreposition('jej'),
          ],
          ins: [afterPreposition('jim'), afterPreposition('jejų')],
        },
        casesPlural: {
          nom: [byAnimacy(one('oni'), one('one')), one('one')],
          acc: [
            byAnimacy(afterPreposition('jih'), afterPreposition('je')),
            afterPreposition('je'),
          ],
          gen: [afterPreposition('jih')],
          loc: [onlyAfterPreposition('jih')],
          dat: [afterPreposition('jim')],
          ins: [afterPreposition('jimi')],
        },
      };
    } else if (REFLEXIVE.includes(word)) {
      return {
        type: 'noun',
        columns: ['wordForm'],
        cases: {
          nom: [null],
          acc: [withClitic(one('sebę'), 'sę')],
          gen: [one('sebe')],
          loc: [one('sobě')],
          dat: [withClitic(one('sobě'), 'si')],
          ins: [one('sobojų')],
        },
      };
    } else if (ALONE.includes(word)) {
      return {
        type: 'adjective',
        casesSingular: {
          nom: [one('sam'), one('samo'), one('sama')],
          acc: [
            byAnimacy(one('samogo'), one('sam')),
            byAnimacy(one('samogo'), one('samo')),
            one('samų'),
          ],
          gen: [one('samogo'), one('samogo'), one('samoj')],
          loc: [one('samom'), one('samom'), one('samoj')],
          dat: [one('samomu'), one('samomu'), one('samoj')],
          ins: [one('samym'), one('samym'), one('samojų')],
        },
        casesPlural: {
          nom: [byAnimacy(one('sami'), one('same')), one('same')],
          acc: [byAnimacy(one('samyh'), one('same')), one('same')],
          gen: [one('samyh')],
          loc: [one('samyh')],
          dat: [one('samym')],
          ins: [one('samymi')],
        },
      };
    }
  } else if (pronounType === 'possessive' && POSSESSIVE.includes(word)) {
    return {
      type: 'noun',
      columns: ['wordForm'],
      cases: {
        nom: [one(rawWord)],
        acc: [one(rawWord)],
        gen: [one(rawWord)],
        loc: [one(rawWord)],
        dat: [one(rawWord)],
        ins: [one(rawWord)],
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
          nom: [one(prefix + 'čto' + postfix)],
          acc: [one(prefix + 'čto' + postfix)],
          gen: [one(prefix + 'čego' + postfix)],
          loc: [one(prefix + 'čem' + postfix)],
          dat: [one(prefix + 'čemu' + postfix)],
          ins: [one(prefix + 'čim' + postfix)],
        },
      };
    } else if (origWord.match(/kto/)) {
      return {
        type: 'noun',
        columns: ['Word Form'],
        cases: {
          nom: [one(prefix + 'kto' + postfix)],
          acc: [one(prefix + 'kogo' + postfix)],
          gen: [one(prefix + 'kogo' + postfix)],
          loc: [one(prefix + 'kom' + postfix)],
          dat: [one(prefix + 'komu' + postfix)],
          ins: [one(prefix + 'kym' + postfix)],
        },
      };
    } else {
      return null;
    }
  } else if (pronounType === 'relative' && rawWord === 'iže') {
    return {
      type: 'adjective',
      casesSingular: {
        nom: [one('iže'), one('iže'), one('iže')],
        acc: [
          afterPreposition('jegože'),
          afterPreposition('jegože'),
          afterPreposition('jųže'),
        ],
        gen: [afterPreposition('jegože'), afterPreposition('jejže')],
        loc: [onlyAfterPreposition('jemže'), onlyAfterPreposition('jejže')],
        dat: [afterPreposition('jemuže'), afterPreposition('jejže')],
        ins: [afterPreposition('jimže'), afterPreposition('jejųže')],
      },
      casesPlural: {
        nom: [one('iže'), one('iže')],
        acc: [
          byAnimacy(afterPreposition('jihže'), afterPreposition('ježe')),
          afterPreposition('ježe'),
        ],
        gen: [afterPreposition('jihže')],
        loc: [onlyAfterPreposition('jihže')],
        dat: [afterPreposition('jimže')],
        ins: [afterPreposition('jimiže')],
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
    const adjectiveParadigm = declineAdjective(origWord, postfix);
    return {
      type: 'adjective',
      casesSingular: adjectiveParadigm.singular,
      casesPlural: adjectiveParadigm.plural,
    };
  }
  return null;
}

/**
 * A demonstrative stem, stripped of its diacritics by the lookup above, put
 * back the way the dictionary spells it — and, where the dictionary lists the
 * feminine and the neuter as their own entries, folded onto the masculine.
 *
 * `patches.ts` states the same fold for whole dictionary rows and runs first;
 * this one catches what is left after a postfix comes off (`tȯjže` → `tȯj`)
 * and callers that reach `inflect()` without normalizing.
 */
const DEMONSTRATIVE_STEMS: Record<string, string> = {
  ona: 'onȯj',
  ono: 'onȯj',
  onoj: 'onȯj',
  ota: 'otȯj',
  oto: 'otȯj',
  otoj: 'otȯj',
  ova: 'ov',
  ovo: 'ov',
  sa: 'sėj',
  se: 'sėj',
  sej: 'sėj',
  tamta: 'tamtȯj',
  tamto: 'tamtȯj',
  tamtoj: 'tamtȯj',
  tuta: 'tutȯj',
  tuto: 'tutȯj',
  tutoj: 'tutȯj',
  ta: 'tȯj',
  to: 'tȯj',
  toj: 'tȯj',
  te: 'tȯj',
  vsa: 'veś',
  vse: 'veś',
  vsi: 'veś',
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
    DEMONSTRATIVE_STEMS[main] || main,
    DEMONSTRATIVE_POSTFIXES[postfix] || postfix,
  ];
}

const CASES: Record<string, Features.Case> = {
  nom: 'Nom',
  acc: 'Acc',
  gen: 'Gen',
  dat: 'Dat',
  ins: 'Ins',
  loc: 'Loc',
};

export function inflectPronoun(
  word: string,
  xpos: XPOS,
): AdapterResult<'PRON' | 'DET'> {
  const posInfo = parsePos(xpos);
  if (posInfo.name !== 'pronoun') return [];

  const variants = parseXPos(word, xpos);
  const results: AdapterResult<'PRON' | 'DET'> = [];
  const lemmaOverrides = {
    ...PRONOUN_FEATURE_OVERRIDES[word],
    ...(posInfo.type === 'possessive' ? POSSESSOR_FEATURES[word] : undefined),
  };

  for (const [upos, baseFeats] of variants) {
    if (upos !== 'PRON' && upos !== 'DET') continue;

    const effectiveBaseFeats = { ...baseFeats, ...lemmaOverrides };
    const paradigm = declinePronoun(word, posInfo.type);

    if (!paradigm) {
      results.push({ form: word, upos, feats: effectiveBaseFeats });
      continue;
    }

    const person =
      (lemmaOverrides.Person as Features.Person | undefined) ??
      (posInfo.type === 'personal' ? personOf(word) : undefined);

    const push = (
      cell: PronounCell | null | undefined,
      feats: TokenFeatures,
    ) => {
      for (const form of cell ?? []) {
        results.push({
          form: form.form,
          upos,
          feats: {
            ...effectiveBaseFeats,
            ...feats,
            ...(person ? { Person: person } : {}),
            ...form.feats,
          },
        });
      }
    };

    if (paradigm.type === 'noun') {
      if (posInfo.type === 'possessive') {
        push([{ form: word }], {});
        continue;
      }

      const columns = paradigm.columns ?? [];
      const hasBoth =
        columns.includes('singular') && columns.includes('plural');

      for (const [caseName, cells] of Object.entries(paradigm.cases ?? {})) {
        const Case = CASES[caseName];
        if (!Case) continue;

        if (hasBoth) {
          push(cells[0], { Case, Number: 'Sing' });
          push(cells[1], { Case, Number: 'Plur' });
          continue;
        }

        const feats: TokenFeatures = { Case };
        if (lemmaOverrides.Number) {
          feats.Number = lemmaOverrides.Number;
        } else if (columns.includes('plural')) {
          feats.Number = 'Plur';
        } else if (columns.includes('singular')) {
          feats.Number = 'Sing';
        }
        // A reflexive has no number of its own — `sebe` serves both.
        if (effectiveBaseFeats.Reflex === 'Yes') delete feats.Number;

        for (const cell of cells) push(cell, feats);
      }
    } else if (paradigm.type === 'adjective') {
      for (const [caseName, slots] of Object.entries(
        paradigm.casesSingular ?? {},
      )) {
        const Case = CASES[caseName];
        if (!Case) continue;

        // Three slots keep the genders apart; two mean the masculine and the
        // neuter are the same form and only the feminine stands alone.
        const merged = slots.length === 2;
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
        const Case = CASES[caseName];
        if (!Case) continue;

        const [masculine, rest] = slots;
        const merged =
          !rest ||
          JSON.stringify(masculine?.map((f) => f.form)) ===
            JSON.stringify(rest.map((f) => f.form));

        if (merged) {
          push(masculine, { Case, Number: 'Plur' });
        } else {
          push(masculine, { Case, Number: 'Plur', Gender: 'Masc' });
          push(rest, { Case, Number: 'Plur', Gender: 'Neut' });
          push(rest, { Case, Number: 'Plur', Gender: 'Fem' });
        }
      }
    }
  }

  return results;
}

export function declinePronounSimple(lemma: string, morphology: string) {
  const pos = parsePos(morphology);
  if (pos.name !== 'pronoun')
    throw new TypeError(`${lemma} (${morphology} is not a pronoun`);

  return declinePronoun(lemma, pos.type);
}
