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
import { Box, Button, DialogTitle } from '@mui/material';
import {
  APP_VERSION,
  AppMessage,
  AppResponse,
  AppResponseError,
  AppResponseMessage,
  Layout,
  PnDialog,
  PnDialogActions,
  ResponseEventDispatcher,
  SideMenu,
  SideMenuItem,
  addParamToUrl,
  appStateActions,
  errorFactoryManager,
  initLocalization,
  useMultiEvent,
  useTracking,
} from '@pagopa-pn/pn-commons';
import { ProductEntity } from '@pagopa/mui-italia';

import { PFEventsType } from './models/PFEventsType';
import { getCurrentEventTypePage, goToLoginPortal } from './navigation/navigation.utility';
import Router from './navigation/routes';
import * as routes from './navigation/routes.const';
import { getCurrentAppStatus } from './redux/appStatus/actions';
import { getDigitalAddresses } from './redux/contact/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { getSidemenuInformation } from './redux/sidemenu/actions';
import { RootState } from './redux/store';
import { getConfiguration } from './services/configuration.service';
import { PFAppErrorFactory } from './utility/AppError/PFAppErrorFactory';
import PFEventStrategyFactory from './utility/MixpanelUtils/PFEventStrategyFactory';
import showLayoutParts from './utility/layout.utility';
import './utility/onetrust';
import { apiLogout } from './redux/auth/actions';

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
// ----------------------------------------
// Carlos Lombardi, 2023.05.26
// ----------------------------------------
const App = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation(['common', 'notifiche']);
  const [isInitialized, setIsInitialized] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const lastError = useAppSelector((state: RootState) => state.appState.lastError);
  const { tosConsent, fetchedTos, privacyConsent, fetchedPrivacy } = useAppSelector(
    (state: RootState) => state.userState
  );
  const { pendingDelegators, delegators } = useAppSelector(
    (state: RootState) => state.generalInfoState
  );
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { MIXPANEL_TOKEN, PAGOPA_HELP_EMAIL } = getConfiguration();

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

  const [showHeader, showFooter, showSideMenu, showHeaderProduct, showAssistanceButton] = useMemo(
    () =>
      showLayoutParts(
        pathname,
        !!sessionToken,
        tosConsent && tosConsent.accepted && fetchedTos,
        privacyConsent && privacyConsent.accepted && fetchedPrivacy
      ),
    [pathname, sessionToken, tosConsent, fetchedTos, privacyConsent, fetchedPrivacy]
  );

  const userActions = useMemo(() => {
    const profiloAction = {
      id: 'profile',
      label: t('menu.profilo'),
      onClick: () => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_VIEW_PROFILE, {
          source: 'user_menu',
        });
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

  useTracking(MIXPANEL_TOKEN, process.env.NODE_ENV);

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
      const mappedDelegators = delegators.map((delegator) => ({
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
    // if user is logged in, we redirect to support page
    // otherwise, we open the email provider
    if (sessionToken) {
      const url = addParamToUrl(routes.SUPPORT, "data", JSON.stringify(lastError));
      navigate(url);
      return;
    }
    /* eslint-disable-next-line functional/immutable-data */
    window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
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

  const handleEventTrackingCallbackAppCrash = (e: Error, eInfo: ErrorInfo) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_GENERIC_ERROR, {
      reason: { error: e, errorInfo: eInfo },
    });
  };

  const handleEventTrackingCallbackRefreshPage = () => {
    const pageType = getCurrentEventTypePage(pathname);
    if (pageType) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REFRESH_PAGE, { page: pageType });
    }
  };

  const handleEventTrackingToastErrorMessages = (
    error: AppResponseError,
    response: AppResponse
  ) => {
    const { traceId, status, action } = response;

    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_TOAST_ERROR, {
      reason: error.code,
      traceId,
      page_name: getCurrentEventTypePage(pathname),
      message: error.message,
      httpStatusCode: status,
      action,
    });
  };

  const performLogout = async () => {
    await dispatch(apiLogout(loggedUser.sessionToken));

    sessionStorage.clear();
    goToLoginPortal();
    setOpenModal(false);
  };

  useEffect(() => {
    if (sessionToken !== '') {
      void dispatch(getDigitalAddresses());
      void dispatch(getSidemenuInformation());
      void dispatch(getCurrentAppStatus());
    }
  }, [sessionToken]);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      // init localization
      initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
      // eslint-disable-next-line functional/immutable-data
      errorFactoryManager.factory = new PFAppErrorFactory((path, ns) => t(path, { ns }));
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return <div></div>;
  }

  return (
    <>
      <ResponseEventDispatcher />
      <Layout
        showHeader={showHeader}
        showFooter={showFooter}
        sideMenu={<SideMenu menuItems={menuItems} />}
        showSideMenu={showSideMenu}
        productsList={productsList}
        showHeaderProduct={showHeaderProduct}
        loggedUser={jwtUser}
        enableUserDropdown
        userActions={userActions}
        currentLanguage={i18n.language}
        onLanguageChanged={changeLanguageHandler}
        onAssistanceClick={handleAssistanceClick}
        isLogged={!!sessionToken}
        hasTermsOfService={true}
        eventTrackingCallbackAppCrash={handleEventTrackingCallbackAppCrash}
        eventTrackingCallbackRefreshPage={handleEventTrackingCallbackRefreshPage}
        enableAssistanceButton={showAssistanceButton}
      >
        <PnDialog open={openModal}>
          <DialogTitle sx={{ mb: 2 }}>{t('header.logout-message')}</DialogTitle>
          <PnDialogActions>
            <Button id="cancelButton" variant="outlined" onClick={() => setOpenModal(false)}>
              {t('button.annulla')}
            </Button>
            <Button
              data-testid="confirm-button"
              variant="contained"
              onClick={performLogout}
            >
              {t('header.logout')}
            </Button>
          </PnDialogActions>
        </PnDialog>
        {/* <AppMessage sessionRedirect={async () => await dispatch(logout())} /> */}
        <AppMessage />
        <AppResponseMessage
          eventTrackingToastErrorMessages={handleEventTrackingToastErrorMessages}
        />
        <Router />
      </Layout>
      <Box onClick={clickVersion} sx={{ height: '5px', background: 'white' }}></Box>
    </>
  );
};

export default App;
