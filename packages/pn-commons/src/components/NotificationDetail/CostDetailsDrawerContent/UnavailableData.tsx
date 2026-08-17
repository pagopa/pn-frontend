import React from 'react';

import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Stack, Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';

const UnavailableDataDrawerContent: React.FC = () => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <HelpOutlineRoundedIcon
      fontSize="small"
      sx={(theme) => ({ flexShrink: 0, color: theme.colors.neutral.grey[300] })}
    />
    <Typography variant="body2" fontSize="14px" color={(theme) => theme.palette.text.secondary}>
      {getLocalizedOrDefaultLabel('notifications', 'notification-alert.details.more-info')}
    </Typography>
  </Stack>
);

export default UnavailableDataDrawerContent;
