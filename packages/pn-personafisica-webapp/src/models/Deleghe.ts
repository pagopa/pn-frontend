export type DelegheColumn =
  | 'name'
  | 'startDate'
  | 'endDate'
  | 'visibilityIds'
  | 'status'
  | 'id'
  | '';

export type DelegatesColumn = DelegheColumn;

export type DelegatorsColumn = DelegheColumn;

export type EnteSelect = { name: string | null; uniqueIdentifier: string };
