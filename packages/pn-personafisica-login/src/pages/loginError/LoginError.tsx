import { Dialog, Box, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { storageSpidSelectedOps } from '../../utils/storage';
import { redirectToLogin } from '../../utils/utils';

const handleError = (queryParams: string) => {
  storageSpidSelectedOps.read();
  // trackEvent('LOGIN_FAILURE', { reason: queryParams, idp: spidId });
  console.error(`login unsuccessfull! query params obtained from idp: ${queryParams}`);
};

const LoginError = () => {
  const { t } = useTranslation();
  setTimeout(() => redirectToLogin(), 3000);

  const title = t('loginError.title');
  const message = (
    <>
      <Trans i18nKey="message">
        A causa di un errore del sistema non è possibile completare la procedura.
        <br />
        Ti chiediamo di riprovare più tardi.
      </Trans>
    </>
  );
  handleError(window.location.search);

  return (
    <Dialog fullScreen={true} open={true} aria-labelledby="responsive-dialog-title">
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
