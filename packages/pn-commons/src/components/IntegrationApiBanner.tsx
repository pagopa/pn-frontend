import { Alert, Typography } from '@mui/material';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

type Props = {
    isAdminWithoutGroups : boolean;
};

const IntegrationApiBanner = ({ isAdminWithoutGroups }:Props) => (
        <Alert severity="warning" data-testid="integrationApiBanner" sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={600}>
            {getLocalizedOrDefaultLabel('integrazioneApi', 'banner.title')}
        </Typography>
        <Typography variant="body2">
        {getLocalizedOrDefaultLabel('integrazioneApi', isAdminWithoutGroups ? 'banner.description-admin': 'banner.description-operator' )}
        </Typography>
        </Alert>
    );

export default IntegrationApiBanner;