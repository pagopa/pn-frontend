export const isBoolean = (value: unknown): value is Boolean => {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'boolean') {
      return true;
    }
    return false;
  };
  