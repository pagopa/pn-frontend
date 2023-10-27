import { Box, TableCell, TableCellProps, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import { Sort } from '../../../models';

export interface IPnTableHeaderCellProps<ColumnId> {
  testId?: string;
  sort?: Sort<ColumnId>;
  cellProps?: TableCellProps;
  handleClick?: (s: Sort<ColumnId>) => void;
  columnId: ColumnId;
  children: React.ReactNode;
  sortable?: boolean;
}

const PnTableHeaderCell = <ColumnId extends string>({
  testId = 'headerCell',
  sort,
  cellProps,
  handleClick,
  sortable,
  columnId,
  children,
}: IPnTableHeaderCellProps<ColumnId>) => {
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
          data-testid={`${testId}.sort.${columnId}`}
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
