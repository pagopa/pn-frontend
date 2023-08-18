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
const NotificationDetailTable: React.FC<Props> = ({ children, rows }) => (
  <TableContainer
    component={Paper}
    sx={{ px: 3, py: { xs: 3, lg: 2 } }}
    elevation={0}
    id="notification-detail"
    data-testid="detailTable"
  >
    <Table
      aria-label={getLocalizedOrDefaultLabel(
        'notifications',
        'detail.table-aria-label',
        'Dettaglio notifica'
      )}
    >
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.id}
            sx={{
              '& td': { border: 'none' },
              verticalAlign: 'top',
              display: { xs: 'flex', lg: 'table-row' },
              flexDirection: { xs: 'column', lg: 'row' },
            }}
          >
            <TableCell id={`row-label-${row.id}`} padding="none" sx={{ py: { xs: 0, lg: 1 } }}>
              {row.label}
            </TableCell>
            <TableCell padding="none" sx={{ pb: 1, pt: { xs: 0, lg: 1 } }}>
              {row.value}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {children}
  </TableContainer>
);

export default NotificationDetailTable;
