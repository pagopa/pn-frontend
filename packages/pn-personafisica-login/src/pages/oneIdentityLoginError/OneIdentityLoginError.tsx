import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Button, Dialog, Typography } from '@mui/material';
import { IllusMIError } from '@pagopa/mui-italia';

import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { ROUTE_ONE_IDENTITY_LOGIN } from '../../navigation/routes.const';
import PFLoginEventStrategyFactory from '../../utility/MixpanelUtils/PFLoginEventStrategyFactory';

const KNOWN_ERROR_CODES = [
  'invalid_scope',
  'unsupported_response_type',
  'server_error',
  'invalid_request',
];

const OneIdentityLoginError: React.FC = () => {
  const { t } = useTranslation(['login', 'common']);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  const goToLogin = () => navigate(ROUTE_ONE_IDENTITY_LOGIN);

  useEffect(() => {
    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: error,
    });
    if (!error || !KNOWN_ERROR_CODES.includes(error)) {
      goToLogin();
    }
  }, []);

  return (
    <Dialog fullScreen={true} open={true} aria-labelledby="dialog-per-messaggi-di-errore">
      <Box m="auto" sx={{ textAlign: 'center', width: '100%' }} id="oneIdentityErrorDialog">
        <IllusMIError />
        <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: '600' }} mt={5}>
          {t('loginError.title')}
        </Typography>
        <Typography variant="body2" id="message" mb={8}>
          {t('loginError.message')}
        </Typography>
        <Button id="login-button" variant="contained" onClick={goToLogin}>
          {t('button.go-to-login', { ns: 'common' })}
        </Button>
      </Box>
    </Dialog>
  );
};

export default OneIdentityLoginError;
