export const isNumber = (value: unknown): value is Number => {
  if (value === null || value === undefined) {
    return false;
  }
  if ((typeof value === 'number' || value instanceof Number) && !Number.isNaN(value)) {
    return true;
  }
  return false;
};
