import { ChangeEvent, Fragment } from 'react';
import { Grid, Pagination } from '@mui/material';
import PaginationItem from '@mui/material/PaginationItem';

import { PaginationData } from './types';

function defaultLabelDisplayedRows(from: number, to: number, count: number) {
  // eslint-disable-next-line sonarjs/no-nested-template-literals
  return `${from}-${to} di ${count !== -1 ? count : `più di ${to}`}`;
}

const getLabelDisplayedRowsTo = (count: number, paginationData: number, size: number) => {
  if (count === -1) {
    return (paginationData + 1) * size;
  }

  return size === -1 ? count : Math.min(count, (paginationData + 1) * size);
};

type Props = {
  /** The actual paginationData */
  paginationData: PaginationData;
  /** The function to be invoked if the user change paginationData */
  onPageRequest: (r: PaginationData) => void;
   /** The list of numbers of the elements per page */
  elementsPerPage: Array<number>;
};

/** Selfcare custom table available pages component */
export default function CustomPagination({ paginationData, onPageRequest, elementsPerPage }: Props) {
  const count = paginationData.totalElements;
  const size = paginationData.size || elementsPerPage[0];
  const from = count === 0 ? 0 : paginationData.page * size + 1;
  const to = getLabelDisplayedRowsTo(count, paginationData.page, size);

  return (
    <Fragment>
      <Grid container sx={{ padding: '0 10px' }}>
        <Grid item xs={6} display="flex" justifyContent="start" alignItems={'center'}>
          {defaultLabelDisplayedRows(from, to, count)}
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end" alignItems={'center'}>
          {paginationData.totalElements > size && (
            <Pagination
              sx={{ display: 'flex' }}
              color="primary"
              variant="outlined"
              shape="rounded"
              page={paginationData.page + 1}
              count={Math.ceil(paginationData.totalElements / size)}
              renderItem={(props2) => <PaginationItem {...props2} sx={{ border: 'none' }} />}
              onChange={(_event: ChangeEvent<unknown>, value: number) => (
                onPageRequest({
                  ...paginationData,
                  page: value - 1
                })
              )}
            />
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
}