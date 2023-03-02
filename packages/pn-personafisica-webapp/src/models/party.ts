export interface Party {
  id: string;
  name: string;
}

export interface FilterPartiesParams {
  paNameFilter?: string;
  blockLoading?: boolean;
}
