import { useState } from 'react';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Trans, useTranslation } from 'react-i18next';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { CieIcon, SpidIcon } from '@pagopa/mui-italia/dist/icons';

import { styled } from '@mui/material/styles';
import Layout from '../../components/Layout';
import { IDPS } from '../../utils/IDPS';
import { ENV } from '../../utils/env';
import { storageSpidSelectedOps } from '../../utils/storage';
import SpidSelect from './SpidSelect';

const LoginButton = styled(Button)(() => ({
  '& .MuiButton-startIcon': {
    svg: {
      fontSize: '25px',
    },
  },
}));

const Login = () => {
  const [showIDPS, setShowIDPS] = useState(false);
  const { t } = useTranslation(['login']);
  const isMobile = useIsMobile();

  const goCIE = () => {
    storageSpidSelectedOps.write(ENV.SPID_CIE_ENTITY_ID);
    // () =>
    window.location.assign(
      `${ENV.URL_API.LOGIN}/login?entityID=${ENV.SPID_CIE_ENTITY_ID}&authLevel=SpidL2`
    );
    // TODO track event
    // trackEvent(
    //   'LOGIN_IDP_SELECTED',
    //   {
    //     SPID_IDP_NAME: 'CIE',
    //     SPID_IDP_ID: ENV.SPID_CIE_ENTITY_ID,
    //   },
    //   () =>
    //     window.location.assign(
    //       `${ENV.URL_API.LOGIN}/login?entityID=${ENV.SPID_CIE_ENTITY_ID}&authLevel=SpidL2`
    //     )
    // );
  };

  if (showIDPS) {
    return <SpidSelect onBack={() => setShowIDPS(false)} />;
  }

  const redirectPrivacyLink = () => window.location.assign(ENV.URL_FILE.PRIVACY_DISCLAIMER);

  const redirectToSLink = () => window.location.assign(ENV.URL_FILE.TERMS_AND_CONDITIONS);
  // trackEvent('LOGIN_PRIVACY', { SPID_IDP_NAME: 'LOGIN_PRIVACY' }, () =>
  //   window.location.assign(ENV.URL_FILE.PRIVACY_DISCLAIMER)
  // );

  return (
    <Layout>
      <Grid container direction="column" my={isMobile ? 4 : 16}>
        <Grid container item justifyContent="center">
          <Grid item>
            <Typography
              variant="h2"
              px={0}
              color="textPrimary"
              sx={{
                textAlign: 'center',
              }}
            >
              {t('loginPage.title')}
            </Typography>
          </Grid>
        </Grid>
        <Grid container item justifyContent="center">
          <Grid item>
            <Typography
              variant="body2"
              mb={7}
              color="textPrimary"
              sx={{
                textAlign: 'center',
              }}
            >
              {t('loginPage.description')}
            </Typography>
          </Grid>
        </Grid>

        <Grid container item justifyContent="center">
          <Grid item xs={10} sm={6} md={4} lg={4} xl={3}>
            <Box
              sx={{
                boxShadow:
                  '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
                borderRadius: '16px',
                p: 1,
              }}
            >
              <Typography
                py={4}
                px={0}
                color="textPrimary"
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
                component="div"
              >
                {t('loginPage.loginBox.title')}
              </Typography>

              <Box display="flex" justifyContent="center" alignItems="center">
                <LoginButton
                  id="spidButton"
                  sx={{
                    borderRadius: '4px',
                    width: '90%',
                    height: '50px',
                    marginBottom: 1,
                  }}
                  onClick={() => setShowIDPS(true)}
                  variant="contained"
                  startIcon={<SpidIcon />}
                >
                  {t('loginPage.loginBox.spidLogin')}
                </LoginButton>
              </Box>

              <Box display="flex" justifyContent="center" alignItems="center">
                <LoginButton
                  sx={{
                    borderRadius: '4px',
                    width: '90%',
                    height: '50px',
                    marginTop: 1,
                  }}
                  variant="contained"
                  startIcon={<CieIcon />}
                  onClick={() => goCIE()}
                >
                  {t('loginPage.loginBox.cieLogin')}
                </LoginButton>
              </Box>

              <Box mt={4}>
                <Divider variant="middle" />
              </Box>

              <Typography
                py={3}
                px={0}
                color="textPrimary"
                variant="body1"
                sx={{
                  textAlign: 'center',
                }}
                component="div"
              >
                <Trans i18nKey="loginPage.hintText">
                  Non hai SPID?
                  <Link href={IDPS.richiediSpid} color="#0062C3 !important">
                    Scopri di più
                  </Link>
                </Trans>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container item justifyContent="center">
          <Grid item xs={10} sm={6} md={4} lg={4} xl={3}>
            <Typography
              color="textPrimary"
              py={3}
              px={0}
              sx={{
                textAlign: 'center',
              }}
              component="div"
              variant="body1"
            >
              <Trans
                i18nKey="loginPage.privacyAndCondition"
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
                Autenticandoti dichiari di aver letto e compreso l&apos;
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
                {" dell'Area Riservata."}
              </Trans>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default Login;
