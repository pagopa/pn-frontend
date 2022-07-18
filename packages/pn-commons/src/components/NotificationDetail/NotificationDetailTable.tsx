import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

import { NotificationDetailTableRow } from '../../types';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';

type Props = {
  rows: Array<NotificationDetailTableRow>;
};

/**
 * Table with the details of a notification
 * @param rows data to show
 */
const NotificationDetailTable = ({ rows }: Props) => (
  <TableContainer component={Paper} sx={{ px: 3, py: 2 }} className="paperContainer">
    <Table aria-label={getLocalizedOrDefaultLabel('notifications', 'detail.table-aria-label', 'Dettaglio notifica')}>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} sx={{ '& td': { border: 'none' }, verticalAlign: 'top' }}>
            <TableCell padding="none" sx={{ py: 1 }}>{row.label}</TableCell>
            <TableCell padding="none" sx={{ py: 1 }}>{row.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default NotificationDetailTable;
