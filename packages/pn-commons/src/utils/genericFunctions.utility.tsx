export function getValidValue(a: string | number | undefined, b?: string | number | undefined): any {
  return a || b;
}
