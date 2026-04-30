import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Divider, Grid, Typography, styled } from '@mui/material';
import {
  Layout,
  PRIVACY_LINK_RELATIVE_PATH as PRIVACY_POLICY,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { CieIcon, SpidIcon } from '@pagopa/mui-italia/icons';

import sendLogo from '../../assets/send.svg';
import IOSmartAppBanner from '../../components/IoSmartAppBanner';
import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { getConfiguration } from '../../services/configuration.service';
import PFLoginEventStrategyFactory from '../../utility/MixpanelUtils/PFLoginEventStrategyFactory';

const LoginButton = styled(Button)(() => ({
  borderRadius: '4px',
  width: '100%',
  height: '50px',
  '& .MuiButton-startIcon': {
    svg: {
      fontSize: '25px',
    },
  },
}));

const unloggedUser = {
  id: '',
  name: undefined,
  surname: undefined,
  email: undefined,
};

const OneIdentityLogin: React.FC = () => {
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation(['login']);
  const {
    SPID_CIE_ENTITY_ID,
    PAGOPA_HELP_EMAIL,
    PF_URL,
    IS_SMART_APP_BANNER_ENABLED,
    ACCESSIBILITY_LINK,
    SERCQ_SERVICE_STATEMENT_LINK,
  } = getConfiguration();

  const privacyPolicyUrl = `${PF_URL}${PRIVACY_POLICY}`;
  const smartBannerHeight = IS_SMART_APP_BANNER_ENABLED ? 66 : 0;

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  const handleAssistanceClick = () => {
    // eslint-disable-next-line functional/immutable-data
    window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
  };

  const goCIE = () => {
    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_IDP_SELECTED, {
      SPID_IDP_NAME: 'CIE',
      SPID_IDP_ID: SPID_CIE_ENTITY_ID,
    });
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
        privacyPolicyHref={privacyPolicyUrl}
        accessibilityLink={ACCESSIBILITY_LINK}
        sercqServiceStatementLink={SERCQ_SERVICE_STATEMENT_LINK}
        loggedUser={unloggedUser}
        slotsProps={{
          content: {
            bgcolor: 'white',
            minHeight: isMobile ? `calc(100dvh - 44px - ${smartBannerHeight}px)` : undefined,
          },
        }}
      >
        <Box
          sx={isMobile ? { position: 'sticky', top: 0, bgcolor: 'white', zIndex: 1 } : undefined}
        >
          <Box px={3} py={2}>
            <img src={sendLogo} alt="" height={isMobile ? '48px' : '70px'} aria-hidden />
          </Box>
          <Divider />
        </Box>
        <Box
          sx={
            isMobile
              ? {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: `calc(100dvh - 44px - ${smartBannerHeight}px - 81px)`,
                }
              : undefined
          }
        >
          <Grid
            container
            direction="column"
            my={isMobile ? 0 : 10}
            alignItems="center"
            id="loginPage"
            alignContent={isMobile ? 'center' : 'normal'}
          >
            <Grid item px={3}>
              <Typography
                id="login-mode-page-title"
                component="h1"
                textAlign="center"
                fontWeight={700}
                fontSize="36px"
                sx={{
                  color: '#0E0F13',
                }}
              >
                {t('loginPage.title')}
              </Typography>
              <Typography
                component="h2"
                textAlign="center"
                sx={{
                  mb: 5,
                  mt: 1,
                  color: '#555C70',
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
              <LoginButton
                id="spidButton"
                variant="contained"
                onClick={() => void 0}
                startIcon={<SpidIcon />}
                sx={{
                  mb: 3,
                }}
              >
                {t('loginPage.loginBox.spidLogin')}
              </LoginButton>
              <LoginButton
                id="cieButton"
                variant="contained"
                onClick={() => goCIE()}
                startIcon={<CieIcon />}
              >
                {t('loginPage.loginBox.cieLogin')}
              </LoginButton>
            </Grid>
          </Grid>
        </Box>
        {/* <SpidSelect onClose={closeIDPS} show={showIDPS} rapidAccess={rapidAccess} /> */}
      </Layout>
    </>
  );
};

export default OneIdentityLogin;
