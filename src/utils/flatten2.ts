export type MaybeNested<T> = T | T[];

export function getFlatSize<T>(arr: MaybeNested<T>[]): number {
  let item: MaybeNested<T>;
  let i: number;
  let N: number;
  let Li: number;

  const L = arr.length;
  for (i = 0, N = 0; i < L; i++) {
    item = arr[i];
    Li = Array.isArray(item) ? item.length : 1;
    N += Li;
  }

  return N;
}

export function flatten2<T>(arr: MaybeNested<T>[]): T[] {
  const L = arr.length;
  const result: T[] = new Array(getFlatSize(arr));

  let item: MaybeNested<T>;
  let i: number;
  let j: number;
  let k: number;
  let Li: number;

  for (i = 0, k = 0; i < L; i++) {
    item = arr[i];

    if (!Array.isArray(item)) {
      result[k++] = item;
    } else {
      Li = Array.isArray(item) ? item.length : 1;
      for (j = 0; j < Li; j++) {
        result[k++] = item[j];
      }
    }
  }

  return result;
}
