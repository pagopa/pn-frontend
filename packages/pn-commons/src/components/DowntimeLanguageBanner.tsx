import React from 'react';

import { Alert, Link, Typography } from '@mui/material';

import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

type Props = {
  downtimeExampleLink: string;
};

const DowntimeLanguageBanner: React.FC<Props> = ({ downtimeExampleLink }) => (
  <Alert severity="info" variant="outlined" data-testid="downtimeLanguageBanner" sx={{ mt: 2 }}>
    <Typography variant="body2">
      {getLocalizedOrDefaultLabel('common', 'downtime_language_banner.message')}
      &nbsp;
      <Link
        target="_blank"
        fontWeight="bold"
        data-testid="link-downtime-example"
        href={downtimeExampleLink}
        sx={{ cursor: 'pointer' }}
      >
        {getLocalizedOrDefaultLabel('common', 'downtime_language_banner.link')}
      </Link>
    </Typography>
  </Alert>
);

export default DowntimeLanguageBanner;
