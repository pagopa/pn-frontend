import { Box, TableCell, TableCellProps, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import { Sort } from '../../../models';

interface Props<T> {
  testId?: string;
  sort?: Sort<T>;
  cellProps?: TableCellProps;
  handleClick?: (s: Sort<T>) => void;
  columnId: keyof T;
  children: React.ReactNode;
  sortable?: boolean;
}

const PnTableHeaderCell = <T,>({
  testId = 'headerCell',
  sort,
  cellProps,
  handleClick,
  sortable,
  columnId,
  children,
}: Props<T>) => {
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
          data-testid={`${testId}.sort.${columnId.toString()}`}
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
