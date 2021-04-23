export default function cartesianProduct<T>(paramArrays: T[][]): T[][] {
  const N = paramArrays.length;
  const arrLengths = new Array<number>(N);
  const digits = new Array<number>(N);

  let productionsCount = 1;
  for (let i = 0; i < N; i++) {
    const len = paramArrays[i].length;
    if (!len) {
      productionsCount = 0;
      break;
    }

    digits[i] = 0;
    productionsCount *= arrLengths[i] = len;
  }

  const result = new Array<T[]>(productionsCount);
  for (let num = 0; num < productionsCount; ++num) {
    const item = new Array<T>(N);
    for (let j = 0; j < N; ++j) {
      item[j] = paramArrays[j][digits[j]];
    }

    result[num] = item;

    for (let idx = 0; idx < N; idx++) {
      if (digits[idx] === arrLengths[idx] - 1) {
        digits[idx] = 0;
      } else {
        digits[idx] += 1;
        break;
      }
    }
  }

  return result;
}
