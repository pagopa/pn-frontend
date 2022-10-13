export const isArray = <TValue, U extends TValue>(value: TValue): value is U => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'object' && Array.isArray(value)) {
    return true;
  }
  return false;
};
