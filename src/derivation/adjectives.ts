import { declensionAdjective } from '../adjective';
import { memoizeLastCall } from '../utils';
import { LemmaTuple } from './Derivation';

const decl = memoizeLastCall(declensionAdjective);

export function* adjectives(
  adjective: string,
): Generator<LemmaTuple, void, undefined> {
  const { comparative, superlative } = decl(adjective, '').comparison;
  if (comparative[1]) yield* split(comparative[1], 'adj.comp.');
  if (superlative[1]) yield* split(superlative[1], 'adj.sup.');
}

export function* adverbs(
  adjective: string,
): Generator<LemmaTuple, void, undefined> {
  const { positive, comparative, superlative } = decl(adjective, '').comparison;

  if (positive[1]) yield* split(positive[1], 'adv.');
  if (comparative[1]) yield* split(comparative[1], 'adv.comp.');
  if (superlative[1]) yield* split(superlative[1], 'adv.sup.');
}

function split(s: string, partOfSpeech: string): LemmaTuple[] {
  if (s.startsWith('bolje ')) return [];
  return s.split(', ').map((lemma) => [lemma, partOfSpeech]);
}
