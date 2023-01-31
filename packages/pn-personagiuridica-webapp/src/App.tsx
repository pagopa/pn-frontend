import { ErrorInfo, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
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
  AppRouteType,
  appStateActions,
  errorFactoryManager,
  initLocalization,
  Layout,
  ResponseEventDispatcher,
  SideMenu,
  SideMenuItem,
  useMultiEvent,
  useTracking,
  useUnload,
} from '@pagopa-pn/pn-commons';

import * as routes from './navigation/routes.const';
import Router from './navigation/routes';
import { logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { MIXPANEL_TOKEN, PAGOPA_HELP_EMAIL, VERSION } from './utils/constants';
import { RootState, store } from './redux/store';
import {
  getDomicileInfo,
  // getSidemenuInformation
} from './redux/sidemenu/actions';
import { trackEventByType } from './utils/mixpanel';
import { TrackEventType } from './utils/events';
import './utils/onetrust';
import { PFAppErrorFactory } from './utils/AppError/PFAppErrorFactory';
import { goToLoginPortal } from './navigation/navigation.utility';
import { setUpInterceptor } from './api/interceptors';
import { getCurrentAppStatus } from './redux/appStatus/actions';

// TODO: get products list from be (?)
const productsList: Array<ProductSwitchItem> = [
  {
    id: '0',
    title: `Piattaforma Notifiche`,
    productUrl: '',
    linkType: 'internal',
  },
];

const App = () => {
  setUpInterceptor(store);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation(['common', 'notifiche']);
  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const { tos, fetchedTos } = useAppSelector((state: RootState) => state.userState);
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
  const role = loggedUser.organization?.roles[0];

  useUnload(() => {
    trackEventByType(TrackEventType.APP_UNLOAD);
  });

  useTracking(MIXPANEL_TOKEN, process.env.NODE_ENV);

  useEffect(() => {
    // init localization
    initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
    // eslint-disable-next-line functional/immutable-data
    errorFactoryManager.factory = new PFAppErrorFactory((path, ns) => t(path, { ns }));
  }, []);

  useEffect(() => {
    if (sessionToken !== '') {
      void dispatch(getDomicileInfo());
      // void dispatch(getSidemenuInformation());
      void dispatch(getCurrentAppStatus());
    }
  }, [sessionToken]);

  const notificationMenuItems: Array<SideMenuItem> = [
    {
      label: t('menu.notifiche'),
      route: routes.NOTIFICHE,
    },
  ];

  // TODO spostare questo in un file di utility
  const menuItems: Array<SideMenuItem> = [
    {
      label: t('menu.notifiche'),
      icon: MailOutlineIcon,
      route: routes.NOTIFICHE,
      children: notificationMenuItems,
      notSelectable: notificationMenuItems && notificationMenuItems.length > 0,
    },
    { label: t('menu.contacts'), icon: MarkunreadMailboxIcon, route: routes.RECAPITI },
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

  const selfcareMenuItems: Array<SideMenuItem> = [
    { label: t('menu.users'), icon: People, route: routes.USERS },
    { label: t('menu.groups'), icon: SupervisedUserCircle, route: routes.GROUPS },
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

    goToLoginPortal(AppRouteType.PG);
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
        showSideMenu={!!sessionToken && tos && fetchedTos && !isPrivacyPage}
        productsList={productsList}
        showHeaderProduct={tos}
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
