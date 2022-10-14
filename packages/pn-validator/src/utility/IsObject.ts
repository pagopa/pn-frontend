export const isObject = <TValue, U extends TValue>(value: TValue): value is U => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
    return true;
  }
  return false;
};
