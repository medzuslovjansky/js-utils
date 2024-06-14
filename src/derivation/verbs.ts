export function* adjectives(adjective: string): Generator<string> {
  yield* negation(adjective);
  yield* comparative(adjective);
  yield* superlative(adjective);
}
