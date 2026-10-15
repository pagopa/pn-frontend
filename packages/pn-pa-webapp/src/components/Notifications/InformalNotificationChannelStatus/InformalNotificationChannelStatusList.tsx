import { ReactNode } from 'react';

import { List } from '@mui/material';

type Props = {
  children: ReactNode;
};

const InformalNotificationChannelStatusList = ({ children }: Props) => (
  <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    {children}
  </List>
);

export default InformalNotificationChannelStatusList;
