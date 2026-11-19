import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Grid, Link, Typography } from '@mui/material';
import { AppRouteParams, useIsMobile } from '@pagopa-pn/pn-commons';
import { type IDP, MISpidSelectOIDialog } from '@pagopa/mui-italia';

import { OneIdentityApi } from '../../api/OneIdentity/OneIdentity.api';
import sendLogo from '../../assets/send.svg';
import IOSmartAppBanner from '../../components/IoSmartAppBanner';
import LoginButtons from '../../components/OneIdentity/LoginButtons';
import OneIdentityLayout from '../../components/OneIdentity/OneIdentityLayout';
import { useRapidAccessParam } from '../../hooks/useRapidAccessParam';
import { OneIdentityErrorCode } from '../../models/OneIdentity';
import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { ROUTE_LOGIN_ERROR } from '../../navigation/routes.const';
import { getConfiguration } from '../../services/configuration.service';
import PFLoginEventStrategyFactory from '../../utility/MixpanelUtils/PFLoginEventStrategyFactory';

const HEADER_HEIGHT_PX = 44;
const SMART_BANNER_HEIGHT_PX = 66;
const LOGO_HEADER_HEIGHT_PX = 81;

const OneIdentityLogin: React.FC = () => {
  const { t } = useTranslation(['login']);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const rapidAccess = useRapidAccessParam();
  const {
    IS_SMART_APP_BANNER_ENABLED,
    DIGITAL_IDENTITY_LINK,
    ONE_IDENTITY_CIE_ENTITY_ID,
    ONE_IDENTITY_CDN_URL,
  } = getConfiguration();

  const [showIdpSelect, setShowIdpSelect] = useState(false);
  const [authorizingEntityId, setAuthorizingEntityId] = useState<string | null>(null);
  const [idpsState, setIdpsState] = useState<{
    idps: Array<IDP>;
    loading: boolean;
    error: boolean;
  }>({
    idps: [],
    loading: true,
    error: false,
  });

  const smartBannerHeight = IS_SMART_APP_BANNER_ENABLED ? SMART_BANNER_HEIGHT_PX : 0;
  const contentMinHeight = `calc(100dvh - ${HEADER_HEIGHT_PX}px - ${smartBannerHeight}px - ${LOGO_HEADER_HEIGHT_PX}px)`;

  const handleCloseIdpSelect = () => setShowIdpSelect(false);

  const handleCieClick = () => handleIdpLogin('CIE', ONE_IDENTITY_CIE_ENTITY_ID);

  const handleSpidClick = () => setShowIdpSelect(true);

  const handleSelectSpid = (idp: IDP) => handleIdpLogin(idp.friendlyName, idp.entityID);

  const handleIdpLogin = (spidName: string, entityId: string) => {
    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_IDP_SELECTED, {
      SPID_IDP_NAME: spidName,
      SPID_IDP_ID: entityId,
    });

    setAuthorizingEntityId(entityId);

    const [rapidAccessKey, rapidAccessValue] = rapidAccess ?? [];
    const aar = rapidAccessKey === AppRouteParams.AAR ? rapidAccessValue : undefined;
    const retrievalId =
      rapidAccessKey === AppRouteParams.RETRIEVAL_ID ? rapidAccessValue : undefined;

    OneIdentityApi.authorize({ entityId, aar, retrievalId })
      .then(({ location }) => {
        window.location.assign(location);
      })
      .catch(() => {
        navigate({
          pathname: ROUTE_LOGIN_ERROR,
          search: new URLSearchParams({ error: OneIdentityErrorCode.AUTHORIZE_ERROR }).toString(),
        });
      })
      .finally(() => {
        handleCloseIdpSelect();
        setAuthorizingEntityId(null);
      });
  };

  const trackUnivailableIDPEvent = (idp: IDP) => {
    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_IDP_NOT_AVAILABLE, {
      SPID_IDP_ID: idp.entityID,
      SPID_IDP_NAME: idp.friendlyName,
    });
  };

  const fetchIDPS = () => {
    void OneIdentityApi.getIdps()
      .then((response) =>
        setIdpsState({
          idps: response,
          loading: false,
          error: false,
        })
      )
      .catch(() => {
        setIdpsState({ idps: [], loading: false, error: true });
      });
  };

  useEffect(() => {
    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_LOGIN);

    fetchIDPS();
  }, []);

  return (
    <>
      {IS_SMART_APP_BANNER_ENABLED && <IOSmartAppBanner />}
      <OneIdentityLayout
        slotsProps={{
          content: {
            bgcolor: 'white',
            minHeight: isMobile
              ? `calc(100dvh - ${HEADER_HEIGHT_PX}px - ${smartBannerHeight}px)`
              : undefined,
          },
        }}
      >
        <Box sx={{ position: { xs: 'sticky', lg: 'static' }, top: 0, bgcolor: 'white', zIndex: 1 }}>
          <Box px={3} py={2}>
            <img src={sendLogo} alt="" height={isMobile ? '48px' : '70px'} aria-hidden />
          </Box>
          <Divider />
        </Box>

        <Box
          sx={{
            display: { xs: 'flex', lg: 'block' },
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { xs: contentMinHeight, lg: 'auto' },
          }}
        >
          <Grid
            container
            direction="column"
            my={{ xs: 0, lg: 10 }}
            alignItems="center"
            alignContent={{ xs: 'center', lg: 'normal' }}
            id="loginPage"
          >
            <Grid item px={3} width={{ xs: '100%', lg: '520px' }}>
              <Typography
                id="login-mode-page-title"
                component="h1"
                textAlign="center"
                fontWeight={700}
                fontSize={{ xs: '28px', lg: '36px' }}
                lineHeight={{ xs: '40px', lg: '50px' }}
                sx={{ color: 'text.primary' }}
              >
                {t('loginPage.title')}
              </Typography>
              <Typography
                component="h2"
                textAlign="center"
                sx={{ mb: 5, mt: 1, color: 'text.secondary' }}
              >
                {t('loginPage.description')}
              </Typography>
            </Grid>

            <LoginButtons
              authorizingEntityId={authorizingEntityId}
              handleCieClick={handleCieClick}
              handleSpidClick={handleSpidClick}
            />

            <Typography fontSize="16px" sx={{ mt: 3 }}>
              <Trans
                ns="login"
                i18nKey={'loginPage.missing-spid-cie'}
                components={[
                  <Link
                    key="spid-cie-link"
                    href={DIGITAL_IDENTITY_LINK}
                    target="_blank"
                    rel="noopener"
                    data-testid="spic-cie-link"
                    sx={{ cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                  />,
                ]}
              />
            </Typography>
          </Grid>
        </Box>
      </OneIdentityLayout>

      <MISpidSelectOIDialog
        show={showIdpSelect}
        idps={idpsState.idps}
        loading={idpsState.loading}
        error={idpsState.error}
        oneIdentityCdnBaseUrl={ONE_IDENTITY_CDN_URL}
        handleSelectIDP={handleSelectSpid}
        onClose={handleCloseIdpSelect}
        onUnavailableIdpClick={trackUnivailableIDPEvent}
        translationsMap={{
          title: t('one-identity-spid-select.title'),
          closeButtonAriaLabel: t('one-identity-spid-select.close-button-aria-label'),
          unavailableIdpWarning: t('one-identity-spid-select.unavailable-idp-warning'),
          error: {
            title: t('one-identity-spid-select.error.title'),
            description: t('one-identity-spid-select.error.description'),
            closeButton: t('one-identity-spid-select.error.close-button'),
          },
        }}
      />
    </>
  );
};

export default OneIdentityLogin;
