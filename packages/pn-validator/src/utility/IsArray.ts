export const isArray = (value: unknown): value is Array<unknown> => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'object' && Array.isArray(value)) {
    return true;
  }
  return false;
};
