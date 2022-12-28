export const isString = (value: unknown): value is String => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string' || value instanceof String) {
    return true;
  }
  return false;
};
