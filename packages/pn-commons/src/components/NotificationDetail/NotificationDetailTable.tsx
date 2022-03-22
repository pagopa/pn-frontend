import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { DetailTableRow } from '../../types/NotificationDetailTable';

type Props = {
  rows: Array<DetailTableRow>;
};

/**
 * Table with the details of a notification
 * @param rows data to show
 */
const NotificationDetailTable = ({ rows }: Props) => {
  return (
    <TableContainer component={Paper} sx={{ margin: '20px 0' }} className="paperContainer">
      <Table aria-label="notification detail">
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{row.label}</TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NotificationDetailTable;
