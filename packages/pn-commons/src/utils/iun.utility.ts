export const IUN_regex = /[A-Z]{4}-[A-Z]{4}-[A-Z]{4}-[\d]{6}-[A-Z]{1}-[\d]{1}/;

export const formatIun = (value: string, lastChar?: string): string | null => {
  switch (value.length) {
    case 3:
    case 8:
    case 13:
    case 20:
    case 22:
      if (lastChar && lastChar.length) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        return value + lastChar + '-';
      } else {
        return null;
      }
    default:
      return null;
  }
};