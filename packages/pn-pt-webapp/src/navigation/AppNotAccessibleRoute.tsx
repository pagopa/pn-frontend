import { useSearchParams } from 'react-router-dom';

import { AppNotAccessible, AppNotAccessibleReason } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../services/configuration.service';

const AppNotAccessibleRoute: React.FC = () => {
  const [searchParams] = useSearchParams();

  const reasonParam = searchParams.get('reason');

  const reason: AppNotAccessibleReason =
    reasonParam === 'user-validation-failed' ? 'user-validation-failed' : 'not-accessible';

  const handleAction = () => {
    if (reason === 'not-accessible') {
      // eslint-disable-next-line functional/immutable-data
      globalThis.location.href = getConfiguration().LANDING_SITE_URL;
    } else {
      // eslint-disable-next-line functional/immutable-data
      globalThis.location.href = `mailto:${getConfiguration().PAGOPA_HELP_EMAIL}`;
    }
  };

  return <AppNotAccessible reason={reason} onAction={handleAction} />;
};

export default AppNotAccessibleRoute;
