import React from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
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

function NotificationsTable(props: {columns: Array<Column>; rows: Array<Row>}) {
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
      <TableContainer sx={{ maxHeight: 'calc(100vh - 343px)', backgroundColor: '#F2F2F2', marginBottom: '10px' }}>
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
            {rows.length ? rows
              .slice()
              .sort(getComparator(order, orderBy))
              .map(row => (
                <TableRow key={row.id}>
                  {columns.map(c => ( 
                    <TableCell key={c.id} style={{ width: c.width, borderBottom: 'none' }} align={c.align}>
                      {c.getCellLabel(row[c.id as keyof Notification])}
                    </TableCell>
                  ))}
                </TableRow>
              )) :
              <TableRow>
                <TableCell colSpan={columns.length} align="center">Nessun elemento trovato</TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  );
}

export default NotificationsTable;
