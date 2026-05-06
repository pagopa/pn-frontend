import {
  Paper,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { Theme } from '@mui/material/styles';

import { NotificationDetailTableRow } from '../../models/NotificationDetail';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

type Props = {
  rows: Array<NotificationDetailTableRow>;
  children?: React.ReactNode;
};

const rowSx: SxProps<Theme> = {
  '& td': { border: 'none' },
  verticalAlign: 'top',
  display: { xs: 'flex', lg: 'table-row' },
  flexDirection: { xs: 'column', lg: 'row' },
};

const cellLabelSx: SxProps<Theme> = {
  py: { xs: 0, lg: 1 },
  width: { lg: 180 },
  pr: { lg: 4 },
  whiteSpace: 'nowrap',
};

const cellValueSx: SxProps<Theme> = {
  pb: 1,
  pt: { xs: 0, lg: 1 },
  overflowWrap: 'anywhere',
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
      id="notification-detail-table"
      aria-label={getLocalizedOrDefaultLabel(
        'notifications',
        'detail.table-aria-label',
        'Dettaglio notifica'
      )}
      data-testid="notificationDetailTable"
    >
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} sx={rowSx} data-testid="notificationDetailTableRow">
            <TableCell id={`row-label-${row.id}`} padding="none" sx={cellLabelSx}>
              {row.label}
            </TableCell>
            <TableCell id={`row-value-${row.id}`} padding="none" sx={cellValueSx}>
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
