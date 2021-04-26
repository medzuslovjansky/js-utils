type EnumCaster<E> = (value: unknown) => null | keyof E;

export default function buildCastToEnum<E>(EnumObj: E): EnumCaster<E> {
  const entries = new Map<unknown, string>(
    new Map(
      Object.entries(EnumObj).map<[unknown, string]>(([k, v]) => [v, k]),
    ),
  );

  return function castToEnum(value) {
    if (entries.has(value)) {
      return entries.get(value) as keyof E;
    }

    return null;
  };
}
