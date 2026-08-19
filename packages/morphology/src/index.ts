// Primary high-level APIs
export { inflect, type KnownForm } from './inflect/inflect.ts';
export {
  derive,
  type DeriveInput,
  type DeriveOptions,
} from './derive/index.ts';
export { detectPos, type PosDetection } from './detect-pos.ts';

// Schema & Derivation types
export type { Lemma, Word } from './schema.ts';
export type { DerivationCode } from './derive/virtual-id.ts';
