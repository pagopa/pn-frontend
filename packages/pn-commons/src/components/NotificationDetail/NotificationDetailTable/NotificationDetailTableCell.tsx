import { SxProps, TableCell } from '@mui/material';

type Props = {
  id?: string;
  cellProps?: SxProps;
  testId?: string;
};

const NotificationDetailTableCell: React.FC<Props> = ({ children, id, cellProps, testId }) => (
  <TableCell padding="none" data-testid={testId} id={id} sx={{ ...cellProps }}>
    {children}
  </TableCell>
);

export default NotificationDetailTableCell;
