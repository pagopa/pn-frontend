export const isDefined = <TValue>(value: TValue): boolean => {
  return value !== null && value !== undefined;
};
