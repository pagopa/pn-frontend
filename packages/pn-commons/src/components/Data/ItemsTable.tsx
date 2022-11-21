import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import { Column, Item, Sort, Notification } from '../../types';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';

type Props<ColumnId> = {
  /** Table columns */
  columns: Array<Column<ColumnId>>;
  /** Table rows */
  rows: Array<Item>;
  /** Table sort */
  sort?: Sort<ColumnId>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<ColumnId>) => void;
};

function ItemsTable<ColumnId extends string>({
  columns,
  rows,
  sort,
  onChangeSorting,
}: Props<ColumnId>) {
  const createSortHandler = (property: ColumnId) => () => {
    if (sort && onChangeSorting) {
      const isAsc = sort.orderBy === property && sort.order === 'asc';
      onChangeSorting({ order: isAsc ? 'desc' : 'asc', orderBy: property });
    }
  };
  
  // Table style
  const Root = styled('div')(
    () => `
    tr:first-of-type td:first-of-type {
      border-top-left-radius: 4px;
    }
    tr:first-of-type td:last-of-type {
      border-top-right-radius: 4px;
    }
    tr:last-of-type td:first-of-type {
      border-bottom-left-radius: 4px;
    }
    tr:last-of-type td:last-of-type {
      border-bottom-right-radius: 4px;
    }
    `
  );

  // TODO: gestire colore grigio di sfondo con variabile tema
  return (
    <Root>
      <TableContainer sx={{ marginBottom: '10px' }}>
        <Table stickyHeader aria-label={getLocalizedOrDefaultLabel('common', 'table.aria-label', 'Tabella di item')} data-cy="table(notifications)">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{
                    width: column.width,
                    borderBottom: 'none',
                    fontWeight: 600,
                  }}
                  sortDirection={sort && sort.orderBy === column.id ? sort.order : false}
                >
                  {sort && column.sortable ? (
                    <TableSortLabel
                      active={sort.orderBy === column.id}
                      direction={sort.orderBy === column.id ? sort.order : 'asc'}
                      onClick={createSortHandler(column.id)}
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
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: 'background.paper' }}>
              {rows.map((row) => (
                <TableRow key={row.id} data-cy="table(notifications).row">
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{ width: column.width, borderBottom: 'none', cursor: column.onClick ? 'pointer': 'auto' }}
                      align={column.align}
                      onClick={() => column.onClick && column.onClick(row, column)}
                    >
                      {column.getCellLabel(row[column.id as keyof Notification], row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}

export default ItemsTable;
