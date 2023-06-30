export const isDate = (value: unknown): value is Date => {
  if (value === null || value === undefined) {
    return false;
  }
  if (value instanceof Date) {
    return true;
  }
  return false;
};
