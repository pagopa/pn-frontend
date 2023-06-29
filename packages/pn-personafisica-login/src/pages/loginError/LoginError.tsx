import { Box, Dialog, Typography } from '@mui/material';
import { Fragment, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getConfiguration } from '../../services/configuration.service';
import { TrackEventType } from '../../utils/events';
import { trackEventByType } from '../../utils/mixpanel';

const handleError = (queryParams: string) => {
  if (process.env.NODE_ENV !== 'test') {
    trackEventByType(TrackEventType.LOGIN_FAILURE, { reason: queryParams });
    console.error(`login unsuccessfull! query params obtained from idp: ${queryParams}`);
  }
};

const LoginError = () => {
  const { ROUTE_LOGIN } = getConfiguration();
  const { t } = useTranslation();
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
        return '';
    }
  };

  const title = t('loginError.title');
  const message = (
    <Fragment>
      <Trans i18nKey="message">{getErrorMessage()}</Trans>
    </Fragment>
  );

  // log error
  useEffect(() => {
    handleError(window.location.search);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(ROUTE_LOGIN);
    }, 5000);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <Dialog fullScreen={true} open={true} aria-labelledby="dialog-per-messaggi-di-errore">
      <Box m="auto" sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: '600' }}>
          {title}
        </Typography>
        <Typography variant="body2">{message}</Typography>
      </Box>
    </Dialog>
  );
};

export default LoginError;
