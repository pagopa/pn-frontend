import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { NotificationDetailTableRow } from '../../types';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';

type Props = {
  rows: NotificationDetailTableRow[];
  notificationStatusPaid: boolean;
  openModal: () => void;
};

/**
 * Table with the details of a notification
 * @param rows data to show
 */
const NotificationDetailTable = ({ rows, notificationStatusPaid, openModal }: Props) => {
  const { t } = useTranslation(['common', 'notifiche', 'appStatus']);

  return (
    <TableContainer
      component={Paper}
      sx={{ px: 3, py: { xs: 3, lg: 2 } }}
      elevation={0}
      id="notification-detail"
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
          {notificationStatusPaid && (
            <Button
              variant="outlined"
              sx={{
                mb: {
                  xs: 3,
                  md: 2,
                },
                mt: {
                  xs: 3,
                  md: 2,
                },
                borderColor: '#D85757',
                outlineColor: '#D85757',
                color: '#D85757',
              }}
              onClick={openModal}
              data-testid="cancelNotificationBtn"
            >
              {t('detail.cancel-notification', { ns: 'notifiche' })}
            </Button>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NotificationDetailTable;
