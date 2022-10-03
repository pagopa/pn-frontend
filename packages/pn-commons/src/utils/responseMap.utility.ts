export function responseMap<T>(values: Partial<T>, emptyObject: T): T {
  return Object.keys(emptyObject)
    .reduce((acc: any, key: string) => {
      // eslint-disable-next-line functional/immutable-data
      acc[key] = values[key as keyof T];
      return acc;
    }, {}) as T;
}