import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { AppRouteParams, Layout, useIsMobile } from '@pagopa-pn/pn-commons';
import { CieIcon, SpidIcon } from '@pagopa/mui-italia/dist/icons';

import { getConfiguration } from '../../services/configuration.service';
import { TrackEventType } from '../../utility/events';
import { trackEventByType } from '../../utility/mixpanel';
import { storageAarOps, storageSpidSelectedOps } from '../../utility/storage';
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
  const { t, i18n } = useTranslation(['login']);
  const isMobile = useIsMobile();
  const [params] = useSearchParams();
  const aar = params.get(AppRouteParams.AAR);
  const { URL_API_LOGIN, SPID_CIE_ENTITY_ID, PAGOPA_HELP_EMAIL } = getConfiguration();

  if (aar !== null && aar !== '') {
    storageAarOps.write(aar);
  }

  const goCIE = () => {
    storageSpidSelectedOps.write(SPID_CIE_ENTITY_ID);
    window.location.assign(
      `${URL_API_LOGIN}/login?entityID=${SPID_CIE_ENTITY_ID}&authLevel=SpidL2`
    );
    trackEventByType(TrackEventType.LOGIN_IDP_SELECTED, {
      SPID_IDP_NAME: 'CIE',
      SPID_IDP_ID: SPID_CIE_ENTITY_ID,
    });
  };

  if (showIDPS) {
    return <SpidSelect onBack={() => setShowIDPS(false)} />;
  }

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  const handleAssistanceClick = () => {
    trackEventByType(TrackEventType.CUSTOMER_CARE_MAILTO, { source: 'postlogin' });
    // eslint-disable-next-line functional/immutable-data
    window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
  };

  return (
    <Layout
      productsList={[]}
      onAssistanceClick={handleAssistanceClick}
      onLanguageChanged={changeLanguageHandler}
      showSideMenu={false}
      loggedUser={{
        id: '',
        name: undefined,
        surname: undefined,
        email: undefined,
      }}
    >
      <Grid container direction="column" my={isMobile ? 4 : 16} id="loginPage">
        <Grid container item justifyContent="center">
          <Grid item>
            <Typography
              id="login-mode-page-title"
              component="h2"
              variant="h3"
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
              variant="body1"
              mb={isMobile ? 4 : 7}
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
                boxShadow: (theme) => theme.shadows[8],
                borderRadius: '16px',
                px: 1,
                py: 3,
                backgroundColor: 'white',
              }}
            >
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
                  id="cieButton"
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
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};
export default Login;
