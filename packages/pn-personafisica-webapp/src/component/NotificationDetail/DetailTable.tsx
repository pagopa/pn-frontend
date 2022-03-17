import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Box } from '@mui/material';
import { NotificationDetail } from '@pagopa-pn/pn-commons/src/types/Notifications';

type Props = {
  notification: NotificationDetail;
};

const DetailTable = ({ notification }: Props) => {
  const { t } = useTranslation(['notifiche']);

  const detailTable: Array<{ id: number; label: string; value: ReactNode }> = [
    { id: 1, label: t('Data'), value: <Box fontWeight={600}>{notification.sentAt}</Box> },
    { id: 2, label: t('Termini di pagamento'), value: t(`Entro il `) },
    {
      id: 3,
      label: t('Destinatario'),
      value: <Box fontWeight={600}>{notification.recipients[0]?.taxId}</Box>,
    },
    {
      id: 4,
      label: t('Cognome Nome'),
      value: <Box fontWeight={600}>{notification.recipients[0]?.denomination}</Box>,
    },
    {
      id: 6,
      label: t('Codice IUN annullato'),
      value: <Box fontWeight={600}>{notification.cancelledIun}</Box>,
    },
    { id: 7, label: t('Codice IUN'), value: <Box fontWeight={600}>{notification.iun}</Box> },
    { id: 8, label: t('Gruppi'), value: '' },
  ];

  return (
    <TableContainer component={Paper} sx={{ margin: '20px 0' }} className="paperContainer">
      <Table aria-label="notification detail">
        <TableBody>
          {detailTable.map((row) => (
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

export default DetailTable;
