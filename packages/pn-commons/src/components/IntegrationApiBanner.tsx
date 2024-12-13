import { Alert, Typography } from '@mui/material';
import React from 'react';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

const IntegrationApiBanner: React.FC = () => (
        <Alert severity="warning" data-testid="integrationApiBanner" sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={600}>
            {getLocalizedOrDefaultLabel('integrazioneApi', 'banner.title')}
        </Typography>
        <Typography variant="body2">
        {getLocalizedOrDefaultLabel('integrazioneApi', 'banner.description')}
        </Typography>
        </Alert>
    );

export default IntegrationApiBanner;