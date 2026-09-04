import { MIAlert } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks/useIsMobile';
import { AppCurrentStatus } from '../../models/AppStatus';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

export const AppStatusBar = ({ status }: { status: AppCurrentStatus }) => {
  const isMobile = useIsMobile();

  // labels
  const statusText = getLocalizedOrDefaultLabel(
    'appStatus',
    `appStatus.statusDescription.${status.appIsFullyOperative ? 'ok' : 'not-ok'}`,
    "Status dell'applicazione in questo momento: verde OK, rosso con problemi."
  );

  return (
    <MIAlert
      data-testid="app-status-bar"
      id="appStatusBar"
      severity={status.appIsFullyOperative ? 'success' : 'error'}
      sx={{ mt: isMobile ? '23px' : '42px' }}
    >
      {statusText}
    </MIAlert>
  );
};
