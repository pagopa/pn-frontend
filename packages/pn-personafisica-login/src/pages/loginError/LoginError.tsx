import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Box, Button, Dialog, Typography } from '@mui/material';
import { IllusError } from '@pagopa/mui-italia';

import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { ROUTE_LOGIN } from '../../navigation/routes.const';
import PFLoginEventStrategyFactory from '../../utility/MixpanelUtils/PFLoginEventStrategyFactory';

const handleError = (queryParams: string, errorMessage: string) => {
  if (process.env.NODE_ENV !== 'test') {
    const IDP = sessionStorage.getItem('IDP');
    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: errorMessage,
      IDP,
    });
    sessionStorage.removeItem('IDP');
    console.error(`login unsuccessfull! query params obtained from idp: ${queryParams}`);
  }
};

const LoginError = () => {
  const { t } = useTranslation(['login', 'common']);
  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();
  const errorCode = urlSearchParams.has('errorCode') ? urlSearchParams.get('errorCode') : null;

  // PN-1989 - per alcune causali di errore, si evita il passaggio transitorio per la pagina di errore
  //           e si fa il redirect verso la pagina di login immediatamente
  //           Queste causali sono:
  //           - 19 - Autenticazione fallita più volte della quantità di retry abilitata.
  //           - 21 - Timeout nel login.
  //           - 22 - L'utente nega il consenso al trattamento degli dati privati.
  //           - 25 - Login annullata dall'utente.
  //
  // Vedi elenco degli errori in https://www.agid.gov.it//sites/default/files/repository_files/tabella-messaggi-spid-v1.4.pdf
  // -----------------------------------
  // Carlos Lombardi, 2022.08.03
  // -----------------------------------
  const getErrorMessage = () => {
    switch (errorCode) {
      case '19':
        return t('loginError.code.error_19');
      case '20':
        return t('loginError.code.error_20');
      case '21':
        return t('loginError.code.error_21');
      case '22':
        return t('loginError.code.error_22');
      case '23':
        return t('loginError.code.error_23');
      case '25':
        return t('loginError.code.error_25');
      case '30':
        return t('loginError.code.error_30');
      case '1001':
        return t('loginError.code.error_1001');
      default:
        return t('loginError.message');
    }
  };

  const goToLogin = () => navigate(ROUTE_LOGIN);

  // log error
  useEffect(() => {
    handleError(window.location.search, errorCode!);
  }, []);

  return (
    <Dialog fullScreen={true} open={true} aria-labelledby="dialog-per-messaggi-di-errore">
      <Box m="auto" sx={{ textAlign: 'center', width: '100%' }} id="errorDialog">
        <IllusError />
        <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: '600' }} mt={5}>
          {t('loginError.title')}
        </Typography>
        <Typography variant="body2" id="message" mb={8}>
          {getErrorMessage()}
        </Typography>
        <Button id="login-button" variant="contained" onClick={goToLogin}>
          {t('button.go-to-login', { ns: 'common' })}
        </Button>
      </Box>
    </Dialog>
  );
};

export default LoginError;
