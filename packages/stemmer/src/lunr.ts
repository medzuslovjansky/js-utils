import { STOP_WORDS } from './stopwords.ts';
import { stem } from './stemmer.ts';

/**
 * Structural stand-ins for the bits of lunr this plugin touches. Typing them
 * here rather than depending on lunr keeps the package installable next to any
 * lunr version, which is what the search plugins in the wild actually pin.
 */
export interface LunrToken {
  toString(): string;
  update(fn: (value: string) => string): LunrToken;
}

export interface Lunr {
  Pipeline: {
    registerFunction(fn: (...args: never[]) => unknown, label: string): void;
  };
  tokenizer: { separator: RegExp };
  isv?: unknown;
}

/**
 * A word boundary in Interslavic is not `\W`. lunr's stock trimmer keeps
 * `[A-Za-z0-9_]` and throws away everything else, which deletes `ě`, `č` and
 * every Cyrillic letter in the corpus — the index comes out empty and the
 * failure is silent. This is the single thing that has to be replaced.
 */
const EDGE = /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu;

/** Same reasoning, applied to where lunr cuts a string into tokens. */
export const SEPARATOR = /[^\p{L}\p{N}]+/u;

export function trimmer(token: LunrToken): LunrToken {
  return token.update((value) => value.replace(EDGE, ''));
}

export function stemmer(token: LunrToken): LunrToken {
  return token.update(stem);
}

const STOP = new Set(STOP_WORDS);

/**
 * Runs *after* the stemmer, unlike the lunr-languages convention. The list is
 * then stems rather than surface forms, so it covers every case of every
 * pronoun without listing them, and it needs no folding of its own — `в`, `v`
 * and `vȯ` have already become one key by the time it looks.
 */
export function stopWordFilter(token: LunrToken): LunrToken | undefined {
  return STOP.has(token.toString()) ? undefined : token;
}

/**
 * Installs the language as `lunr.isv`, the shape every lunr-languages plugin
 * uses, so the Docusaurus search plugins can pick it up the way they pick up
 * `lunr.ru` or `lunr.de`:
 *
 * ```js
 * import lunr from 'lunr';
 * import { registerInterslavic } from '@interslavic/lunr';
 *
 * registerInterslavic(lunr);
 * const idx = lunr(function () { this.use(lunr.isv); ... });
 * ```
 *
 * `lunr.tokenizer.separator` is global in lunr, so this changes tokenization
 * for every language in the index. That is the same trade every non-English
 * lunr language makes, and it is why the separator here only widens what counts
 * as a letter rather than narrowing it.
 */
export function registerInterslavic(lunr: Lunr): void {
  lunr.tokenizer.separator = SEPARATOR;

  function isv(this: {
    pipeline: { reset(): void; add(...fns: unknown[]): void };
    searchPipeline?: { reset(): void; add(...fns: unknown[]): void };
  }) {
    this.pipeline.reset();
    this.pipeline.add(trimmer, stemmer, stopWordFilter);
    this.searchPipeline?.reset();
    this.searchPipeline?.add(stemmer);
  }

  isv.trimmer = trimmer;
  isv.stopWordFilter = stopWordFilter;
  isv.stemmer = stemmer;
  lunr.isv = isv;

  // lunr refuses to deserialize an index whose pipeline holds unregistered
  // functions, so every one of them has to be named before an index is built.
  lunr.Pipeline.registerFunction(trimmer as never, 'trimmer-isv');
  lunr.Pipeline.registerFunction(stopWordFilter as never, 'stopWordFilter-isv');
  lunr.Pipeline.registerFunction(stemmer as never, 'stemmer-isv');
}

export const registerLunr = registerInterslavic;
