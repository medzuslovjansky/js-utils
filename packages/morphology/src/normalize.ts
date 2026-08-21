/**
 * Interslavic normalization.
 *
 * Normalizes raw Steenbergen format input into structured Lemma objects.
 * This is ISV-specific because it uses etymologify and ISV patches.
 */

import type { XPOS } from '@interslavic/conllu';
import { splitTokens } from '@interslavic/conllu';
import type { Lemma, Word } from './schema.ts';
import { stripMetacharacters, splitSteenLemmas } from './steen/index.ts';
import { etymologify } from './etymologify.ts';
import { inferParadigms } from './infer-paradigms.ts';
import { parseXPos } from './steen/index.ts';
import { patch } from './patch.ts';
import { LEXEMES } from './patches.ts';

/**
 * Jan van Steenbergen's format for Interslavic words list.
 * Generic enough to support both ISV column and translation columns.
 */
export interface SteenInput {
  /** The Interslavic word/phrase */
  isv: string;
  /** Additional paradigm hints */
  addition?: string;
  /** Language-specific part of speech tag */
  partOfSpeech: XPOS;
}

function isAffix(xpos: string): 'prefix' | 'suffix' | false {
  const lower = xpos.toLowerCase();
  if (lower === 'prefix') return 'prefix';
  if (lower === 'suffix') return 'suffix';
  return false;
}

/**
 * Normalize affix form: strip spaces, collapse multiple dashes, ensure dash position.
 * Prefix: "anti -" → "anti-", "anti" → "anti-", "anti-" stays "anti-", "anti--" → "anti-"
 * Suffix: "- nik" → "-nik", "nik" → "-nik", "-nik" stays "-nik", "--nik" → "-nik"
 */
function normalizeAffixForm(value: string, type: 'prefix' | 'suffix'): string {
  // Strip spaces, collapse multiple dashes to one (safeguard against "anti--")
  const cleaned = value.replace(/\s+/g, '').replace(/-+/g, '-');

  if (type === 'prefix') {
    // Ensure trailing dash
    return cleaned.endsWith('-') ? cleaned : cleaned + '-';
  }

  // Suffix: ensure leading dash
  return cleaned.startsWith('-') ? cleaned : '-' + cleaned;
}

/**
 * Normalize input into Lemma[].
 * For single-word lemmas, applies upos/feats from xpos.
 * For multi-word, words start unresolved and get resolved later.
 */
export function normalize(input: SteenInput): Lemma[] {
  const [isv, xpos, patchedAddition] = patch(
    etymologify(input.isv).trim(),
    stripMetacharacters(input.partOfSpeech).trim(),
  );
  // Use patched addition if provided (for deduplication), otherwise use input addition
  const effectiveAddition = patchedAddition ?? input.addition;
  const paradigms = inferParadigms(effectiveAddition);

  // Check if this is an affix
  const affixType = isAffix(xpos);

  // Dual-gender tags (e.g. m./f.) represent a single dictionary entry.
  // Strip Gender so downstream inflection handles both variants without duplicating lemmas.
  const variants = parseXPos(isv, xpos);
  const [upos, tagFeats] = variants[0]!;
  const feats = { ...tagFeats };
  if (variants.length > 1) delete feats.Gender;

  return splitSteenLemmas(isv).flatMap(({ value, annotation }) => {
    // Handle prefix/suffix specially
    if (affixType) {
      const form = normalizeAffixForm(value, affixType);
      // Affixes are bound morphemes - use X upos, no inflection
      const words: Word[] = [
        {
          form,
          lemma: form,
          upos: 'X',
        },
      ];

      return {
        xpos,
        paradigms,
        annotation,
        words,
      };
    }

    const tokens = splitTokens(value);

    // Convert tokens to words
    // For single non-punct token, apply upos/feats from xpos
    const nonPunct = tokens.filter((t) => t.upos !== 'PUNCT');
    const isSingleWord = nonPunct.length === 1;

    const words: Word[] = tokens.map((token) => {
      if (token.upos === 'PUNCT') {
        return {
          form: token.form,
          lemma: token.form, // PUNCT lemma is itself
          upos: token.upos,
          misc: token.misc,
        };
      }

      if (isSingleWord) {
        // Single word: use citation form, with UPOS/features from XPOS.
        // Map lemma if the form belongs to a multi-column lexeme.
        return {
          form: token.form,
          lemma: LEXEMES[token.form] ?? token.form,
          upos,
          feats,
          misc: token.misc,
        };
      }

      // Multi-word - unresolved (no upos, no lemma)
      return {
        form: token.form,
        misc: token.misc,
        // lemma and upos left undefined - will be resolved later
      };
    });

    return {
      xpos,
      paradigms,
      annotation,
      words,
    };
  });
}
