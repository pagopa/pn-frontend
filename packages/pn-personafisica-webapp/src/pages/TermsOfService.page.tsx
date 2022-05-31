import { Box, Button, Grid, Switch, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Fragment, useState } from 'react';

import Link from '@mui/material/Link';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { useAppDispatch } from '../redux/hooks';
import { acceptToS } from '../redux/auth/actions';
import { NOTIFICHE } from '../navigation/routes.const';
import { URL_FILE_PRIVACY_DISCLAIMER, URL_FILE_TERMS_OF_SERVICE } from '../utils/constants';

const TermsOfService = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation('common');
  const [accepted, setAccepted] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const redirectPrivacyLink = () => window.location.assign(URL_FILE_PRIVACY_DISCLAIMER);

  const redirectToSLink = () => window.location.assign(URL_FILE_TERMS_OF_SERVICE);

  const handleAccept = () => {
    void dispatch(acceptToS()).then(() => {
      navigate(NOTIFICHE);
    });
  };

  return (
    <Fragment>
      <Grid container justifyContent="center" my={isMobile ? 4 : 16}>
        <Grid item xs={10} sm={8} md={4} display="flex" alignItems="center" flexDirection="column">
          <Typography mb={2} variant="h2" color="textPrimary" textAlign="center">
            {t('tos.title')}
          </Typography>

          <Typography textAlign="center" variant="body1">
            <Trans i18nKey={'tos.body'}>
              Entra con SPID o CIE.
              <br />
              Seleziona la modalità di autenticazione che preferisci.
            </Trans>
          </Typography>
          <Box display="flex" alignItems="center" mt={8}>
            <Switch
              value={accepted}
              onClick={() => setAccepted(!accepted)}
              data-testid="tosSwitch"
            />
            <Typography color="text.secondary" variant="body1">
              <Trans
                i18nKey="tos.switchLabel"
                shouldUnescape
                components={[
                  <Link
                    key="privacy-link"
                    sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
                    onClick={redirectPrivacyLink}
                  />,
                  <Link
                    key={'tos-link'}
                    data-testid="terms-and-conditions"
                    sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
                    onClick={redirectToSLink}
                  />,
                ]}
              >
                Accetto l&apos;
                <Link
                  sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
                  onClick={redirectPrivacyLink}
                >
                  Informativa Privacy
                </Link>
                {' e i '}
                <Link
                  sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
                  onClick={redirectToSLink}
                >
                  Termini e condizioni d&apos;uso
                </Link>
                di Piattaforma Notifiche.
              </Trans>
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{ margin: '24px 0' }}
            disabled={!accepted}
            onClick={handleAccept}
            data-testid="accessButton"
          >
            {t('tos.button')}
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default TermsOfService;
