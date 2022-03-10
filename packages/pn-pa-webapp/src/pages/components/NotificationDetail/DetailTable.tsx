import { ReactNode } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Box } from "@mui/material";

import { NotificationDetail } from '@pagopa-pn/pn-commons/src/types/Notifications';
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";

type Props = {
  notification: NotificationDetail;
};

const DetailTable = ({notification}: Props) => {
  const sender = useAppSelector((state: RootState) => state.userState.user.organization?.id);
  const detailTable: Array<{ id: number; label: string; value: ReactNode }> = [
    { id: 1, label: 'Data', value: <Box fontWeight={600}>{notification.sentAt}</Box> },
    { id: 2, label: 'Termini di pagamento', value: `Entro il ` },
    { id: 3, label: 'Destinatario', value: <Box fontWeight={600}>{notification.recipients[0]?.taxId}</Box> },
    { id: 4, label: 'Cognome Nome', value: <Box fontWeight={600}>{notification.recipients[0]?.denomination}</Box> },
    { id: 5, label: 'Mittente', value: <Box fontWeight={600}>{sender}</Box> },
    { id: 6, label: 'Codice IUN annullato', value: <Box fontWeight={600}>{notification.cancelledIun}</Box> },
    { id: 7, label: 'Codice IUN', value: <Box fontWeight={600}>{notification.cancelledByIun}</Box> },
    { id: 8, label: 'Gruppi', value: '' },
  ];

  return (
    <TableContainer component={Paper} sx={{ margin: '20px 0' }} className="paperContainer">
      <Table aria-label="notification detail">
        <TableBody>
          {detailTable.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
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