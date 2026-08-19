import { PHONETIC_PAIRS, WEIGHTS } from './weights.ts';
import type { AlignmentStep, AlignmentOp } from './types.ts';

const PAIR_SEP = ' ';

const pairCost = new Map<string, number>();
for (const [a, b, weight] of PHONETIC_PAIRS) {
  pairCost.set(a + PAIR_SEP + b, WEIGHTS[weight]);
  pairCost.set(b + PAIR_SEP + a, WEIGHTS[weight]);
}

function substitutionCost(a: string, b: string): number {
  if (a === b) return WEIGHTS.identical;
  return pairCost.get(a + PAIR_SEP + b) ?? WEIGHTS.substitute;
}

/**
 * Weighted Levenshtein distance calculation and optimal alignment traceback.
 */
export function weightedLevenshtein(
  a: readonly string[],
  b: readonly string[],
): number {
  let prev: number[] = [];
  for (let j = 0; j <= b.length; j++) {
    prev.push(j * WEIGHTS.indel);
  }
  for (let i = 1; i <= a.length; i++) {
    const row: number[] = [i * WEIGHTS.indel];
    for (let j = 1; j <= b.length; j++) {
      row.push(
        Math.min(
          prev[j]! + WEIGHTS.indel,
          row[j - 1]! + WEIGHTS.indel,
          prev[j - 1]! + substitutionCost(a[i - 1]!, b[j - 1]!),
        ),
      );
    }
    prev = row;
  }
  return prev[b.length]!;
}

export function weightedLevenshteinWithAlignment(
  a: readonly string[],
  b: readonly string[],
): { rawCost: number; alignment: AlignmentStep[] } {
  const dp: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    dp[i] = new Array(b.length + 1).fill(0);
  }

  for (let i = 0; i <= a.length; i++) {
    dp[i]![0] = i * WEIGHTS.indel;
  }
  for (let j = 0; j <= b.length; j++) {
    dp[0]![j] = j * WEIGHTS.indel;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const subCost = substitutionCost(a[i - 1]!, b[j - 1]!);
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + WEIGHTS.indel,
        dp[i]![j - 1]! + WEIGHTS.indel,
        dp[i - 1]![j - 1]! + subCost,
      );
    }
  }

  // Traceback
  const alignment: AlignmentStep[] = [];
  let i = a.length;
  let j = b.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const subCost = substitutionCost(a[i - 1]!, b[j - 1]!);
      if (Math.abs(dp[i]![j]! - (dp[i - 1]![j - 1]! + subCost)) < 1e-9) {
        const charA = a[i - 1]!;
        const charB = b[j - 1]!;
        const op: AlignmentOp = charA === charB ? 'equal' : 'substitute';
        alignment.unshift({ a: charA, b: charB, op, cost: subCost });
        i--;
        j--;
        continue;
      }
    }
    if (
      i > 0 &&
      Math.abs(dp[i]![j]! - (dp[i - 1]![j]! + WEIGHTS.indel)) < 1e-9
    ) {
      alignment.unshift({ a: a[i - 1]!, op: 'delete', cost: WEIGHTS.indel });
      i--;
      continue;
    }
    if (
      j > 0 &&
      Math.abs(dp[i]![j]! - (dp[i]![j - 1]! + WEIGHTS.indel)) < 1e-9
    ) {
      alignment.unshift({ b: b[j - 1]!, op: 'insert', cost: WEIGHTS.indel });
      j--;
      continue;
    }
  }

  return {
    rawCost: dp[a.length]![b.length]!,
    alignment,
  };
}
