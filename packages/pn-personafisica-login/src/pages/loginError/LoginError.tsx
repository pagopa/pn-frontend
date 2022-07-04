import {Fragment, useEffect} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {Box, Dialog, Typography} from '@mui/material';

import {trackEventByType} from "@pagopa-pn/pn-personafisica-webapp/src/utils/mixpanel";
import {TrackEventType} from "@pagopa-pn/pn-personafisica-webapp/src/utils/events";
import {storageSpidSelectedOps} from '../../utils/storage';
import {ROUTE_LOGIN} from '../../utils/constants';

const handleError = (queryParams: string) => {
  if (process.env.NODE_ENV !== 'test') {
    storageSpidSelectedOps.read();
    trackEventByType(TrackEventType.LOGIN_FAILURE, { reason: queryParams, idp: spidId });
    console.error(`login unsuccessfull! query params obtained from idp: ${queryParams}`);
  }
};

const LoginError = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate(ROUTE_LOGIN);
    }, 3000);
    handleError(window.location.search);

    return () => clearTimeout(timeout);
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
