import React from 'react';
import TablePagination from '@mui/material/TablePagination';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';

import { Notification } from '../../redux/dashboard/types';

type Order = 'asc' | 'desc';

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

interface Column {
  id: string;
  label: string;
  width: string;
  align?: 'center' | 'inherit' | 'left' | 'right' | 'justify';
  sortable?: boolean;
}

function NotificationsTable(props: any) {
  // define pagination options
  const rowsPerPagination = [10, 20, 50, 100, 200, 500];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPagination[0]);

  // define table data
  const rows = props.notifications.map((n: Notification) => n);
  const columns: Array<Column> = [
    { id: 'sentAt', label: 'Data', width: '15%', sortable: true },
    { id: 'recipientId', label: 'Destinatario', width: '15%', sortable: true },
    { id: 'subject', label: 'Oggetto', width: '25%' },
    { id: 'iun', label: 'Codice IUN', width: '15%' },
    { id: 'groups', label: 'Gruppi', width: '15%' },
    { id: 'notificationStatus', label: 'Stato', width: '15%', align: 'center', sortable: true },
  ];

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

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 343px)' }}>
      <Table stickyHeader aria-label="Notifications table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ width: column.width }}
                sortDirection={orderBy === column.id ? order : false}
              >
                {column.sortable ?
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={createSortHandler(column.id)}
                  >
                    {column.label}
                    {(orderBy === column.id) ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel> :
                  column.label
                }
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          )
            .slice()
            .sort(getComparator(order, orderBy))
            .map((row: Notification) => (
              <TableRow key={row.paNotificationId}>
                <TableCell style={{ width: '15%' }}>{row.sentAt}</TableCell>
                <TableCell style={{ width: '15%' }}>{row.recipientId}</TableCell>
                <TableCell style={{ width: '25%' }}>{row.subject}</TableCell>
                <TableCell style={{ width: '15%' }}>{row.iun}</TableCell>
                <TableCell style={{ width: '15%' }}>---</TableCell>
                <TableCell style={{ width: '15%' }} align="center">
                  {row.notificationStatus}
                </TableCell>
              </TableRow>
            ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
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
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default NotificationsTable;
