import React from 'react';

import { TableBody } from '@mui/material';

import NotificationDetailTableBodyRow from './NotificationDetailTableBodyRow';

type Props = {
  testId?: string;
  children?: React.ReactNode;
};

const NotificationDetailTableBody: React.FC<Props> = ({ testId, children }) => {
  const rows = children
    ? React.Children.toArray(children).filter(
        (child) => (child as JSX.Element).type === NotificationDetailTableBodyRow
      )
    : [];
  return <TableBody data-testid={testId}>{rows}</TableBody>;
};

export default NotificationDetailTableBody;
