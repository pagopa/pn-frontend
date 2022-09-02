export const isDate = <TValue, U extends TValue>(value: TValue): value is U => {
  if (value === null || value === undefined) {
    return false;
  }
  if (value instanceof Date) {
    return true;
  }
  return false;
};
