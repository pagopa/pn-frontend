import React from 'react';

import { Table } from '@mui/material';

import NotificationDetailTableBody from './NotificationDetailTableBody';

type Props = {
  testId?: string;
  id?: string;
  label?: string;
};
const NotificationDetailTableContents: React.FC<Props> = ({
  children,
  id = 'notification-detail-table',
  testId = 'notificationDetailTable',
  label,
}) => {
  const bodies = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === NotificationDetailTableBody
      )
    : [];
  return (
    <Table id={id} aria-label={label} data-testid={testId}>
      {bodies}
    </Table>
  );
};

export default NotificationDetailTableContents;
