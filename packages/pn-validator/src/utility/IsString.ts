export const isString = <TValue, U extends TValue>(value: TValue): value is U => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string' || value instanceof String) {
    return true;
  }
  return false;
};
