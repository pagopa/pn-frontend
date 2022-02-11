import React from 'react';
import TablePagination from '@mui/material/TablePagination';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';

import { Notification } from '../../../redux/dashboard/types';
import { Column, Row, Order } from './types';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function NotificationsTable(props: any) {
  // define pagination options
  const rowsPerPagination = [10, 20, 50, 100, 200, 500];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPagination[0]);

  // define table data
  const columns: Array<Column> = props.columns;
  const rows: Array<Row> = props.rows;

  // define sort variables
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>(columns[0].id);
  const createSortHandler = (property: string) => () => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // Pagination handlers
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Table style
  const Root = styled('div')(
    () => `
    tr:first-child td:first-child {
      border-top-left-radius: 4px;
    }
    tr:first-child td:last-child {
      border-top-right-radius: 4px;
    }
    tr:last-child td:first-child {
      border-bottom-left-radius: 4px;
    }
    tr:last-child td:last-child {
      border-bottom-right-radius: 4px;
    }
    `
  );

  // TODO: gestire colore grigio di sfondo con variabile tema
  return (
    <Root>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 343px)', backgroundColor: '#F2F2F2' }}>
        <Table stickyHeader aria-label="Tabella lista notifiche">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{width: column.width, backgroundColor: '#F2F2F2', borderBottom: 'none', fontWeight: 600}}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ?
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={createSortHandler(column.id)}
                    >
                      {column.label}
                      {orderBy === column.id && (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      )}
                    </TableSortLabel> :
                    column.label
                  }
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: 'background.paper'}}>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            )
              .slice()
              .sort(getComparator(order, orderBy))
              .map(row => (
                <TableRow key={row.id}>
                  {columns.map(c => ( 
                    <TableCell key={row.id} style={{ width: c.width, borderBottom: 'none' }} align={c.align}>
                      {c.getCellLabel(row[c.id as keyof Notification])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={columns.length} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={rowsPerPagination}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'Righe per pagina',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{borderBottom: 'none'}}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Root>
  );
}

export default NotificationsTable;
