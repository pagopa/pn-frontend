import { ErrorInfo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import AltRouteIcon from '@mui/icons-material/AltRoute';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box } from '@mui/material';
import {
  AppMessage,
  AppResponseMessage,
  Layout,
  ResponseEventDispatcher,
  SideMenu,
  SideMenuItem, // AppRouteType,
  appStateActions,
  errorFactoryManager,
  initLocalization,
  useMultiEvent,
  useTracking,
  useUnload,
} from '@pagopa-pn/pn-commons';
import { ProductEntity } from '@pagopa/mui-italia';

import { goToLoginPortal } from './navigation/navigation.utility';
import Router from './navigation/routes';
import * as routes from './navigation/routes.const';
import { getCurrentAppStatus } from './redux/appStatus/actions';
import { logout } from './redux/auth/actions';
import { Delegation } from './redux/delegation/types';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { getDomicileInfo, getSidemenuInformation } from './redux/sidemenu/actions';
import { RootState } from './redux/store';
import { getConfiguration } from './services/configuration.service';
import { PFAppErrorFactory } from './utility/AppError/PFAppErrorFactory';
import { TrackEventType } from './utility/events';
import { trackEventByType } from './utility/mixpanel';
import './utility/onetrust';

// TODO: get products list from be (?)
const productsList: Array<ProductEntity> = [
  {
    id: '0',
    title: `SEND - Servizio Notifiche Digitali`,
    productUrl: '',
    linkType: 'internal',
  },
];

// Cfr. PN-6096
// --------------------
// The i18n initialization must execute before the *first* time anything is actually rendered.
// Otherwise, if a component is rendered before the i18n initialization is actually executed,
// won't be able to access to the actual translations.
// E.g. if a user types the URL with the path /non-accessbile, the App component runs just once.
// In "normal" cases, the SessionGuard initialization forces App to render more than one
// and therefore to make i18n to be initialized by the time something actually renders.
//
// In turn, adding the ternary operator in the return statement provokes
// the "too high computational complexity" warning to appear
// (in fact it jumps to <= 15 to 30!!).
// The only way I found to prevent it is to split the initialization in a separate React component.
// ----------------------------------------
// Carlos Lombardi, 2023.05.26
// ----------------------------------------
const App = () => {
  const { t } = useTranslation(['common', 'notifiche']);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      // init localization
      initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
      // eslint-disable-next-line functional/immutable-data
      errorFactoryManager.factory = new PFAppErrorFactory((path, ns) => t(path, { ns }));
    }
  }, [isInitialized]);

  return isInitialized ? <ActualApp /> : <div />;
};

const ActualApp = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation(['common', 'notifiche']);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const { tosConsent, fetchedTos, privacyConsent, fetchedPrivacy } = useAppSelector(
    (state: RootState) => state.userState
  );
  const { pendingDelegators, delegators } = useAppSelector(
    (state: RootState) => state.generalInfoState
  );
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = pathname.split('/');
  const source = path[path.length - 1];
  const { MIXPANEL_TOKEN, PAGOPA_HELP_EMAIL, VERSION } = getConfiguration();

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

  const userActions = useMemo(() => {
    const profiloAction = {
      id: 'profile',
      label: t('menu.profilo'),
      onClick: () => {
        trackEventByType(TrackEventType.USER_VIEW_PROFILE);
        navigate(routes.PROFILO);
      },
      icon: <SettingsIcon fontSize="small" color="inherit" />,
    };
    const logoutAction = {
      id: 'logout',
      label: t('header.logout'),
      onClick: () => handleUserLogout(),
      icon: <LogoutRoundedIcon fontSize="small" color="inherit" />,
    };
    return tosConsent && tosConsent.accepted && privacyConsent && privacyConsent.accepted
      ? [profiloAction, logoutAction]
      : [logoutAction];
  }, [tosConsent, privacyConsent, i18n.language]);

  useUnload(() => {
    trackEventByType(TrackEventType.APP_UNLOAD);
  });

  useTracking(MIXPANEL_TOKEN, process.env.NODE_ENV);

  useEffect(() => {
    if (sessionToken !== '') {
      void dispatch(getDomicileInfo());
      void dispatch(getSidemenuInformation());
      void dispatch(getCurrentAppStatus());
    }
  }, [sessionToken]);

  const mapDelegatorSideMenuItem = (): Array<SideMenuItem> | undefined => {
    // Implementazione esplorativa su come potrebbe gestire l'errore dell'API
    // che restituisce i delegators per il sideMenu.
    //
    // attenzione - per far funzionare questo si deve cambiare dove dice
    //     sideMenuDelegators.length > 0,  deve cambiarsi per ... > 1
    // si deve anche abilitare la gestione errori nell'action di getSidemenuInformation
    //
    // if (hasApiErrors(SIDEMENU_ACTIONS.GET_SIDEMENU_INFORMATION)) {
    //   return [{
    //     label: "Qualcuno/a ha delegato su di te?",
    //     route: "",
    //     action: () => dispatch(getSidemenuInformation()),
    //   }];
    // } else
    if (delegators.length > 0) {
      const myNotifications = {
        label: t('title', { ns: 'notifiche' }),
        route: routes.NOTIFICHE,
      };
      const mappedDelegators = delegators.map((delegator: Delegation) => ({
        label:
          'delegator' in delegator && delegator.delegator
            ? `${delegator.delegator.displayName}`
            : 'No Name Found',
        route:
          'delegator' in delegator && delegator.delegator
            ? routes.GET_NOTIFICHE_DELEGATO_PATH(delegator.mandateId)
            : '*',
      }));
      return [myNotifications, ...mappedDelegators];
    } else {
      return undefined;
    }
  };

  const sideMenuDelegators = mapDelegatorSideMenuItem();

  // TODO spostare questo in un file di utility
  const menuItems: Array<SideMenuItem> = [
    {
      label: t('menu.notifiche'),
      icon: MailOutlineIcon,
      route: routes.NOTIFICHE,
      children: sideMenuDelegators,
      notSelectable: sideMenuDelegators && sideMenuDelegators.length > 0,
    },
    { label: t('menu.contacts'), icon: MarkunreadMailboxIcon, route: routes.RECAPITI },
    {
      label: t('menu.deleghe'),
      icon: AltRouteIcon,
      route: routes.DELEGHE,
      rightBadgeNotification: pendingDelegators ? pendingDelegators : undefined,
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
    // goToLoginPortal(AppRouteType.PF);
    goToLoginPortal();
  };

  return (
    <>
      <ResponseEventDispatcher />
      <Layout
        showHeader={!isPrivacyPage}
        showFooter={!isPrivacyPage}
        eventTrackingCallbackAppCrash={handleEventTrackingCallbackAppCrash}
        eventTrackingCallbackFooterChangeLanguage={handleEventTrackingCallbackFooterChangeLanguage}
        eventTrackingCallbackProductSwitch={(target) =>
          handleEventTrackingCallbackProductSwitch(target)
        }
        sideMenu={
          <SideMenu
            menuItems={menuItems}
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
        showHeaderProduct={
          tosConsent && tosConsent.accepted && privacyConsent && privacyConsent.accepted
        }
        loggedUser={jwtUser}
        enableUserDropdown
        userActions={userActions}
        onLanguageChanged={changeLanguageHandler}
        onAssistanceClick={handleAssistanceClick}
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
