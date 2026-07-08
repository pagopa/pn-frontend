import { useSearchParams } from 'react-router-dom';

import { Box, Typography } from '@mui/material';
import { AppNotAccessible, AppNotAccessibleReason } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../services/configuration.service';

const AppNotAccessibleRoute: React.FC = () => {
  const [searchParams] = useSearchParams();

  const reasonParam = searchParams.get('reason');

  const reason: AppNotAccessibleReason =
    reasonParam === 'user-validation-failed' ? 'user-validation-failed' : 'not-accessible';

  const validationDebug = (() => {
    if (reason !== 'user-validation-failed') {
      return null;
    }

    const rawDebug = sessionStorage.getItem('fimsValidationDebug');

    if (!rawDebug) {
      return null;
    }

    try {
      return JSON.stringify(JSON.parse(rawDebug), null, 2);
    } catch {
      return rawDebug;
    }
  })();

  const handleAction = () => {
    if (reason === 'not-accessible') {
      // eslint-disable-next-line functional/immutable-data
      globalThis.location.href = getConfiguration().LANDING_SITE_URL;
    } else {
      // eslint-disable-next-line functional/immutable-data
      globalThis.location.href = `mailto:${getConfiguration().PAGOPA_HELP_EMAIL}`;
    }
  };

  return (
    <>
      <AppNotAccessible reason={reason} onAction={handleAction} />

      {validationDebug && (
        <Box
          data-testid="fims-validation-debug"
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            right: 16,
            p: 2,
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: 'error.main',
            borderRadius: 1,
            zIndex: (theme) => theme.zIndex.modal + 1,
            maxHeight: '70vh',
            overflow: 'auto',
            boxShadow: 4,
          }}
        >
          <Typography variant="subtitle2" mb={1}>
            FIMS user validation debug
          </Typography>
          <Typography
            component="pre"
            variant="body2"
            sx={{
              m: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {validationDebug}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default AppNotAccessibleRoute;
