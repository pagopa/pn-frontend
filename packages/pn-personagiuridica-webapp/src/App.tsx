import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { People, SupervisedUserCircle } from '@mui/icons-material';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import { Box } from '@mui/material';
import {
  AppMessage,
  AppResponseMessage,
  Layout,
  ResponseEventDispatcher,
  SideMenu,
  SideMenuItem,
  appStateActions,
  errorFactoryManager,
  getSessionLanguage,
  initLocalization,
  setSessionLanguage,
  useHasPermissions,
  useMultiEvent,
  useTracking,
} from '@pagopa-pn/pn-commons';
import { PartyEntity, ProductEntity } from '@pagopa/mui-italia';

import Router from './navigation/routes';
import * as routes from './navigation/routes.const';
import { getCurrentAppStatus } from './redux/appStatus/actions';
import { logout } from './redux/auth/actions';
import { PNRole } from './redux/auth/types';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { getDomicileInfo, getSidemenuInformation } from './redux/sidemenu/actions';
import { RootState } from './redux/store';
import { getConfiguration } from './services/configuration.service';
import { PGAppErrorFactory } from './utility/AppError/PGAppErrorFactory';
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

const ActualApp = () => {
  const { MIXPANEL_TOKEN, PAGOPA_HELP_EMAIL, VERSION, SELFCARE_BASE_URL } = getConfiguration();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation(['common', 'notifiche']);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const { tosConsent, fetchedTos, privacyConsent, fetchedPrivacy } = useAppSelector(
    (state: RootState) => state.userState
  );
  const pendingDelegators = useAppSelector(
    (state: RootState) => state.generalInfoState.pendingDelegators
  );
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);
  const { pathname, hash } = useLocation();
  const path = pathname.split('/');

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

  const isPrivacyPage = path[1] === 'privacy-tos';
  const organization = loggedUser.organization;
  const role = loggedUser.organization?.roles ? loggedUser.organization?.roles[0] : null;
  const userHasAdminPermissions = useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]);

  const handleSetUserLanguage = useCallback(() => {
    const langParam = new URLSearchParams(hash).get('lang');
    const language = langParam || getSessionLanguage() || 'it';
    void changeLanguageHandler(language);
  }, [location]);

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
        void dispatch(getDomicileInfo());
      }

      void dispatch(getCurrentAppStatus());
      handleSetUserLanguage();
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
        logoUrl: undefined,
        // non posso settare un'icona di MUI perché @pagopa/mui-italia accetta solo string o undefined come logoUrl
        // ma fortunatamente, se si passa undefined, fa vedere proprio il logo che ci serve
        // ------------------
        // Carlos Lombardi, 2022.07.28
        // logoUrl: <AccountBalanceIcon />
      },
    ],
    [role, organization, i18n.language]
  );

  const changeLanguageHandler = async (langCode: string) => {
    setSessionLanguage(langCode);
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
          message: `v${VERSION}`,
        })
      ),
  });

  const handleUserLogout = () => {
    void dispatch(logout());
  };

  return (
    <>
      <ResponseEventDispatcher />
      <Layout
        showHeader={!isPrivacyPage}
        showFooter={!isPrivacyPage}
        onExitAction={handleUserLogout}
        sideMenu={<SideMenu menuItems={menuItems} selfCareItems={selfcareMenuItems} />}
        showSideMenu={
          !!sessionToken &&
          tosConsent &&
          tosConsent.accepted &&
          fetchedTos &&
          privacyConsent &&
          privacyConsent.accepted &&
          fetchedPrivacy &&
          !isPrivacyPage
        }
        productsList={productsList}
        productId={'0'}
        showHeaderProduct={
          tosConsent && tosConsent.accepted && privacyConsent && privacyConsent.accepted
        }
        loggedUser={jwtUser}
        onLanguageChanged={changeLanguageHandler}
        onAssistanceClick={handleAssistanceClick}
        partyList={partyList}
        isLogged={!!sessionToken}
        hasTermsOfService={true}
      >
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
