import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { ButtonNaked } from '@pagopa/mui-italia';

import { Column, Item, Sort } from '../../models';
import { buttonNakedInheritStyle } from '../../utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

type Props<ColumnId> = {
  /** Table columns */
  columns: Array<Column<ColumnId>>;
  /** Table rows */
  rows: Array<Item>;
  /** Table sort */
  sort?: Sort<ColumnId>;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort<ColumnId>) => void;
  /** Table title used in aria-label */
  ariaTitle?: string;
  /** Table test id */
  testId?: string;
};

function ItemsTable<ColumnId extends string>({
  columns,
  rows,
  sort,
  onChangeSorting,
  ariaTitle,
  testId = 'table(notifications)',
}: Props<ColumnId>) {
  const sortHandler = (property: ColumnId) => () => {
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
        <Table
          id="notifications-table"
          stickyHeader
          aria-label={
            ariaTitle ?? getLocalizedOrDefaultLabel('common', 'table.aria-label', 'Tabella di item')
          }
          data-testid={testId}
        >
          <TableHead role="rowgroup" data-testid="tableHead">
            <TableRow role="row">
              {columns.map((column) => (
                <TableCell
                  scope="col"
                  data-testid="tableHeadCell"
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
              ))}
            </TableRow>
          </TableHead>
          <TableBody
            sx={{ backgroundColor: 'background.paper' }}
            role="rowgroup"
            data-testid="tableBody"
          >
            {rows.map((row, index) => (
              <TableRow
                id={`${testId}.row`}
                key={row.id}
                data-testid={`${testId}.row`}
                role="row"
                aria-rowindex={index + 1}
              >
                {columns.map((column) => {
                  const cellValue = column.getCellLabel(row[column.id as keyof Item], row);
                  return (
                    <TableCell
                      key={column.id}
                      role="cell"
                      data-testid="tableBodyCell"
                      sx={{
                        width: column.width,
                        borderBottom: 'none',
                        cursor: column.onClick ? 'pointer' : 'auto',
                      }}
                      align={column.align}
                      onClick={() => column.onClick && column.onClick(row, column)}
                    >
                      {column.onClick && (
                        <>
                          {/* Even there is a onClick function on the TableCell, leave ButtonNaked below as is.
                          This makes spacebar key with accessibility to trigger the onClick function.
                          The ButtonNaked "inherits" the onClick action from the outer TableCell, so that is not necessary to replicate it. */}
                          <ButtonNaked
                            id={`tableItem-${column.id}-${row.id}`}
                            tabIndex={column.disableAccessibility ? -1 : 0}
                            sx={buttonNakedInheritStyle}
                          >
                            {cellValue}
                          </ButtonNaked>
                        </>
                      )}
                      {!column.onClick && (
                        <Box
                          id={`tableItem-${column.id}-${row.id}`}
                          tabIndex={column.disableAccessibility ? -1 : 0}
                        >
                          {cellValue}
                        </Box>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}

export default ItemsTable;
