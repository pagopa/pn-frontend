import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Box, Button, DialogTitle } from '@mui/material';
import {
  APP_VERSION,
  AppMessage,
  AppResponseMessage,
  Layout,
  PnDialog,
  PnDialogActions,
  ResponseEventDispatcher,
  SideMenu,
  addParamToUrl,
  appStateActions,
  errorFactoryManager,
  initLocalization,
  useHasPermissions,
  useMultiEvent,
  useTracking,
} from '@pagopa-pn/pn-commons';
import { PartyEntity, ProductEntity } from '@pagopa/mui-italia';

import { useMenuItems } from './hooks/useMenuItems';
import { PNRole } from './models/User';
import { goToLoginPortal } from './navigation/navigation.utility';
import Router from './navigation/routes';
import * as routes from './navigation/routes.const';
import { getCurrentAppStatus } from './redux/appStatus/actions';
import { apiLogout } from './redux/auth/actions';
import { resetState } from './redux/auth/reducers';
import { getDigitalAddresses } from './redux/contact/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { getSidemenuInformation } from './redux/sidemenu/actions';
import { RootState } from './redux/store';
import { getConfiguration } from './services/configuration.service';
import { PGAppErrorFactory } from './utility/AppError/PGAppErrorFactory';
import showLayoutParts from './utility/layout.utility';
import './utility/onetrust';

// Cfr. PN-6096
// --------------------
// The i18n initialization must execute before the *first* time anything is actually rendered.
// Cfr. comment in packages/pn-personafisica-webapp/src/App.tsx
// --------------------
const App = () => {
  const { t } = useTranslation(['common', 'notifiche']);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      // init localization
      initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
      // eslint-disable-next-line functional/immutable-data
      errorFactoryManager.factory = new PGAppErrorFactory((path, ns) => t(path, { ns }));
    }
  }, [isInitialized]);

  return isInitialized ? <ActualApp /> : <div />;
};

// eslint-disable-next-line complexity
const ActualApp = () => {
  const {
    MIXPANEL_TOKEN,
    PAGOPA_HELP_EMAIL,
    SELFCARE_BASE_URL,
    SELFCARE_CDN_URL,
    ACCESSIBILITY_LINK,
  } = getConfiguration();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation(['common', 'notifiche']);
  const [openModal, setOpenModal] = useState(false);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const lastError = useAppSelector((state: RootState) => state.appState.lastError);
  const { tosConsent, fetchedTos, privacyConsent, fetchedPrivacy } = useAppSelector(
    (state: RootState) => state.userState
  );
  const { pathname } = useLocation();

  const sessionToken = loggedUser.sessionToken;
  const jwtUser = useMemo(
    () => ({
      id: loggedUser.fiscal_number,
      name: loggedUser.name,
      surname: loggedUser.family_name,
      mail: loggedUser.email,
    }),
    [loggedUser]
  );

  const [showSideMenu] = useMemo(
    () =>
      showLayoutParts(
        pathname,
        !!sessionToken,
        tosConsent && tosConsent.accepted && fetchedTos,
        privacyConsent && privacyConsent.accepted && fetchedPrivacy
      ),
    [pathname, sessionToken, tosConsent, fetchedTos, privacyConsent, fetchedPrivacy]
  );

  const organization = loggedUser.organization;
  const role = loggedUser.organization?.roles ? loggedUser.organization?.roles[0] : null;
  const userHasAdminPermissions = useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]);
  const { menuItems, selfCareMenuItems } = useMenuItems(userHasAdminPermissions);

  // TODO: get products list from be (?)
  const productsList: Array<ProductEntity> = useMemo(
    () => [
      {
        id: '1',
        title: t('header.product.organization-dashboard'),
        productUrl: routes.PROFILE(organization?.id, i18n.language),
        linkType: 'external',
      },
      {
        id: '0',
        title: t('header.product.notification-platform'),
        productUrl: '',
        linkType: 'internal',
      },
    ],
    [t, organization?.id, i18n.language]
  );

  useTracking(MIXPANEL_TOKEN, process.env.NODE_ENV);

  useEffect(() => {
    if (sessionToken !== '') {
      if (userHasAdminPermissions) {
        void dispatch(getSidemenuInformation());
      }
      if (userHasAdminPermissions && !loggedUser.hasGroup) {
        void dispatch(getDigitalAddresses());
      }

      void dispatch(getCurrentAppStatus());
    }
  }, [sessionToken]);

  const partyList: Array<PartyEntity> = useMemo(
    () => [
      {
        id: '0',
        name: organization?.name,
        // productRole: role?.role,
        productRole: t(`roles.${role?.role}`),
        logoUrl: `${SELFCARE_CDN_URL}/institutions/${organization?.id}/logo.png`,
      },
    ],
    [role, organization, i18n.language]
  );

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  const handleAssistanceClick = () => {
    const url = addParamToUrl(`${SELFCARE_BASE_URL}/assistenza`, 'data', JSON.stringify(lastError));
    /* eslint-disable-next-line functional/immutable-data */
    window.location.href = sessionToken ? url : `mailto:${PAGOPA_HELP_EMAIL}`;
  };

  const [clickVersion] = useMultiEvent({
    callback: () =>
      dispatch(
        appStateActions.addSuccess({
          title: 'Current version',
          message: `v${APP_VERSION}`,
        })
      ),
  });

  const handleUserLogout = () => {
    setOpenModal(true);
  };

  const performLogout = async () => {
    await dispatch(apiLogout(loggedUser.sessionToken));
    dispatch(resetState());
    goToLoginPortal();
    setOpenModal(false);
  };

  return (
    <>
      <ResponseEventDispatcher />
      <Layout
        showHeader
        showFooter
        onExitAction={handleUserLogout}
        sideMenu={<SideMenu menuItems={menuItems} selfCareItems={selfCareMenuItems} />}
        showSideMenu={showSideMenu}
        productsList={productsList}
        productId={'0'}
        showHeaderProduct={
          tosConsent && tosConsent.accepted && privacyConsent && privacyConsent.accepted
        }
        loggedUser={jwtUser}
        currentLanguage={i18n.language}
        onLanguageChanged={changeLanguageHandler}
        onAssistanceClick={handleAssistanceClick}
        partyList={partyList}
        isLogged={!!sessionToken}
        hasTermsOfService={true}
        accessibilityLink={ACCESSIBILITY_LINK}
      >
        <PnDialog open={openModal}>
          <DialogTitle sx={{ mb: 2 }}>{t('header.logout-message')}</DialogTitle>
          <PnDialogActions>
            <Button id="cancelButton" variant="outlined" onClick={() => setOpenModal(false)}>
              {t('button.annulla')}
            </Button>
            <Button data-testid="confirm-button" variant="contained" onClick={performLogout}>
              {t('header.logout')}
            </Button>
          </PnDialogActions>
        </PnDialog>
        {/* <AppMessage sessionRedirect={async () => await dispatch(logout())} /> */}
        <AppMessage />
        <AppResponseMessage />
        <Router />
      </Layout>
      <Box onClick={clickVersion} sx={{ height: '5px', background: 'white' }}></Box>
    </>
  );
};

export default App;
