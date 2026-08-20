import type { Misc, Token } from '@interslavic/conllu';
import type { Lemma } from '../schema.ts';
import type { KnownForm } from '../inflect/inflect.ts';
import { normalize, type SteenInput } from '../normalize.ts';
import { parseXPos } from '../steen/index.ts';
import { etymologify } from '../etymologify.ts';
import { deriveFromVerb } from './from-verb.ts';
import { deriveFromAdjective } from './from-adjective.ts';
import { deriveFromAdverb } from './from-adverb.ts';
import { guessXpos } from '../inflect/guess-xpos.ts';
import { DERIVATION_MAP, type DerivationCode } from './virtual-id.ts';
import type { DerivationResult, DeriveContext } from './core.ts';
import { filterValidResults } from './core.ts';

export type DeriveInput =
  string | KnownForm | SteenInput | Lemma | { lemma: Lemma; lid?: string };

export interface DeriveOptions {
  /** Filter by specific derivation codes (e.g. ['v_prap', 'v_noun']) */
  types?: DerivationCode[];
  /** Include analytical forms @default true */
  includeAnalytical?: boolean;
}

function toDeriveContext(input: DeriveInput): {
  ctx: DeriveContext;
  baseLemmaStr: string;
} {
  if (
    typeof input === 'object' &&
    input !== null &&
    'lemma' in input &&
    input.lemma &&
    typeof input.lemma === 'object'
  ) {
    const ctx = input as DeriveContext;
    const baseWord =
      ctx.lemma.words[0]?.lemma || ctx.lemma.words[0]?.form || '';
    return { ctx, baseLemmaStr: baseWord };
  }

  if (
    typeof input === 'object' &&
    input !== null &&
    'words' in input &&
    Array.isArray(input.words)
  ) {
    const ctx: DeriveContext = { lemma: input as Lemma, lid: '' };
    const baseWord =
      ctx.lemma.words[0]?.lemma || ctx.lemma.words[0]?.form || '';
    return { ctx, baseLemmaStr: baseWord };
  }

  let steenInput: SteenInput;
  let lid = '';

  if (typeof input === 'string') {
    steenInput = {
      isv: input,
      partOfSpeech: guessXpos(input),
    };
  } else if ('form' in input) {
    const wordForm = (input as KnownForm).lemma || input.form;
    steenInput = {
      isv: wordForm,
      partOfSpeech: input.xpos || guessXpos(wordForm),
    };
  } else if ('isv' in input) {
    const raw = input as SteenInput & { id?: string };
    steenInput = {
      isv: raw.isv,
      addition: raw.addition,
      partOfSpeech: raw.partOfSpeech || guessXpos(raw.isv),
    };
    lid = raw.id || '';
  } else {
    steenInput = { isv: '', partOfSpeech: 'm.' };
  }

  const normalized = normalize(steenInput);
  const [lemma] = normalized;

  if (!lemma) {
    return {
      ctx: { lemma: { xpos: '', words: [] }, lid },
      baseLemmaStr: steenInput.isv,
    };
  }

  return {
    ctx: { lemma, lid },
    baseLemmaStr: steenInput.isv,
  };
}

export function derive(
  input: DeriveInput | DeriveInput[],
  options?: DeriveOptions,
): Token[] {
  const inputs = Array.isArray(input) ? input : [input];
  const allTokens: Token[] = [];

  for (const item of inputs) {
    const { ctx } = toDeriveContext(item);
    const word = ctx.lemma.words[0];
    if (!word?.upos) continue;

    let rawResults: DerivationResult[];

    switch (word.upos) {
      case 'VERB':
      case 'AUX':
        rawResults = deriveFromVerb(ctx);
        break;
      case 'ADJ':
        rawResults = deriveFromAdjective(ctx);
        break;
      case 'ADV':
        rawResults = deriveFromAdverb(ctx);
        break;
      default:
        continue;
    }

    const validResults = filterValidResults(rawResults);

    for (const res of validResults) {
      const mapping = DERIVATION_MAP[res.derivationType] || {
        code: res.derivationType as DerivationCode,
        sidSuffix: res.derivationType,
      };

      if (options?.types && !options.types.includes(mapping.code)) {
        continue;
      }
      if (options?.includeAnalytical === false && mapping.code.endsWith('_a')) {
        continue;
      }

      const rawForms = res.isv.includes(',')
        ? res.isv
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [res.isv];

      for (const rawForm of rawForms) {
        const form = etymologify(rawForm);
        const parsed = parseXPos(form, res.xpos);
        const [upos, parsedFeats] = parsed[0] || ['X', {}];

        const feats = { ...parsedFeats };
        if (res.derivationType === 'vnoun') {
          feats.VerbForm = 'Vnoun';
          feats.Gender = 'Neut';
        }

        const misc: Misc = {
          Derivation: mapping.code,
        };

        if (ctx.lid) {
          misc.LID = ctx.lid;
          misc.SID = `${ctx.lid}-${mapping.sidSuffix}`;
        }

        allTokens.push({
          form,
          lemma: form,
          upos,
          xpos: res.xpos,
          feats: Object.keys(feats).length > 0 ? feats : undefined,
          misc,
        });
      }
    }
  }

  return allTokens;
}

export function canDerive(input: DeriveInput): boolean {
  const { ctx } = toDeriveContext(input);
  const word = ctx.lemma.words[0];
  if (!word?.upos) return false;
  return ['VERB', 'AUX', 'ADJ', 'ADV'].includes(word.upos);
}
