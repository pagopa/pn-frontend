export function getValidValue(a: string | number, b?: string | number): any {
  return a || (b ? b : '');
}
