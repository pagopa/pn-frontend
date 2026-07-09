import { useTranslation } from 'react-i18next';

import { MIAlert } from '@pagopa/mui-italia';

type Props = {
  isAdminWithoutGroups: boolean;
};

const IntegrationApiBanner = ({ isAdminWithoutGroups }: Props) => {
  const { t } = useTranslation(['integrazioneApi', 'common']);
  return (
    <MIAlert
      severity="warning"
      data-testid="integrationApiBanner"
      title={t('banner.title')}
      sx={{ mt: 2 }}
    >
      {t(isAdminWithoutGroups ? 'banner.description-admin' : 'banner.description-operator')}
    </MIAlert>
  );
};

export default IntegrationApiBanner;
