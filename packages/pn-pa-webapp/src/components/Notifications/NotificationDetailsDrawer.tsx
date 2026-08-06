import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import CloseIcon from '@mui/icons-material/Close';
import { Box, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material';

export type NotificationDetailsDrawerItem = {
  label: ReactNode;
  value: ReactNode;
};

type Props = {
  open: boolean;
  title: string;
  details: Array<NotificationDetailsDrawerItem>;
  onClose: () => void;
};

const NotificationDetailsDrawer: React.FC<Props> = ({ open, title, details, onClose }) => {
  const { t } = useTranslation(['common']);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 420 },
          maxWidth: '100%',
        },
      }}
      data-testid="notificationDetailsDrawer"
    >
      <Stack padding={3} spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography component="h2" variant="h5">
            {title}
          </Typography>
          <IconButton
            aria-label={t('button.close', { ns: 'common' })}
            onClick={onClose}
            data-testid="notificationDetailsDrawerClose"
          >
            <CloseIcon sx={{ color: 'action.active', fontSize: 24 }} />
          </IconButton>
        </Stack>

        <Stack spacing={2} divider={<Divider aria-hidden />}>
          {details.map((detail, index) => (
            <Box key={index}>
              <Typography variant="body2" color="text.secondary">
                {detail.label}
              </Typography>
              <Typography component="div" variant="body2" color="text" fontWeight={600}>
                {detail.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default NotificationDetailsDrawer;
