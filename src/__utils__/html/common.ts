import transliterate from '../../transliterate';
import lodashGet from 'lodash/get';

export function diff<T>(
  before: T,
  after: T,
): (...path: any[]) => string | null {
  return (...path) => {
    const beforeValue = normalize(lodashGet(before, path));
    const afterValue = normalize(lodashGet(after, path));
    if (beforeValue === afterValue) {
      return beforeValue;
    }

    const del = beforeValue ? `<del>${beforeValue}</del>` : '';
    const ins = afterValue ? `<ins>${afterValue}</ins>` : '';
    return del || ins ? [del, ins].join(' ') : null;
  };
}

export function get<T>(obj: T): (...path: any[]) => string | null {
  return (...path) => {
    return normalize(lodashGet(obj, path));
  };
}

function normalize(string: string | null): string | null {
  return string && transliterate(string, 'art-Latn-x-interslv-etym');
}
