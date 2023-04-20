import { Fragment, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Dialog, Typography } from '@mui/material';

import { trackEventByType } from "../../utils/mixpanel";
import { TrackEventType } from "../../utils/events";
import { getConfiguration } from "../../services/configuration.service";

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
  const errorCode = urlSearchParams.has("errorCode") ? urlSearchParams.get("errorCode") : null;

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
  const isImmediateRedirect = errorCode && ["19", "21", "22", "25"].includes(errorCode);

  const title = t('loginError.title');
  const message = (
    <Fragment>
      <Trans i18nKey="message">
        A causa di un errore del sistema non è possibile completare la procedura.
        <br />
        Ti chiediamo di riprovare più tardi.
      </Trans>
    </Fragment>
  );

  // log error
  useEffect(() => {
    handleError(window.location.search);
  }, []);

  // return to login after a timeout if !immediateRedirect
  useEffect(() => {
    const timeout = isImmediateRedirect ? null : setTimeout(() => {
      navigate(ROUTE_LOGIN);
    }, 3000); 

    return () => { if (timeout) { clearTimeout(timeout); } };
  }, []);
  
  // return to login immediately if immediateRedirect
  useEffect(() => {
    if (isImmediateRedirect) {
      navigate(ROUTE_LOGIN);
    }
  }, []);

  return isImmediateRedirect ? <div style={{ display: "none" }}>Redirecting...</div> : (
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
