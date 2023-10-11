import React from 'react';

import { TableRow } from '@mui/material';

import NotificationDetailTableCell from './NotificationDetailTableCell';

type Props = {
  testId?: string;
};

const NotificationDetailTableBodyRow: React.FC<Props> = ({
  children,
  testId = 'notificationDetailTableRow',
}) => {
  const cells = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === NotificationDetailTableCell
      )
    : [];
  return (
    <TableRow
      sx={{
        '& td': { border: 'none' },
        verticalAlign: 'top',
        display: { xs: 'flex', lg: 'table-row' },
        flexDirection: { xs: 'column', lg: 'row' },
      }}
      data-testid={testId}
    >
      {cells}
    </TableRow>
  );
};

export default NotificationDetailTableBodyRow;
