import React from 'react';

import { Paper, TableContainer } from '@mui/material';

import NotificationDetailTableAction from './NotificationDetailTable/NotificationDetailTableAction';
import NotificationDetailTableContents from './NotificationDetailTable/NotificationDetailTableContents';

type Props = {
  testId?: string;
  id?: string;
};

/**
 * Table with the details of a notification
 */
const NotificationDetailTable: React.FC<Props> = ({
  children,
  id = 'notification-detail',
  testId = 'detailTable',
}) => {
  const contents = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === NotificationDetailTableContents
      )
    : [];
  const actions = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === NotificationDetailTableAction
      )
    : [];
  return (
    <TableContainer
      component={Paper}
      sx={{ px: 3, py: { xs: 3, lg: 2 } }}
      elevation={0}
      id={id}
      data-testid={testId}
    >
      {contents}
      {actions}
    </TableContainer>
  );
};

export default NotificationDetailTable;
