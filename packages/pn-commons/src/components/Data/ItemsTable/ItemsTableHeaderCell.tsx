import { PropsWithChildren } from 'react';

import { Box, TableCell, TableCellProps, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import { Column, Sort } from '../../../types';

type Props<ColumnId> = {
  testId?: string;
  sort?: Sort<ColumnId>;
  cellProps?: TableCellProps;
  handleClick?: (s: Sort<ColumnId>) => void;
  column: Column<ColumnId>;
};

const ItemsTableHeaderCell = <ColumnId extends string>({
  testId = 'table(notifications)',
  sort,
  cellProps,
  handleClick,
  column,
}: PropsWithChildren<Props<ColumnId>>) => {
  const sortHandler = (property: ColumnId) => () => {
    if (sort && handleClick) {
      const isAsc = sort.orderBy === property && sort.order === 'asc';
      handleClick({ order: isAsc ? 'desc' : 'asc', orderBy: property });
    }
  };
  return (
    <TableCell
      {...cellProps}
      scope="col"
      data-testid="tableHeadCell"
      sx={{
        ...cellProps?.sx,
        borderBottom: 'none',
        fontWeight: 600,
      }}
      sortDirection={sort && sort.orderBy === column.id ? sort.order : false}
    >
      {sort && column.sortable ? (
        <TableSortLabel
          active={sort.orderBy === column.id}
          direction={sort.orderBy === column.id ? sort.order : 'asc'}
          onClick={sortHandler(column.id)}
          data-testid={`${testId}.sort.${column.id}`}
        >
          {column.label}
          {sort.orderBy === column.id && (
            <Box component="span" sx={visuallyHidden}>
              {sort.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
            </Box>
          )}
        </TableSortLabel>
      ) : (
        column.label
      )}
    </TableCell>
  );
};

export default ItemsTableHeaderCell;
