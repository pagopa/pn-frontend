import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { SentimentDissatisfied } from '@mui/icons-material';

import { Notification } from '../../types/Notifications';
import { Column, Row, Sort } from '../../types/NotificationsTable';

type Props = {
  /** Table columns */
  columns: Array<Column>;
  /** Table rows */
  rows: Array<Row>;
  /** Table sort */
  sort?: Sort;
  /** The function to be invoked if the user change sorting */
  onChangeSorting?: (s: Sort) => void;
};

function NotificationsTable({ columns, rows, sort, onChangeSorting }: Props) {
  const createSortHandler = (property: string) => () => {
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

  const theme = useTheme();

  // TODO: gestire colore grigio di sfondo con variabile tema
  return (
    <Root>
      <TableContainer sx={{ backgroundColor: '#F2F2F2', marginBottom: '10px' }}>
        <Table stickyHeader aria-label="Tabella lista notifiche">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{
                    width: column.width,
                    backgroundColor: '#F2F2F2',
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
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id} sx={{ cursor: 'pointer' }}>
                  {columns.map((c) => (
                    <TableCell
                      key={c.id}
                      sx={{ width: c.width, borderBottom: 'none' }}
                      align={c.align}
                      onClick={() => c.onClick && c.onClick(row, c)}
                    >
                      {c.getCellLabel(row[c.id as keyof Notification], row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <SentimentDissatisfied sx={{ verticalAlign: 'middle', margin: '0 20px' }} />
                  <span>I filtri che hai aggiunto non hanno dato nessun risultato.</span>
                  &nbsp;
                  <span
                    style={{
                      color: theme.palette.primary.main,
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Rimuovi filtri
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}

export default NotificationsTable;
