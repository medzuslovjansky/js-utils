import { LemmaTuple } from './Derivation';

const IJA = new Set(['cija', 'sija', 'zija']);

export function* nouns(noun: string): Generator<LemmaTuple> {
  yield* ica(noun);
}

export function* adjectives(noun: string): Generator<LemmaTuple> {
  yield* ijny(noun);
}

/** akcija -> akcijny, versija -> versijny, televizija -> televizijny */
function* ijny(noun: string): Generator<LemmaTuple> {
  if (IJA.has(noun.slice(-4))) {
    yield [noun.slice(0, -1) + 'ny', 'adj.'];
  }
}

/** glupec -> glupica */
function* ica(noun: string): Generator<LemmaTuple> {
  if (noun.endsWith('ėc')) {
    yield [noun.slice(0, -2) + 'ica', 'f.'];
  }
}
