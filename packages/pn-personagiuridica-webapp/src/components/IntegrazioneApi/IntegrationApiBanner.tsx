import { Alert, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
    isAdminWithoutGroups : boolean;
};

const IntegrationApiBanner = ({ isAdminWithoutGroups }:Props) => {
    const { t } = useTranslation(['integrazioneApi', 'common']);
    return (
        <Alert severity="warning" data-testid="integrationApiBanner" sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={600}>
            {t('banner.title')}
        </Typography>
        <Typography variant="body2">
        {t(isAdminWithoutGroups ? 'banner.description-admin': 'banner.description-operator' )}
        </Typography>
        </Alert>
    );
};

export default IntegrationApiBanner;