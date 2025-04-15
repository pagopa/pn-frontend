import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { People, SupervisedUserCircle } from '@mui/icons-material';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import SettingsEthernet from '@mui/icons-material/SettingsEthernet';
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
  SideMenuItem,
  appStateActions,
  errorFactoryManager,
  initLocalization,
  useHasPermissions,
  useMultiEvent,
  useTracking,
} from '@pagopa-pn/pn-commons';
import { PartyEntity, ProductEntity } from '@pagopa/mui-italia';

import { PNRole } from './models/User';
import { goToLoginPortal } from './navigation/navigation.utility';
import Router from './navigation/routes';
import * as routes from './navigation/routes.const';
import { getCurrentAppStatus } from './redux/appStatus/actions';
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
  const { MIXPANEL_TOKEN, PAGOPA_HELP_EMAIL, SELFCARE_BASE_URL, IS_B2B_ENABLED, SELFCARE_CDN_URL } =
    getConfiguration();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation(['common', 'notifiche']);
  const [openModal, setOpenModal] = useState(false);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const { tosConsent, fetchedTos, privacyConsent, fetchedPrivacy } = useAppSelector(
    (state: RootState) => state.userState
  );
  const pendingDelegators = useAppSelector(
    (state: RootState) => state.generalInfoState.pendingDelegators
  );
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);
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

  const mapDelegatorSideMenuItem = (): Array<SideMenuItem> | undefined => {
    // if the current user is not a groupAdmin can also see own PG notifications,
    // else it sees only delegated notifications and we return undefined
    if (!loggedUser.hasGroup) {
      return [
        {
          label: t('menu.notifiche-impresa'),
          route: routes.NOTIFICHE,
        },
        {
          label: t('menu.notifiche-delegato'),
          route: routes.NOTIFICHE_DELEGATO,
        },
      ];
    } else {
      return undefined;
    }
  };

  const notificationMenuItems: Array<SideMenuItem> | undefined = mapDelegatorSideMenuItem();

  // TODO spostare questo in un file di utility
  const menuItems: Array<SideMenuItem> = [
    {
      label: !loggedUser.hasGroup ? t('menu.notifiche') : t('menu.notifiche-delegato'),
      icon: MailOutlineIcon,
      route: !loggedUser.hasGroup ? routes.NOTIFICHE : routes.NOTIFICHE_DELEGATO,
      children: notificationMenuItems,
      notSelectable: notificationMenuItems && notificationMenuItems.length > 0,
    },
    {
      label: t('menu.app-status'),
      // ATTENTION - a similar logic to choose the icon and its color is implemented in AppStatusBar (in pn-commons)
      icon: () =>
        currentStatus ? (
          currentStatus.appIsFullyOperative ? (
            <CheckCircleIcon sx={{ color: 'success.main' }} />
          ) : (
            <ErrorIcon sx={{ color: 'error.main' }} />
          )
        ) : (
          <HelpIcon />
        ),
      route: routes.APP_STATUS,
    },
  ];

  if (userHasAdminPermissions) {
    /* eslint-disable-next-line functional/immutable-data */
    menuItems.splice(1, 0, {
      label: t('menu.deleghe'),
      icon: () => <AltRouteIcon />,
      route: routes.DELEGHE,
      rightBadgeNotification: pendingDelegators ? pendingDelegators : undefined,
    });
  }

  if (userHasAdminPermissions && !loggedUser.hasGroup) {
    /* eslint-disable-next-line functional/immutable-data */
    menuItems.splice(2, 0, {
      label: t('menu.contacts'),
      icon: MarkunreadMailboxIcon,
      route: routes.RECAPITI,
    });
  }

  if (IS_B2B_ENABLED) {
    /* eslint-disable-next-line functional/immutable-data */
    menuItems.splice(3, 0, {
      label: t('menu.integrazione-api'),
      icon: SettingsEthernet,
      route: routes.INTEGRAZIONE_API,
    });
  }

  const selfcareMenuItems: Array<SideMenuItem> = [
    {
      label: t('menu.users'),
      icon: People,
      route: routes.USERS(organization?.id, i18n.language),
    },
    {
      label: t('menu.groups'),
      icon: SupervisedUserCircle,
      route: routes.GROUPS(organization?.id, i18n.language),
    },
  ];

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
    /* eslint-disable-next-line functional/immutable-data */
    window.location.href = sessionToken
      ? `${SELFCARE_BASE_URL}/assistenza`
      : `mailto:${PAGOPA_HELP_EMAIL}`;
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

  return (
    <>
      <ResponseEventDispatcher />
      <Layout
        showHeader
        showFooter
        onExitAction={handleUserLogout}
        sideMenu={<SideMenu menuItems={menuItems} selfCareItems={selfcareMenuItems} />}
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
      >
        <PnDialog open={openModal}>
          <DialogTitle sx={{ mb: 2 }}>{t('header.logout-message')}</DialogTitle>
          <PnDialogActions>
            <Button id="cancelButton" variant="outlined" onClick={() => setOpenModal(false)}>
              {t('button.annulla')}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                sessionStorage.clear();
                goToLoginPortal();
                setOpenModal(false);
              }}
            >
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
