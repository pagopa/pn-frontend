export const isNumber = (value: unknown): value is Number => {
  if (value === null || value === undefined) {
    return false;
  }
  if ((typeof value === 'number' && !isNaN(value)) || (value instanceof Number && !isNaN(value.valueOf()))) {
    return true;
  }
  return false;
};
