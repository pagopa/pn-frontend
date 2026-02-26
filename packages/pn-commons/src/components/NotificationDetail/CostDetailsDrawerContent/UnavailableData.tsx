import React from 'react';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Stack, Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';

const UnavailableDataDrawerContent: React.FC = () => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <HelpOutlineIcon fontSize="small" sx={{ flexShrink: 0, color: '#BBC2D6' }} />
    <Typography variant="body2" fontSize="14px" color="#555C70">
      {getLocalizedOrDefaultLabel(
        'notifications',
        'notification-alert.details.more-info',
        'Contatta l’ente che ti ha inviato la notifica per avere maggiori dettagli sui costi di questa comunicazione.'
      )}
    </Typography>
  </Stack>
);

export default UnavailableDataDrawerContent;
