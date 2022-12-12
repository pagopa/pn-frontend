import Email from '@mui/icons-material/Email';
import VpnKey from '@mui/icons-material/VpnKey';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import { Box } from '@mui/material';
import {
  AppMessage,
  AppResponseMessage,
  appStateActions,
  initLocalization,
  Layout,
  LoadingOverlay,
  ResponseEventDispatcher,
  SideMenu,
  SideMenuItem,
  useErrors,
  useMultiEvent,
  useTracking,
  useUnload
} from '@pagopa-pn/pn-commons';
import { PartyEntity, ProductSwitchItem } from '@pagopa/mui-italia';
import { ErrorInfo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import Router from './navigation/routes';
import { AUTH_ACTIONS, getOrganizationParty, logout } from './redux/auth/actions';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { RootState, store } from './redux/store';
import { getMenuItems } from './utils/role.utility';

import * as routes from './navigation/routes.const';
import { getCurrentAppStatus } from './redux/appStatus/actions';
import { PAGOPA_HELP_EMAIL, SELFCARE_BASE_URL, VERSION, MIXPANEL_TOKEN } from './utils/constants';
import { TrackEventType } from './utils/events';
import { trackEventByType } from './utils/mixpanel';
import './utils/onetrust';
import { setUpInterceptor } from "./api/interceptors";

const App = () => {
  useUnload(() => {
    trackEventByType(TrackEventType.APP_UNLOAD);
  });
  setUpInterceptor(store);

  const loggedUser = useAppSelector((state: RootState) => state.userState.user);
  const loggedUserOrganizationParty = useAppSelector(
    (state: RootState) => state.userState.organizationParty
  );
  const { tos } = useAppSelector((state: RootState) => state.userState);
  const currentStatus = useAppSelector((state: RootState) => state.appStatus.currentStatus);

  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation(['common', 'notifiche']);
  const { hasApiErrors } = useErrors();

  // TODO check if it can exist more than one role on user
  const role = loggedUser.organization?.roles[0];
  const idOrganization = loggedUser.organization?.id;
  const sessionToken = loggedUser.sessionToken;

  const menuItems = useMemo(() => {
    const basicMenuItems: Array<SideMenuItem> = [
      { label: 'menu.notifications', icon: Email, route: routes.DASHBOARD },
      /**
       * Refers to PN-1741
       * Commented out because beyond MVP scope
       * 
       * LINKED TO:
       * - "<Route path={routes.API_KEYS}.../>" in packages/pn-pa-webapp/src/navigation/routes.tsx
       * - BasicMenuItems in packages/pn-pa-webapp/src/utils/__TEST__/role.utilitytest.ts
       */
      { label: 'menu.api-key', icon: VpnKey, route: routes.API_KEYS },
      { 
        label: 'menu.app-status', 
        // ATTENTION - a similar logic to choose the icon and its color is implemented in AppStatusBar (in pn-commons)
        icon: () => currentStatus 
          ? (currentStatus.appIsFullyOperative
            ? <CheckCircleIcon sx={{ color: 'success.main' }} />
            : <ErrorIcon sx={{ color: 'error.main' }} />)
          : <HelpIcon />
        , 
        route: routes.APP_STATUS 
      },
    ];

    // As the basicMenuItems definition now accesses the MUI theme and the Redux store,
    // it would be cumbersome to include it in a "raw" (i.e. not linked to React) function.
    // I preferred to define the basicMenuItems in the App React component,
    // and pass them to the getMenuItems function, which just decides whether to include the selfCareItems or not.
    // In turn, as basicMenuItems is defined in the React component, the definition can also access
    // the i18n mechanism, so that is no longer needed to localize the labels afterwards.
    // -------------------------------
    // Carlos Lombardi, 2022.11.08
    // -------------------------------
    const items = { ...getMenuItems(basicMenuItems, idOrganization, role?.role) };
    // localize menu items
    /* eslint-disable-next-line functional/immutable-data */
    items.menuItems = items.menuItems.map((item) => ({ ...item, label: t(item.label) }));
    if (items.selfCareItems) {
      /* eslint-disable-next-line functional/immutable-data */
      items.selfCareItems = items.selfCareItems.map((item) => ({ ...item, label: t(item.label) }));
    }
    return items;
  }, [role, idOrganization, currentStatus]);

  const jwtUser = useMemo(
    () => ({
      id: loggedUser.fiscal_number,
      name: loggedUser.name,
      surname: loggedUser.family_name,
    }),
    [loggedUser]
  );

  // TODO: get products list from be (?)
  const productsList: Array<ProductSwitchItem> = useMemo(
    () => [
      {
        id: '1',
        title: t('header.reserved-area'),
        productUrl: `${SELFCARE_BASE_URL as string}/dashboard/${idOrganization}`,
        linkType: 'external',
      },
      {
        id: '0',
        title: t('header.notification-platform'),
        productUrl: '',
        linkType: 'internal',
      },
    ],
    [idOrganization]
  );

  const partyList: Array<PartyEntity> = useMemo(
    () => [
      {
        id: '0',
        name: loggedUserOrganizationParty.name,
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
    [role, loggedUserOrganizationParty]
  );

  useEffect(() => {
    // init localization
    initLocalization((namespace, path, data) => t(path, { ns: namespace, ...data }));
  }, []);

  useTracking(MIXPANEL_TOKEN, process.env.NODE_ENV);

  useEffect(() => {
    if (idOrganization) {
      void dispatch(getOrganizationParty(idOrganization));
    }
  }, [idOrganization]);

  useEffect(() => {
    if (sessionToken) {
      void dispatch(getCurrentAppStatus());
    }
  }, [sessionToken, getCurrentAppStatus]);

  const { pathname } = useLocation();
  const path = pathname.split('/');
  const source = path[path.length - 1];
  const isPrivacyPage = path[1] === 'privacy-tos';

  const hasFetchOrganizationPartyError = hasApiErrors(AUTH_ACTIONS.GET_ORGANIZATION_PARTY);

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

  const handleLogout = () => {
    void dispatch(logout());
  };

  const handleAssistanceClick = () => {
    trackEventByType(TrackEventType.CUSTOMER_CARE_MAILTO, { source: 'postlogin' });
    /* eslint-disable-next-line functional/immutable-data */
    window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
  };

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
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

  return (
    <>
      <ResponseEventDispatcher />
      <Layout
        showHeader={!isPrivacyPage}
        showFooter={!isPrivacyPage}
        onExitAction={handleLogout}
        eventTrackingCallbackAppCrash={handleEventTrackingCallbackAppCrash}
        eventTrackingCallbackFooterChangeLanguage={handleEventTrackingCallbackFooterChangeLanguage}
        eventTrackingCallbackProductSwitch={(target: string) =>
          handleEventTrackingCallbackProductSwitch(target)
        }
        sideMenu={
          role &&
          menuItems && (
            <SideMenu
              menuItems={menuItems.menuItems}
              selfCareItems={menuItems.selfCareItems}
              eventTrackingCallback={(target: string) =>
                trackEventByType(TrackEventType.USER_NAV_ITEM, { target })
              }
            />
          )
        }
        showSideMenu={!!sessionToken && tos && !hasFetchOrganizationPartyError && !isPrivacyPage}
        productsList={productsList}
        productId={'0'}
        partyList={partyList}
        loggedUser={jwtUser}
        onLanguageChanged={changeLanguageHandler}
        onAssistanceClick={handleAssistanceClick}
        isLogged={!!sessionToken && !hasFetchOrganizationPartyError}
      >
        <AppMessage />
        <AppResponseMessage />
        <LoadingOverlay />
        <Router />
      </Layout>
      <Box onClick={clickVersion} sx={{ height: '5px', background: 'white' }}></Box>
    </>
  );
};
export default App;
