export const IUN_regex = /[A-Z]{4}-[A-Z]{4}-[A-Z]{4}-[\d]{6}-[A-Z]{1}-[\d]{1}/;

export const formatIun = (value: string): string | null => {
  const minusPositions = [19, 18, 12, 8, 4];
  // eslint-disable-next-line functional/no-let
  let formattedValue = value.replace(/[\W]/g, '').toUpperCase();
  minusPositions.forEach((v, i) => {
    if (formattedValue.length > v) {
      formattedValue = formattedValue.substring(0, minusPositions[i]) + '-' + formattedValue.substring(minusPositions[i]);
    }
  });
  return formattedValue;
};