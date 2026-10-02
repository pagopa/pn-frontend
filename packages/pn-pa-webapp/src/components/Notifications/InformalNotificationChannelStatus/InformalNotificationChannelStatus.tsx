import { ComponentType, ReactNode } from 'react';

import { ListItem, ListItemIcon, Stack, SvgIconProps, Typography } from '@mui/material';
import { MIBoxedModule, Tag } from '@pagopa/mui-italia';

type Props = {
  channel: {
    icon: ReactNode;
    label: string;
  };
  status?: {
    icon?: {
      component: ComponentType<SvgIconProps>;
      color: string;
    };
    label: string;
  };
  description?: string;
};

const InformalNotificationChannelStatus = ({ channel, status, description }: Props) => (
  <ListItem disablePadding>
    <MIBoxedModule>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        flexWrap="wrap"
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <ListItemIcon sx={{ minWidth: 0 }}>{channel.icon}</ListItemIcon>

          <Typography variant="body2" fontWeight={600}>
            {channel.label}
          </Typography>
        </Stack>

        {status && (
          <Tag
            variant="default"
            icon={status.icon?.component}
            value={status.label}
            slotProps={{
              icon: {
                color: status.icon?.color,
              },
            }}
          />
        )}
      </Stack>

      {description && (
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      )}
    </MIBoxedModule>
  </ListItem>
);

export default InformalNotificationChannelStatus;
