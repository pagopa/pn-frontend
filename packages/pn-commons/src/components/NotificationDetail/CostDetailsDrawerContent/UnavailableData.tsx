import React from 'react';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Stack, Typography } from '@mui/material';
import { themeNext } from '@pagopa/mui-italia';

import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';

const UnavailableDataDrawerContent: React.FC = () => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <HelpOutlineIcon
      fontSize="small"
      sx={{ flexShrink: 0, color: themeNext.colors.neutral.grey[300] }}
    />
    <Typography variant="body2" fontSize="14px" color={themeNext.palette.text.secondary}>
      {getLocalizedOrDefaultLabel('notifications', 'notification-alert.details.more-info')}
    </Typography>
  </Stack>
);

export default UnavailableDataDrawerContent;
