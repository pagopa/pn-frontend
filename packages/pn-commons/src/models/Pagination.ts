export type PaginationData = {
  page: number;
  size: number;
  totalElements: number;
};

export type A11yPaginationLabelsTypes =
  | 'page'
  | 'first'
  | 'last'
  | 'next'
  | 'previous'
  | 'start-ellipsis'
  | 'end-ellipsis';
