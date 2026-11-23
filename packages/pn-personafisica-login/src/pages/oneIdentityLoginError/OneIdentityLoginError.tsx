import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Stack, Typography } from '@mui/material';
import { IllusMIError, MIButton } from '@pagopa/mui-italia';

import OneIdentityLayout from '../../components/OneIdentity/OneIdentityLayout';
import { OneIdentityErrorCode } from '../../models/OneIdentity';
import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { ROUTE_LOGIN } from '../../navigation/routes.const';
import PFLoginEventStrategyFactory from '../../utility/MixpanelUtils/PFLoginEventStrategyFactory';

const KNOWN_ERROR_CODES: Array<string> = [
  OneIdentityErrorCode.INVALID_SCOPE,
  OneIdentityErrorCode.UNSUPPORTED_RESPONSE_TYPE,
  OneIdentityErrorCode.SERVER_ERROR,
  OneIdentityErrorCode.INVALID_REQUEST,
  OneIdentityErrorCode.AUTHORIZE_ERROR,
];

const OneIdentityLoginError: React.FC = () => {
  const { t } = useTranslation(['login', 'common']);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const goToLogin = () => navigate(ROUTE_LOGIN);

  useEffect(() => {
    /**
     * if error=access_denied, reason is error_description (19,20,21,22,23,25,30) already mapped in Mixpanel
     * otherwise reason is error
     */
    const reason =
      error === OneIdentityErrorCode.ACCESS_DENIED && errorDescription ? errorDescription : error;
    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason,
    });
    if (!error || !KNOWN_ERROR_CODES.includes(error)) {
      goToLogin();
    }
  }, []);

  return (
    <OneIdentityLayout>
      <Stack
        id="oneIdentityLoginError"
        alignItems="center"
        justifyContent="center"
        spacing={3}
        sx={{
          height: '100%',
          maxWidth: '368px',
          mx: 'auto',
          px: { xs: 3, sm: 0 },
          py: 8,
          textAlign: 'center',
        }}
      >
        <IllusMIError size={56} />
        <Stack spacing={1}>
          <Typography id="title" variant="h4" component="h1">
            {t('one-identity-login-error.title')}
          </Typography>
          <Typography id="message" variant="body1" color="text.secondary">
            {t('one-identity-login-error.message')}
          </Typography>
        </Stack>
        <MIButton id="close-button" variant="contained" onClick={goToLogin}>
          {t('button.close', { ns: 'common' })}
        </MIButton>
      </Stack>
    </OneIdentityLayout>
  );
};

export default OneIdentityLoginError;
