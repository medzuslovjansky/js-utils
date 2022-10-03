export default function isIterable<T>(
  value: T | Iterable<T>,
): value is Iterable<T> {
  return value && typeof (value as any)[Symbol.iterator] === 'function';
}
