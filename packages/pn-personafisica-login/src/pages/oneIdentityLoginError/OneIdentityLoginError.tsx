import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Button, CircularProgress, Dialog, Typography } from '@mui/material';
import { sanitizeString } from '@pagopa-pn/pn-commons';
import { IllusError } from '@pagopa/mui-italia';

import { OneIdentityApi } from '../../api/OneIdentity/OneIdentity.api';
import { OidcStateDataResponse } from '../../models/OneIdentity';
import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { ROUTE_ONE_IDENTITY_LOGIN } from '../../navigation/routes.const';
import PFLoginEventStrategyFactory from '../../utility/MixpanelUtils/PFLoginEventStrategyFactory';

const getErrorMessage = (error: string | null) => {
  switch (error) {
    case 'invalid_scope':
      return 'loginError.oneIdentity.invalid_scope';
    case 'unsupported_response_type':
      return 'loginError.oneIdentity.unsupported_response_type';
    case 'server_error':
      return 'loginError.oneIdentity.server_error';
    case 'invalid_request':
      return 'loginError.oneIdentity.invalid_request';
    default:
      return 'loginError.message';
  }
};

const OneIdentityLoginError: React.FC = () => {
  const { t } = useTranslation(['login', 'common']);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const [stateData, setStateData] = useState<{
    data: OidcStateDataResponse | null;
    loading: boolean;
  }>({
    data: null,
    loading: !!state,
  });

  const goToLogin = () => {
    const { aar, retrievalId } = stateData.data ?? {};
    const params = new URLSearchParams();

    if (aar) {
      params.set('aar', sanitizeString(aar));
    } else if (retrievalId) {
      params.set('retrievalId', sanitizeString(retrievalId));
    }

    const query = params.size > 0 ? `?${params}` : '';

    navigate(`${ROUTE_ONE_IDENTITY_LOGIN}${query}`);
  };

  const trackMixpanelErrorEvent = (idp: string) => {
    if (process.env.NODE_ENV !== 'test') {
      PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_LOGIN_FAILURE, {
        reason: error,
        IDP: idp,
      });
    }
  };

  useEffect(() => {
    if (state) {
      void OneIdentityApi.getOidcStateData(state)
        .then((response) => {
          setStateData({ loading: false, data: response });
          trackMixpanelErrorEvent(response.idp);
        })
        .catch(() => setStateData({ loading: false, data: null }));
    }
  }, [state]);

  return (
    <Dialog fullScreen={true} open={true} aria-labelledby="dialog-per-messaggi-di-errore">
      <Box m="auto" sx={{ textAlign: 'center', width: '100%' }} id="oneIdentityErrorDialog">
        <IllusError />
        <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: '600' }} mt={5}>
          {t('loginError.title')}
        </Typography>
        <Typography variant="body2" id="message" mb={8}>
          {t(getErrorMessage(error))}
        </Typography>
        <Button
          id="login-button"
          variant="contained"
          onClick={goToLogin}
          disabled={stateData.loading}
          startIcon={stateData.loading ? <CircularProgress size={20} color="inherit" /> : undefined}
        >
          {t('button.go-to-login', { ns: 'common' })}
        </Button>
      </Box>
    </Dialog>
  );
};

export default OneIdentityLoginError;
