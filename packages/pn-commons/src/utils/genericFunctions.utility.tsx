export function getValidValue(a: string | number | undefined, b?: string | number): any {
  return a || (b ? b : '');
}