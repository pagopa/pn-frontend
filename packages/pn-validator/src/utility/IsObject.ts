export const isObject = (value: unknown): value is object => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
    return true;
  }
  return false;
};
