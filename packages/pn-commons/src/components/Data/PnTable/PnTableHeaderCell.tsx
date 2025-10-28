import { ReactChild, ReactFragment } from 'react';

import { Box, TableCell, TableCellProps, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import { Sort } from '../../../models/PnTable';

export type PnTableHeaderCellProps<T> = {
  testId?: string;
  sort?: Sort<T>;
  cellProps?: TableCellProps;
  handleClick?: (s: Sort<T>) => void;
  columnId: keyof T;
  children: ReactChild | ReactFragment;
  sortable?: boolean;
};

const PnTableHeaderCell = <T,>({
  testId,
  sort,
  cellProps,
  handleClick,
  sortable,
  columnId,
  children,
}: PnTableHeaderCellProps<T>) => {
  const sortHandler = (property: keyof T) => () => {
    if (sort && handleClick) {
      const isAsc = sort.orderBy === property && sort.order === 'asc';
      handleClick({ order: isAsc ? 'desc' : 'asc', orderBy: property });
    }
  };

  return (
    <TableCell
      {...cellProps}
      scope="col"
      data-testid={testId}
      sx={{
        ...cellProps?.sx,
        borderBottom: 'none',
        fontWeight: 600,
      }}
      sortDirection={sort && sort.orderBy === columnId ? sort.order : false}
    >
      {sort && sortable ? (
        <TableSortLabel
          active={sort.orderBy === columnId}
          direction={sort.orderBy === columnId ? sort.order : 'asc'}
          onClick={sortHandler(columnId)}
          data-testid={testId ? `${testId}.sort.${columnId.toString()}` : null}
          sx={{
            '&:focus-visible': {
              borderRadius: '2px',
              outlineOffset: '4px',
              outline: '2px solid currentColor',
            },
          }}
        >
          {children}
          {sort.orderBy === columnId && (
            <Box component="span" sx={visuallyHidden}>
              {sort.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
            </Box>
          )}
        </TableSortLabel>
      ) : (
        children
      )}
    </TableCell>
  );
};

export default PnTableHeaderCell;
