export function getValidValue(a: string | number | undefined, b?: string | number): any {
  return a || (b ? b : '');
}

export function getDefaultDate(date1: Date, date2: Date, date3: string): any {
  return (date1 !== date2) ? new Date(date3) : null;
}