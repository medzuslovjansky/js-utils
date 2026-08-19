import type { Token, TokenFeatures, UPOS, XPOS } from '@interslavic/conllu';
import type { Lemma } from '../schema.ts';
import { inflectWord } from './inflect-word.ts';
import { parseXPos } from '../steen/index.ts';
import { uposFeatsToXpos } from '../upos-to-xpos.ts';
import { guessXpos } from './guess-xpos.ts';

/**
 * A form you already know, described in CoNLL-U columns. `form` is the only
 * required one; every other column narrows the answer down.
 */
export interface KnownForm {
  form: string;
  lemma?: string;
  upos?: UPOS;
  xpos?: XPOS;
  feats?: TokenFeatures;
}

/**
 * Fill in a paradigm from whatever you know about a word.
 *
 * A bare string is the least you can say, and the part of speech gets guessed
 * from the ending. Naming a `lemma` alongside an oblique `form` gives a second
 * principal part; several forms in an array give as many.
 *
 * A paradigm handed straight back comes out unchanged, so what a consumer
 * stores is as good an input as the dictionary entry it came from.
 *
 * Single words only — one word in, one paradigm out. Phrases like `bojati sę`
 * or `Sjedinjene Štaty Ameriky` inflect as a unit and belong elsewhere.
 */
export function inflect(known: string | KnownForm | KnownForm[]): Token[] {
  const forms = (Array.isArray(known) ? known : [known]).map((entry) =>
    typeof entry === 'string' ? { form: entry } : entry,
  );

  const [head] = forms;
  if (!head?.form) return [];

  const citation = head.lemma ?? head.form;
  const xpos = resolveXpos(citation, forms);

  const base = inflectWord(citation, xpos, citation);
  const irregular = principalParts(citation, xpos, forms, base);

  return irregular ? inflectWord(citation, xpos, citation, irregular) : base;
}

/**
 * The cell the dictionary spells out in brackets: a noun's genitive
 * (`česnȯk (česnȯka)`), a verb's third person singular present
 * (`velěti (veli)`). Other parts of speech have no such cell and ignore it.
 *
 * The genitive is left without a `Number` so that pluralia tantum answer with
 * the only genitive they have; everything else answers singular first anyway.
 */
const PRINCIPAL_CELL: Partial<Record<UPOS, TokenFeatures>> = {
  NOUN: { Case: 'Gen' },
  PROPN: { Case: 'Gen' },
  VERB: { Number: 'Sing', Person: '3', Tense: 'Pres' },
  AUX: { Number: 'Sing', Person: '3', Tense: 'Pres' },
};

/**
 * How well a form answers to the cell: one point per feature it confirms, and
 * out of the running entirely if it contradicts one. A form described only in
 * part still scores — `{ form: 'ide', feats: { Number: 'Sing', Person: '3' } }`
 * is the present tense even without `Tense` spelled out.
 */
function cellScore(feats: TokenFeatures, cell: TokenFeatures): number {
  let score = 0;

  for (const [name, value] of Object.entries(cell)) {
    const stated = (feats as Record<string, unknown>)[name];
    if (stated === undefined) continue;
    if (stated !== value) return 0;
    score++;
  }

  return score;
}

/**
 * The paradigm modules take principal parts the way the dictionary writes them,
 * in brackets.
 *
 * Bare forms are read in the order given — that is the caller naming principal
 * parts. Forms that describe themselves are a whole paradigm handed back, so
 * they are read by what they say: if the citation form already builds exactly
 * that paradigm unaided it needs no hint at all, and if it does not, the one
 * cell the module asks for is the correction. Passing the whole paradigm on
 * instead would be worse than useless — a hint narrows as much as it corrects, and `bajati (bajaje)` loses the short present that `bajati` alone
 * builds.
 */
function principalParts(
  citation: string,
  xpos: XPOS,
  forms: KnownForm[],
  base: Token[],
): string | undefined {
  const described = forms.some((f) => f.feats && f.form !== citation);
  const extra = forms.filter((f) => f.form && f.form !== citation);
  if (extra.length === 0) return undefined;

  if (!described) {
    return `(${extra.map((f) => f.form).join('; ')})`;
  }

  const known = new Set(base.map((token) => token.form));
  const given = new Set(forms.map((f) => f.form));
  if (given.size === known.size && [...given].every((f) => known.has(f))) {
    return undefined;
  }

  const cell = PRINCIPAL_CELL[parseXPos(citation, xpos)[0]?.[0] as UPOS] ?? {};
  const best = extra
    .map((f) => [f.form, f.feats ? cellScore(f.feats, cell) : 0] as const)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])[0];

  return best ? `(${best[0]})` : undefined;
}

/**
 * Everything reaching a paradigm module has to become one dictionary tag, so the columns
 * the caller filled in are folded into a guess of the ones they left empty:
 * `{ form: 'pisati', feats: { Aspect: 'Perf' } }` starts from the verb the
 * ending suggests and comes out perfective.
 */
function resolveXpos(citation: string, forms: KnownForm[]): XPOS {
  const stated = forms.find((f) => f.xpos)?.xpos;
  if (stated) return stated;

  const [head] = forms;
  const guessed = guessXpos(citation);
  if (!head.upos && !head.feats) return guessed;

  // `guessed` is one of the five tags `guessXpos()` can return, and every one
  // of them parses, so there is always a variant to start from.
  const [guessedUpos, guessedFeats] = parseXPos(citation, guessed)[0]!;
  return (
    uposFeatsToXpos(head.upos ?? guessedUpos, {
      ...guessedFeats,
      ...head.feats,
    }) || guessed
  );
}

/**
 * The dictionary-import path: a whole Steenbergen record, already normalized
 * into words, drives the same paradigm modules. Used by `tools/dump`.
 */
export function inflectLemma(lemma: Lemma): Token[] | undefined {
  // Skip if any word is unresolved (no upos or no lemma)
  if (lemma.words.some(({ upos, lemma: wordLemma }) => !upos || !wordLemma)) {
    return;
  }

  const [word] = lemma.words;
  const irregular = lemma.paradigms?.find((paradigm) =>
    paradigm.startsWith('('),
  );

  // word.lemma is guaranteed to be defined by the check above
  return inflectWord(word.form, lemma.xpos, word.lemma!, irregular, lemma.misc);
}
