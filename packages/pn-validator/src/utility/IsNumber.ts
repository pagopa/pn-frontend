export const isNumber = <TValue, U extends TValue>(value: TValue): value is U => {
  if (value === null || value === undefined) {
    return false;
  }
  if ((typeof value === 'number' || value instanceof Number) && !Number.isNaN(value)) {
    return true;
  }
  return false;
};
