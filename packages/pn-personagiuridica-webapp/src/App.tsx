import { ErrorInfo, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import { People, SupervisedUserCircle } from '@mui/icons-material';
import { Box } from '@mui/material';

import { PartyEntity, ProductSwitchItem } from '@pagopa/mui-italia';

import {
  AppMessage,
  AppResponseMessage,
  // momentarily commented for pn-5157
  // AppRouteType,
  appStateActions,
  errorFactoryManager,
  initLocalization,
  Layout,
  ResponseEventDispatcher,
  SideMenu,
  SideMenuItem,
  useHasPermissions,
  useMultiEvent,
  useTracking,
  useUnload,
} from '@pagopa-pn/pn-commons';

import * as routes from './navigation/routes.const';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState, store } from './redux/store';
import { getDomicileInfo, getSidemenuInformation } from './redux/sidemenu/actions';
import { PNRole } from './redux/auth/types';
import { trackEventByType } from './utils/mixpanel';
import { TrackEventType } from './utils/events';
import './utils/onetrust';
import { PGAppErrorFactory } from './utils/AppError/PGAppErrorFactory';
import { goToLoginPortal } from './navigation/navigation.utility';
import { setUpInterceptor } from './api/interceptors';
import { getCurrentAppStatus } from './redux/appStatus/actions';
import { getConfiguration } from './services/configuration.service';

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

  return isInitialized ? <ActualApp /> : <div/>;
};

const ActualApp = () => {
  const { MIXPANEL_TOKEN, PAGOPA_HELP_EMAIL, VERSION } = getConfiguration();
  setUpInterceptor(store);
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
  const { pathname } = useLocation();
  const path = pathname.split('/');
  const source = path[path.length - 1];

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

  // TODO: get products list from be (?)
  const productsList: Array<ProductSwitchItem> = useMemo(
    () => [
      {
        id: '1',
        title: t('header.product.organization-dashboard'),
        productUrl: routes.PROFILE(organization?.id),
        linkType: 'external',
      },
      {
        id: '0',
        title: t('header.product.notification-platform'),
        productUrl: '',
        linkType: 'internal',
      },
    ],
    [t, organization?.id]
  );

  useUnload(() => {
    trackEventByType(TrackEventType.APP_UNLOAD);
  });

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
    { label: t('menu.users'), icon: People, route: routes.USERS(organization?.id) },
    { label: t('menu.groups'), icon: SupervisedUserCircle, route: routes.GROUPS(organization?.id) },
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
    [role, organization]
  );

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  const handleAssistanceClick = () => {
    trackEventByType(TrackEventType.CUSTOMER_CARE_MAILTO, { source: 'postlogin' });
    /* eslint-disable-next-line functional/immutable-data */
    window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
  };

  const handleEventTrackingCallbackAppCrash = (e: Error, eInfo: ErrorInfo) => {
    trackEventByType(TrackEventType.APP_CRASH, {
      route: source,
      stacktrace: { error: e, errorInfo: eInfo },
    });
  };

  const handleEventTrackingCallbackFooterChangeLanguage = () => {
    trackEventByType(TrackEventType.FOOTER_LANG_SWITCH);
  };

  const handleEventTrackingCallbackProductSwitch = (target: string) => {
    trackEventByType(TrackEventType.USER_PRODUCT_SWITCH, { target });
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
    // momentarily commented for pn-5157
    // goToLoginPortal(AppRouteType.PG);
    goToLoginPortal();
  };

  return (
    <>
      <ResponseEventDispatcher />
      <Layout
        showHeader={!isPrivacyPage}
        showFooter={!isPrivacyPage}
        onExitAction={handleUserLogout}
        eventTrackingCallbackAppCrash={handleEventTrackingCallbackAppCrash}
        eventTrackingCallbackFooterChangeLanguage={handleEventTrackingCallbackFooterChangeLanguage}
        eventTrackingCallbackProductSwitch={(target) =>
          handleEventTrackingCallbackProductSwitch(target)
        }
        sideMenu={
          <SideMenu
            menuItems={menuItems}
            selfCareItems={selfcareMenuItems}
            eventTrackingCallback={(target) =>
              trackEventByType(TrackEventType.USER_NAV_ITEM, { target })
            }
          />
        }
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
