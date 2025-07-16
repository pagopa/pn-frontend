import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {
  Layout,
  PRIVACY_LINK_RELATIVE_PATH as PRIVACY_POLICY,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { CieIcon, SpidIcon } from '@pagopa/mui-italia/dist/icons';

import sendLogo from '../../assets/send.svg';
import IOSmartAppBanner from '../../components/IoSmartAppBanner';
import SpidSelect from '../../components/SpidSelect';
import { useRapidAccessParam } from '../../hooks/useRapidAccessParam';
import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { getConfiguration } from '../../services/configuration.service';
import PFLoginEventStrategyFactory from '../../utility/MixpanelUtils/PFLoginEventStrategyFactory';
import { storageRapidAccessOps } from '../../utility/storage';

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
  const isMobile = useIsMobile('md');
  const rapidAccess = useRapidAccessParam();
  const {
    URL_API_LOGIN,
    SPID_CIE_ENTITY_ID,
    PAGOPA_HELP_EMAIL,
    PF_URL,
    IS_SMART_APP_BANNER_ENABLED,
  } = getConfiguration();
  const privacyPolicyUrl = `${PF_URL}${PRIVACY_POLICY}`;
  const smartBannerHeight = IS_SMART_APP_BANNER_ENABLED ? 66 : 0;

  if (rapidAccess) {
    storageRapidAccessOps.write(rapidAccess);
  }

  useEffect(() => {
    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_LOGIN);
  }, []);

  const goCIE = () => {
    sessionStorage.setItem('IDP', 'CIE');

    window.location.assign(
      `${URL_API_LOGIN}/login?entityID=${SPID_CIE_ENTITY_ID}&authLevel=SpidL2&RelayState=send`
    );

    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_IDP_SELECTED, {
      SPID_IDP_NAME: 'CIE',
      SPID_IDP_ID: SPID_CIE_ENTITY_ID,
    });
  };

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  const handleAssistanceClick = () => {
    // eslint-disable-next-line functional/immutable-data
    window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
  };

  const closeIDPS = () => {
    setShowIDPS(false);
  };

  return (
    <>
      {isMobile && IS_SMART_APP_BANNER_ENABLED && <IOSmartAppBanner />}
      <Layout
        productsList={[]}
        onAssistanceClick={handleAssistanceClick}
        currentLanguage={i18n.language}
        onLanguageChanged={changeLanguageHandler}
        showSideMenu={false}
        loggedUser={{
          id: '',
          name: undefined,
          surname: undefined,
          email: undefined,
        }}
        privacyPolicyHref={privacyPolicyUrl}
        slotsProps={
          isMobile
            ? {
                content: { minHeight: `calc(100dvh - 44px - ${smartBannerHeight}px)` },
                main: { alignContent: 'center' },
              }
            : undefined
        }
      >
        <Grid
          container
          direction="column"
          my={isMobile ? 4 : 16}
          alignItems="center"
          id="loginPage"
        >
          <Grid item mb={3}>
            <img src={sendLogo} alt="" aria-hidden />
          </Grid>
          <Grid item>
            <Typography
              id="login-mode-page-title"
              variant="h5"
              component="h1"
              px={3}
              color="textPrimary"
              sx={{
                textAlign: 'center',
              }}
            >
              {t('loginPage.title')}
            </Typography>
            <Typography
              variant="body1"
              component="h2"
              mb={isMobile ? 4 : 7}
              color="textPrimary"
              sx={{
                textAlign: 'center',
              }}
            >
              {t('loginPage.description')}
            </Typography>
          </Grid>

          <Grid
            item
            sx={{
              width: {
                xs: `${(100 / 12) * 10}%`,
                sm: `${(100 / 12) * 6}%`,
                md: `${(100 / 12) * 4}%`,
                lg: `${(100 / 12) * 4}%`,
                xl: `${(100 / 12) * 3}%`,
              },
            }}
          >
            <Box
              sx={{
                boxShadow: (theme) => theme.shadows[8],
                borderRadius: '16px',
                px: 1,
                py: 3,
                backgroundColor: 'white',
                textAlign: 'center',
              }}
            >
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
          </Grid>
        </Grid>
        <SpidSelect onClose={closeIDPS} show={showIDPS} />
      </Layout>
    </>
  );
};

export default Login;
