import type { TestContext } from 'node:test';

export declare function snapshots(
  testFile: string,
  options?: { update?: boolean },
): {
  /** Compares `received` against the stored value under `${name} ${nth}`. */
  match(t: TestContext, name: string, received: unknown): void;
};
