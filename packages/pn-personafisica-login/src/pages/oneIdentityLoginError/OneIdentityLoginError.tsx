import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Button, Dialog, Typography } from '@mui/material';
import { IllusError } from '@pagopa/mui-italia';

import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { ROUTE_ONE_IDENTITY_LOGIN } from '../../navigation/routes.const';
import PFLoginEventStrategyFactory from '../../utility/MixpanelUtils/PFLoginEventStrategyFactory';

const OneIdentityLoginError: React.FC = () => {
  const { t } = useTranslation(['login', 'common']);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  const goToLogin = () => navigate(ROUTE_ONE_IDENTITY_LOGIN);

  // const goToLogin = () => {
  //   const { aar, retrievalId } = stateData.data ?? {};
  //   const params = new URLSearchParams();

  //   if (aar) {
  //     params.set(AppRouteParams.AAR, sanitizeString(aar));
  //   } else if (retrievalId) {
  //     params.set(AppRouteParams.RETRIEVAL_ID, sanitizeString(retrievalId));
  //   }

  //   navigate({
  //     pathname: ROUTE_ONE_IDENTITY_LOGIN,
  //     search: params.toString(),
  //   });
  // };

  useEffect(() => {
    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: error,
    });
  }, []);

  return (
    <Dialog fullScreen={true} open={true} aria-labelledby="dialog-per-messaggi-di-errore">
      <Box m="auto" sx={{ textAlign: 'center', width: '100%' }} id="oneIdentityErrorDialog">
        <IllusError />
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
